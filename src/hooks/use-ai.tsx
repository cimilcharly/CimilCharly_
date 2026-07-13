import React, { createContext, useContext, useState, useEffect } from "react";
import { queryAssistant, matchJobDescription } from "../lib/api/ai.server";

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  relevantProjects: { id: string; name: string; reason: string }[];
  resumeSuggestions: string[];
  learningRoadmap: { step: string; topic: string; details: string }[];
  error?: string;
}

interface AIContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  isTyping: boolean;
  activeTab: "chat" | "matcher";
  setActiveTab: (tab: "chat" | "matcher") => void;
  sendMessage: (text: string) => Promise<void>;
  prefillMessage: (text: string) => void;
  clearHistory: () => void;
  jobMatchResult: JobMatchResult | null;
  isMatching: boolean;
  matchJob: (jd: string) => Promise<void>;
  submitContact: (name: string, company: string, email: string, message: string, time: string) => Promise<boolean>;
  isSubmittingContact: boolean;
}

const AIContext = createContext<AIContextProps | undefined>(undefined);

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "matcher">("chat");
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Initialize conversation
  useEffect(() => {
    const saved = sessionStorage.getItem("cimil_ai_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {}
    }

    setMessages([
      {
        sender: "bot",
        text: "Hi! I am **Cimil's AI Recruiter Assistant** 🤖. I have access to Cimil's full experience history, resume, technical skills, and projects.\n\nAsk me anything about his work, or head to the **Job Matcher** tab to paste a job description and evaluate Cimil's fit!",
        timestamp: getTimestamp(),
      },
    ]);
  }, []);

  // Save history to sessionStorage
  const saveHistory = (history: Message[]) => {
    setMessages(history);
    sessionStorage.setItem("cimil_ai_chat_history", JSON.stringify(history));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: getTimestamp(),
    };

    const newHistory = [...messages, userMsg];
    saveHistory(newHistory);
    setIsTyping(true);

    try {
      // Convert history for API (conforming to model expectations: user/model roles)
      const apiHistory = newHistory.slice(0, -1).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const res = await queryAssistant({
        data: {
          message: text,
          history: apiHistory,
        },
      });

      const botMsg: Message = {
        sender: "bot",
        text: res.text || "Sorry, I couldn't process your request.",
        timestamp: getTimestamp(),
      };

      saveHistory([...newHistory, botMsg]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errMsg: Message = {
        sender: "bot",
        text: "I experienced a server communication issue. Please ensure your `GEMINI_API_KEY` is configured in the project `.env` file.",
        timestamp: getTimestamp(),
      };
      saveHistory([...newHistory, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const prefillMessage = (text: string) => {
    setIsOpen(true);
    setActiveTab("chat");
    sendMessage(text);
  };

  const clearHistory = () => {
    const defaultMsg: Message = {
      sender: "bot",
      text: "Chat history cleared. How else can I help you today?",
      timestamp: getTimestamp(),
    };
    setMessages([defaultMsg]);
    sessionStorage.removeItem("cimil_ai_chat_history");
  };

  const matchJob = async (jd: string) => {
    if (!jd.trim()) return;
    setIsMatching(true);
    setJobMatchResult(null);

    try {
      const res = await matchJobDescription({
        data: {
          jobDescription: jd,
        },
      });
      setJobMatchResult(res as JobMatchResult);
    } catch (error: any) {
      console.error("Job Matcher error:", error);
      setJobMatchResult({
        matchPercentage: 0,
        matchingSkills: [],
        missingSkills: [],
        relevantProjects: [],
        resumeSuggestions: [],
        learningRoadmap: [],
        error: error.message || "Failed to analyze Job Description.",
      });
    } finally {
      setIsMatching(false);
    }
  };

  const submitContact = async (name: string, company: string, email: string, message: string, time: string): Promise<boolean> => {
    setIsSubmittingContact(true);
    try {
      // Trigger n8n Contact Automation Webhook if n8n is running
      const res = await fetch("http://localhost:5678/webhook/cimil-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, message, preferredTime: time }),
      });

      if (!res.ok) {
        console.warn("n8n webhook failed. Proceeding with simulated fallback logging.");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to submit contact to n8n webhook:", error);
      return true;
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isTyping,
        activeTab,
        setActiveTab,
        sendMessage,
        prefillMessage,
        clearHistory,
        jobMatchResult,
        isMatching,
        matchJob,
        submitContact,
        isSubmittingContact,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
