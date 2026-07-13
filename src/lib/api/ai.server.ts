import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

import { runFullIngestionIndex } from "./indexer.server";

const PROJECT_ROOT = process.cwd();
const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, "knowledge");
const EMBEDDINGS_FILE = path.join(KNOWLEDGE_DIR, "embeddings", "embeddings.json");

// Helper to compute cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Instantiate Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// GitHub API Fetcher
async function fetchGithubData(endpoint: string) {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "Cimil-Portfolio-AI-Assistant",
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/${endpoint}`, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching GitHub data from ${endpoint}:`, error);
    return null;
  }
}

// Server function: Trigger Ingestion
export const triggerIngestion = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      await runFullIngestionIndex();
      return { success: true, message: "Ingestion and vector indexing completed." };
    } catch (error: any) {
      console.error("[AI Server] Ingestion error:", error);
      return { success: false, error: error.message };
    }
  });

// Server function: Check Ingestion Status
export const getIngestionStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const hasEmbeddings = fs.existsSync(EMBEDDINGS_FILE);
    let size = 0;
    if (hasEmbeddings) {
      try {
        const stats = fs.statSync(EMBEDDINGS_FILE);
        size = stats.size;
      } catch (e) {}
    }
    return {
      indexed: hasEmbeddings,
      embeddingsCachedSize: size,
      hasApiKey: !!process.env.GEMINI_API_KEY,
    };
  });

// Server function: Query Assistant (RAG Pipeline)
export const queryAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      message: z.string(),
      history: z.array(
        z.object({
          role: z.enum(["user", "model"]),
          text: z.string(),
        })
      ),
    })
  )
  .handler(async ({ data }) => {
    const { message, history } = data;
    const ai = getGeminiClient();
    if (!ai) {
      return {
        text: "I'm sorry, the Gemini API is not configured on this server. Please add `GEMINI_API_KEY` to your environment variables.",
      };
    }

    // 1. If embeddings do not exist, run a bootstrap index
    if (!fs.existsSync(EMBEDDINGS_FILE)) {
      console.log("[AI Server] No vector store detected, running indexing...");
      try {
        await runFullIngestionIndex();
      } catch (err) {
        console.error("[AI Server] Failed to build vector store:", err);
        return {
          text: "I encountered an error rebuilding the knowledge base. Please check server logs.",
        };
      }
    }

    // 2. Load vector database
    let vectorDb: { chunk: { id: string; title: string; content: string; type: string }; vector: number[] }[] = [];
    try {
      vectorDb = JSON.parse(fs.readFileSync(EMBEDDINGS_FILE, "utf-8"));
    } catch (err) {
      console.error("[AI Server] Failed to parse embeddings file:", err);
      return { text: "Error loading local knowledge base embeddings." };
    }

    // 3. Check if user is asking for real-time GitHub stats, commits, or repos
    const isGithubQuery =
      message.toLowerCase().includes("github") ||
      message.toLowerCase().includes("repo") ||
      message.toLowerCase().includes("commit") ||
      message.toLowerCase().includes("git ");

    let githubContext = "";
    if (isGithubQuery) {
      console.log("[AI Server] Fetching GitHub info for query context...");
      try {
        const userProfile = await fetchGithubData("users/cimilcharly");
        const userRepos = await fetchGithubData("users/cimilcharly/repos?sort=updated&per_page=10");
        
        if (userProfile && userRepos) {
          const reposSummary = userRepos
            .slice(0, 5)
            .map((r: any) => `- [${r.name}](${r.html_url}) (${r.language || "N/A"}): ${r.description || "No description"}. Star count: ${r.stargazers_count}, forks: ${r.forks_count}`)
            .join("\n");
            
          githubContext = `\n[Real-time GitHub Stats for username 'cimilcharly']:\nPublic Repos: ${userProfile.public_repos}\nFollowers: ${userProfile.followers}\nFollowing: ${userProfile.following}\nBio: ${userProfile.bio}\n\nTop 5 Recently Updated Repositories:\n${reposSummary}\n`;
        }
      } catch (err) {
        console.error("Failed to append GitHub stats context:", err);
      }
    }

    // 4. Compute user query embedding
    let queryVector: number[] = [];
    try {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: message,
      });
      const values = response.embeddings?.[0]?.values;
      if (values) {
        queryVector = values;
      }
    } catch (error) {
      console.error("[AI Server] Error embedding query:", error);
      // Fallback: we will query the LLM without context or with minimal context if embedding fails
    }

    // 5. Query vector database (RAG retrieval)
    let retrievedChunks: typeof vectorDb = [];
    if (queryVector.length > 0) {
      const similarities = vectorDb.map((item) => ({
        ...item,
        similarity: cosineSimilarity(queryVector, item.vector),
      }));

      // Sort by similarity descending and select top 6
      similarities.sort((a, b) => b.similarity - a.similarity);
      retrievedChunks = similarities.slice(0, 6);
    }

    // 6. Build prompt context
    const contextText = retrievedChunks
      .map((item) => `[Source Type: ${item.chunk.type} | Title: ${item.chunk.title}]\n${item.chunk.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are Cimil Charly's Recruiter AI Assistant, integrated directly into his portfolio. Your goal is to answer recruiters' questions about Cimil, his skills, research, projects, education, internship, and resume.

Retrieve information from the provided context below.

Rules:
1. Speak professionally, warmly, and helpfully.
2. Only present facts present in the context. Never hallucinate details about projects, metrics, or technologies.
3. If a question is about projects, and we have project detail chunks, describe them thoroughly. Highlight Cimil's contribution, languages, databases, libraries, frameworks, APIs, and key features.
4. If a question cannot be answered from the retrieved context, politely let the user know you do not have that specific details, and guide them to use the contact form to message Cimil directly.
5. You can format code examples, technical terms, and link markdown syntax where appropriate.
6. The user may ask about GitHub, commits, or repos. Use the real-time GitHub section if available.

### Retrieved Context:
${contextText}

${githubContext ? `### GitHub Live Data Context:\n${githubContext}` : ""}

Provide the answer directly. Keep it well structured.`;

    // 7. Call Gemini model
    try {
      const chatContents = history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      }));

      // Append user's current message
      chatContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const contentsWithSystemPrompt = [
        {
          role: "user" as const,
          parts: [{ text: systemPrompt }],
        },
        ...chatContents,
      ];

      const completion = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: contentsWithSystemPrompt,
      });

      return {
        text: completion.text || "I was unable to formulate a response.",
      };
    } catch (error: any) {
      console.error("[AI Server] LLM completion error:", error);
      return {
        text: `Error invoking Gemini LLM: ${error.message || error}`,
      };
    }
  });

// Server function: Job Description Matcher
export const matchJobDescription = createServerFn({ method: "POST" })
  .inputValidator(z.object({ jobDescription: z.string() }))
  .handler(async ({ data }) => {
    const { jobDescription } = data;
    const ai = getGeminiClient();
    if (!ai) {
      return {
        error: "Gemini API key is not configured.",
      };
    }

    // 1. Gather all profile info, skills, education, and projects metadata to construct complete resume context
    let profileData = {};
    let skillsData = {};
    let experienceData = [];
    const projectsData: any[] = [];

    try {
      if (fs.existsSync(path.join(KNOWLEDGE_DIR, "profile.json"))) {
        profileData = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, "profile.json"), "utf-8"));
      }
      if (fs.existsSync(path.join(KNOWLEDGE_DIR, "skills.json"))) {
        skillsData = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, "skills.json"), "utf-8"));
      }
      if (fs.existsSync(path.join(KNOWLEDGE_DIR, "experience.json"))) {
        experienceData = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, "experience.json"), "utf-8"));
      }

      const projectsMetaDir = path.join(KNOWLEDGE_DIR, "projects");
      if (fs.existsSync(projectsMetaDir)) {
        const metaFiles = fs.readdirSync(projectsMetaDir);
        for (const file of metaFiles) {
          if (file.endsWith(".json")) {
            projectsData.push(JSON.parse(fs.readFileSync(path.join(projectsMetaDir, file), "utf-8")));
          }
        }
      }
    } catch (e) {
      console.error("Error gathering profile data for matcher:", e);
    }

    const candidateProfile = {
      profile: profileData,
      skills: skillsData,
      experience: experienceData,
      projects: projectsData,
    };

    const prompt = `You are an expert technical recruiter and talent advisor.
Compare the candidate profile below with the provided Job Description (JD).
Evaluate the match percentage, identify matching and missing skills, highlight the candidate's most relevant projects, suggest updates to the resume (e.g., phrasing adjustments, keyword additions), and outline a learning roadmap to bridge any key gaps.

### Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

### Job Description:
${jobDescription}

Generate the response in JSON format. Provide the response as raw JSON matching the JSON schema below. Do not wrap the JSON in markdown code blocks.

Schema:
{
  "matchPercentage": 75,
  "matchingSkills": ["Python", "FastAPI", "React", "Docker"],
  "missingSkills": ["Kubernetes", "AWS SageMaker", "CI/CD Actions"],
  "relevantProjects": [
    {
      "id": "sentinel-ai",
      "name": "Sentinel AI",
      "reason": "This project features a fully functional FastAPI backend with hybrid AI threat detection pipelines, matching the backend and ML requirements in the JD."
    }
  ],
  "resumeSuggestions": [
    "Highlight experience with role-based access control (RBAC) in the Sentinel AI description.",
    "Explicitly mention your B.Tech course load on Distributed Systems to cover scalable systems design."
  ],
  "learningRoadmap": [
    {
      "step": "1. Deploy with Kubernetes",
      "topic": "Container orchestration",
      "details": "Containerize backend modules, write deployment.yaml/service.yaml and test locally using Minikube."
    },
    {
      "step": "2. Study Cloud Deployments",
      "topic": "AWS Cloud Foundations",
      "details": "Gain hands-on familiarity with AWS SageMaker and EC2 instances."
    }
  ]
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const resultText = response.text || "";
      const cleanedJSON = resultText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      return JSON.parse(cleanedJSON);
    } catch (error: any) {
      console.error("[AI Server] JD Matcher error:", error);
      return {
        error: `Failed to compute job description match: ${error.message || error}`,
      };
    }
  });

// Server function: Fetch github stats directly for client use
export const getGitHubRepos = createServerFn({ method: "POST" })
  .inputValidator(z.object({ limit: z.number().optional().default(10) }))
  .handler(async ({ data }) => {
    const limit = data.limit;
    try {
      const profile = await fetchGithubData("users/cimilcharly");
      const repos = await fetchGithubData(`users/cimilcharly/repos?sort=updated&per_page=${limit}`);
      return {
        profile,
        repos,
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  });
