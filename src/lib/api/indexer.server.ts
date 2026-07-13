import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import AdmZip from "adm-zip";
import { GoogleGenAI } from "@google/genai";

import { profile, experience, skillGroups, certifications } from "../../components/portfolio/data";

const PROJECT_ROOT = process.cwd();
const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, "knowledge");
const PROJECTS_DIR = path.join(PROJECT_ROOT, "projects");
const EXTRACTED_DIR = path.join(PROJECTS_DIR, ".extracted");

// Helper to ensure directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Instantiate Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[Indexer] GEMINI_API_KEY environment variable is not set. AI tasks will be skipped.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Bootstrap static portfolio information
export function bootstrapProfileData() {
  ensureDir(KNOWLEDGE_DIR);
  ensureDir(path.join(KNOWLEDGE_DIR, "projects"));
  ensureDir(path.join(KNOWLEDGE_DIR, "resume"));
  ensureDir(path.join(KNOWLEDGE_DIR, "embeddings"));

  // Write profile.json
  fs.writeFileSync(path.join(KNOWLEDGE_DIR, "profile.json"), JSON.stringify(profile, null, 2));

  // Write skills.json
  const skillsData = {
    groups: skillGroups,
    certifications: certifications,
  };
  fs.writeFileSync(path.join(KNOWLEDGE_DIR, "skills.json"), JSON.stringify(skillsData, null, 2));

  // Write experience.json
  fs.writeFileSync(path.join(KNOWLEDGE_DIR, "experience.json"), JSON.stringify(experience, null, 2));

  // Extract education from experience
  const educationEntries = experience.filter(
    (exp) =>
      exp.role.toLowerCase().includes("b.tech") ||
      exp.role.toLowerCase().includes("secondary") ||
      exp.company.toLowerCase().includes("university") ||
      exp.company.toLowerCase().includes("school")
  );
  fs.writeFileSync(path.join(KNOWLEDGE_DIR, "education.json"), JSON.stringify(educationEntries, null, 2));

  console.log("[Indexer] Bootstrapped static profile data successfully.");
}

// Transcribe Resume PDF to text using Gemini
export async function transcribeResumePdf(): Promise<string | null> {
  const resumeTextPath = path.join(KNOWLEDGE_DIR, "resume", "text.txt");
  if (fs.existsSync(resumeTextPath)) {
    console.log("[Indexer] Resume transcript already exists.");
    return fs.readFileSync(resumeTextPath, "utf-8");
  }

  const pdfPath = path.join(PROJECT_ROOT, "public", "Cimil_Charly_Resume.pdf");
  if (!fs.existsSync(pdfPath)) {
    console.warn(`[Indexer] Resume PDF not found at ${pdfPath}`);
    return null;
  }

  const ai = getGeminiClient();
  if (!ai) return null;

  console.log("[Indexer] Transcribing resume PDF using Gemini...");
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf",
              },
            },
            {
              text: "Transcribe this resume PDF into a comprehensive, well-structured markdown document. Make sure to capture all section details: projects, internship, work history, courses, achievements, and contact information. Output only the markdown.",
            },
          ],
        },
      ],
    });

    const text = response.text || "";
    if (text) {
      fs.writeFileSync(resumeTextPath, text, "utf-8");
      console.log("[Indexer] Resume transcribed and saved successfully.");
      return text;
    }
  } catch (error) {
    console.error("[Indexer] Error transcribing resume PDF:", error);
  }

  return null;
}

// Scan a directory recursively for files, ignoring standard noise patterns
interface FileInfo {
  relativePath: string;
  contentSnippet: string;
}

function scanProjectFiles(dir: string, baseDir: string, maxFiles = 30, currentCount = { val: 0 }): FileInfo[] {
  const results: FileInfo[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const ignoreList = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".vercel",
    ".lovable",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lock",
    ".next",
    ".cache",
    "__pycache__",
    ".idea",
    ".vscode",
    "venv",
    ".env",
  ];

  const ignoreExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".mp4",
    ".mp3",
    ".woff",
    ".woff2",
    ".eot",
    ".ttf",
  ];

  for (const entry of entries) {
    if (currentCount.val >= maxFiles) break;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);

    // Skip ignored files/directories
    if (ignoreList.some((ignore) => entry.name === ignore || relPath.split(path.sep).includes(ignore))) {
      continue;
    }

    if (entry.isDirectory()) {
      results.push(...scanProjectFiles(fullPath, baseDir, maxFiles, currentCount));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ignoreExtensions.includes(ext)) continue;

      try {
        currentCount.val++;
        const stat = fs.statSync(fullPath);
        // If file is very large (e.g. > 100KB), don't read the whole thing
        let contentSnippet = "";
        if (stat.size < 100 * 1024) {
          contentSnippet = fs.readFileSync(fullPath, "utf-8");
        } else {
          contentSnippet = `[File too large to read, size: ${stat.size} bytes]`;
        }

        results.push({
          relativePath: relPath,
          contentSnippet: contentSnippet.substring(0, 4000), // Cap file size snippet sent to Gemini
        });
      } catch (err) {
        console.warn(`[Indexer] Could not read file ${fullPath}:`, err);
      }
    }
  }

  return results;
}

// Main Projects monitoring and learning function
export async function learnProjects(): Promise<any[]> {
  ensureDir(PROJECTS_DIR);
  ensureDir(EXTRACTED_DIR);

  const ai = getGeminiClient();
  const parsedProjects: any[] = [];

  // 1. Scan for zip files in projects/ and unzip them
  const files = fs.readdirSync(PROJECTS_DIR);
  for (const file of files) {
    if (file.toLowerCase().endsWith(".zip") && !file.startsWith(".")) {
      const zipPath = path.join(PROJECTS_DIR, file);
      const zipName = path.basename(file, path.extname(file));
      const targetExtractPath = path.join(EXTRACTED_DIR, zipName);

      if (!fs.existsSync(targetExtractPath)) {
        console.log(`[Indexer] Unzipping project ${file} to ${targetExtractPath}...`);
        try {
          const zip = new AdmZip(zipPath);
          zip.extractAllTo(targetExtractPath, true);
          console.log(`[Indexer] Extracted ${file} successfully.`);
        } catch (error) {
          console.error(`[Indexer] Error extracting zip ${file}:`, error);
        }
      }
    }
  }

  // 2. Identify all projects folders (direct folders in projects/ + subfolders in .extracted/)
  const projectPaths: { id: string; folderName: string; path: string }[] = [];

  // Read direct folders in projects/ (excluding .extracted and .git etc)
  const rootItems = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
  for (const item of rootItems) {
    if (item.isDirectory() && item.name !== ".extracted" && !item.name.startsWith(".")) {
      const folderPath = path.join(PROJECTS_DIR, item.name);
      projectPaths.push({
        id: item.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
        folderName: item.name,
        path: folderPath,
      });
    }
  }

  // Read folders inside .extracted/
  if (fs.existsSync(EXTRACTED_DIR)) {
    const extractedItems = fs.readdirSync(EXTRACTED_DIR, { withFileTypes: true });
    for (const item of extractedItems) {
      if (item.isDirectory() && !item.name.startsWith(".")) {
        const folderPath = path.join(EXTRACTED_DIR, item.name);
        // Check if there is a single inner directory (common in github zips)
        const innerItems = fs.readdirSync(folderPath, { withFileTypes: true }).filter(i => !i.name.startsWith("."));
        let finalPath = folderPath;
        if (innerItems.length === 1 && innerItems[0].isDirectory()) {
          finalPath = path.join(folderPath, innerItems[0].name);
        }

        projectPaths.push({
          id: item.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
          folderName: item.name,
          path: finalPath,
        });
      }
    }
  }

  // 3. Analyze each project folder
  for (const project of projectPaths) {
    const metaFile = path.join(KNOWLEDGE_DIR, "projects", `${project.id}.json`);

    // If metadata file already exists, load it
    if (fs.existsSync(metaFile)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
        parsedProjects.push(metadata);
        continue;
      } catch (err) {
        console.warn(`[Indexer] Could not parse existing metadata for ${project.id}, re-analyzing...`);
      }
    }

    if (!ai) {
      console.warn(`[Indexer] Gemini client unavailable. Skipping analysis for project: ${project.folderName}`);
      continue;
    }

    console.log(`[Indexer] Analyzing project code structure for: ${project.folderName}...`);
    try {
      const projectFiles = scanProjectFiles(project.path, project.path);
      
      // Build a prompt summarizing the codebase structure
      let codebaseDescription = `Project Folder: ${project.folderName}\n\n`;
      
      const readmeFile = projectFiles.find(f => f.relativePath.toLowerCase() === "readme.md");
      if (readmeFile) {
        codebaseDescription += `### README.md content:\n${readmeFile.contentSnippet}\n\n`;
      }

      codebaseDescription += "### Key Files and Structures:\n";
      for (const pf of projectFiles.slice(0, 15)) {
        if (pf.relativePath.toLowerCase() === "readme.md") continue;
        codebaseDescription += `\n--- File: ${pf.relativePath} ---\n${pf.contentSnippet.substring(0, 1500)}\n`;
      }

      const prompt = `You are a Senior AI & Software Architect. Analyze the following project codebase details (README content + source files snippets) and extract complete details about it.
      
      ${codebaseDescription}
      
      Generate a comprehensive structured analysis of this project in JSON format. Provide the response as raw JSON matching the JSON schema below. Do not wrap the JSON in markdown code blocks like \`\`\`json.
      
      Schema:
      {
        "id": "${project.id}",
        "name": "Project Name (clean capitalized name, e.g. Sentinel AI)",
        "folder": "${project.folderName}",
        "summary": "1-2 sentence high level description.",
        "recruiterExplanation": "An explanation highlighting Cimil's role, achievements, the core business value, and why it makes him a strong engineering hire for SDE or AI roles.",
        "technicalExplanation": "A deep technical explanation of how the project is implemented under the hood (e.g. backend design, API routes, database integrations, ML pipeline, model invocation details).",
        "architectureExplanation": "Explanation of the software architecture (e.g., MVC, modular monolithic, client-server, microservices, hybrid ML pipelines) and layout decisions.",
        "languages": ["Python", "TypeScript", etc.],
        "frameworks": ["FastAPI", "React", "Next.js", "Django", etc.],
        "databases": ["PostgreSQL", "SQLite", "MongoDB", etc.],
        "apis": ["Stripe", "OpenAI API", etc.],
        "auth": ["Clerk", "OAuth2", "JWT", etc.],
        "deployment": ["Docker", "Vercel", "Render", etc.],
        "designPatterns": ["Singleton", "Factory", "Decorator", etc.],
        "features": ["Key Feature 1", "Key Feature 2", etc.],
        "aiModels": ["GPT-4", "Llama 3", "text-embedding-3-small", etc. if any],
        "libraries": ["framer-motion", "numpy", "pandas", etc.],
        "faqs": [
          {
            "q": "What was the main challenge in this project?",
            "a": "..."
          },
          {
            "q": "How is the ML pipeline structured?",
            "a": "..."
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const resultText = response.text || "";
      // Clean up markdown block wraps if model generated them anyway
      const cleanedJSON = resultText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();

      const metadata = JSON.parse(cleanedJSON);
      fs.writeFileSync(metaFile, JSON.stringify(metadata, null, 2));
      console.log(`[Indexer] Successfully analyzed and saved project metadata: ${metadata.name}`);
      parsedProjects.push(metadata);

    } catch (error) {
      console.error(`[Indexer] Failed to analyze project ${project.folderName}:`, error);
    }
  }

  return parsedProjects;
}

// Generate chunks and embed them into vector store
export async function buildEmbeddingsVectorStore() {
  const ai = getGeminiClient();
  if (!ai) {
    console.warn("[Indexer] Gemini client unavailable. Skipping embedding generation.");
    return;
  }

  console.log("[Indexer] Preparing knowledge base chunks for embedding...");
  const chunks: { id: string; title: string; content: string; type: string }[] = [];

  // 1. Profile Chunk
  const profileFile = path.join(KNOWLEDGE_DIR, "profile.json");
  if (fs.existsSync(profileFile)) {
    const data = JSON.parse(fs.readFileSync(profileFile, "utf-8"));
    chunks.push({
      id: "profile-general",
      title: "Cimil Charly - Profile Summary",
      content: `Name: ${data.name}\nRole: ${data.role}\nLocation: ${data.location}\nEmail: ${data.email}\nPhone: ${data.phone}\nGitHub: ${data.github}\nLinkedIn: ${data.linkedin}\nIntro: ${data.intro}`,
      type: "profile",
    });
  }

  // 2. Skills Chunk
  const skillsFile = path.join(KNOWLEDGE_DIR, "skills.json");
  if (fs.existsSync(skillsFile)) {
    const data = JSON.parse(fs.readFileSync(skillsFile, "utf-8"));
    const groupsText = data.groups
      .map((g: any) => `${g.name}: ${g.items.join(", ")}`)
      .join("\n");
    const certsText = data.certifications.join("\n");
    chunks.push({
      id: "skills-and-certs",
      title: "Cimil Charly - Skills & Certifications",
      content: `Technical Skills by Category:\n${groupsText}\n\nCertifications & Honors:\n${certsText}`,
      type: "skills",
    });
  }

  // 3. Experience Chunks (one per item)
  const experienceFile = path.join(KNOWLEDGE_DIR, "experience.json");
  if (fs.existsSync(experienceFile)) {
    const data = JSON.parse(fs.readFileSync(experienceFile, "utf-8"));
    data.forEach((exp: any, index: number) => {
      chunks.push({
        id: `experience-${index}`,
        title: `Experience: ${exp.role} at ${exp.company}`,
        content: `Role: ${exp.role}\nCompany: ${exp.company}\nLocation: ${exp.where}\nDuration: ${exp.when}\nKey Work items:\n${exp.notes.map((n: string) => `- ${n}`).join("\n")}`,
        type: "experience",
      });
    });
  }

  // 4. Resume text chunks
  const resumeTextPath = path.join(KNOWLEDGE_DIR, "resume", "text.txt");
  if (fs.existsSync(resumeTextPath)) {
    const text = fs.readFileSync(resumeTextPath, "utf-8");
    // Split by markdown headers or chunks of ~1200 characters
    const paragraphs = text.split(/\n(?=##\s+)/);
    paragraphs.forEach((para, index) => {
      if (para.trim().length > 50) {
        chunks.push({
          id: `resume-chunk-${index}`,
          title: `Resume Section: ${para.split("\n")[0] || "General"}`,
          content: para.trim(),
          type: "resume",
        });
      }
    });
  }

  // 5. Projects Chunks
  const projectsMetaDir = path.join(KNOWLEDGE_DIR, "projects");
  if (fs.existsSync(projectsMetaDir)) {
    const metaFiles = fs.readdirSync(projectsMetaDir);
    for (const file of metaFiles) {
      if (file.endsWith(".json")) {
        const data = JSON.parse(fs.readFileSync(path.join(projectsMetaDir, file), "utf-8"));
        
        // General Summary Chunk
        chunks.push({
          id: `project-${data.id}-summary`,
          title: `Project: ${data.name} - Summary`,
          content: `Project Name: ${data.name}\nTagline: ${data.summary}\nRecruiter Explanation:\n${data.recruiterExplanation}\nLanguages: ${data.languages.join(", ")}\nFrameworks: ${data.frameworks.join(", ")}\nDatabases: ${data.databases.join(", ")}`,
          type: "project-summary",
        });

        // Technical details Chunk
        chunks.push({
          id: `project-${data.id}-tech`,
          title: `Project: ${data.name} - Technical Implementation`,
          content: `Project Name: ${data.name}\nTechnical Details:\n${data.technicalExplanation}\nArchitecture Details:\n${data.architectureExplanation}\nStack Details:\nLanguages: ${data.languages.join(", ")}\nFrameworks: ${data.frameworks.join(", ")}\nDatabases: ${data.databases.join(", ")}\nAPIs: ${data.apis.join(", ")}\nAuth: ${data.auth.join(", ")}\nDeployment: ${data.deployment.join(", ")}\nDesign Patterns: ${data.designPatterns.join(", ")}\nLibraries: ${data.libraries.join(", ")}\nAI Models: ${data.aiModels.join(", ")}`,
          type: "project-tech",
        });

        // FAQs Chunks
        data.faqs.forEach((faq: any, i: number) => {
          chunks.push({
            id: `project-${data.id}-faq-${i}`,
            title: `Project: ${data.name} - FAQ: ${faq.q}`,
            content: `Project: ${data.name}\nQuestion: ${faq.q}\nAnswer: ${faq.a}`,
            type: "project-faq",
          });
        });
      }
    }
  }

  console.log(`[Indexer] Generated ${chunks.length} chunks. Computing vector embeddings using Gemini gemini-embedding-2...`);
  
  const embeddingsList: { chunk: typeof chunks[0]; vector: number[] }[] = [];

  // Simple cosine similarity database mapping
  for (const chunk of chunks) {
    try {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: chunk.content,
      });

      const values = response.embeddings?.[0]?.values;
      if (values) {
        embeddingsList.push({
          chunk,
          vector: values,
        });
      }
    } catch (error) {
      console.error(`[Indexer] Error embedding chunk ${chunk.id}:`, error);
    }
  }

  // Write vector database to embeddings.json
  const embeddingsFile = path.join(KNOWLEDGE_DIR, "embeddings", "embeddings.json");
  fs.writeFileSync(embeddingsFile, JSON.stringify(embeddingsList, null, 2));
  console.log(`[Indexer] Embedding cache rebuilt successfully. Saved ${embeddingsList.length} vectors to ${embeddingsFile}`);
}

// Master index runner
export async function runFullIngestionIndex() {
  console.log("[Indexer] Starting knowledge base build workflow...");
  bootstrapProfileData();
  await transcribeResumePdf();
  await learnProjects();
  await buildEmbeddingsVectorStore();
  console.log("[Indexer] Full indexing completed successfully.");
}
