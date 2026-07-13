import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Github,
  Mail,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  Phone,
  Building,
} from "lucide-react";

import { useAI, Message, JobMatchResult } from "../../hooks/use-ai";
import { Window } from "./Window";

// Simple custom Markdown formatter to parse bold text, bullet points, headers, and links
function formatMarkdown(text: string) {
  if (!text) return "";

  // Split by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      const lines = part.split("\n");
      const language = lines[0].replace("```", "").trim();
      const code = lines.slice(1, -1).join("\n");
      return (
        <pre
          key={index}
          className="my-3 overflow-x-auto rounded-lg border border-glass-border bg-black/40 p-3 font-mono text-xs text-emerald-400"
        >
          {code}
        </pre>
      );
    }

    // Process normal text paragraph
    let lines = part.split("\n");
    return lines.map((line, lIdx) => {
      let content: React.ReactNode = line;

      // Handle bullet points
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      if (isBullet) {
        line = line.trim().replace(/^[-*]\s+/, "");
      }

      // Handle bold formatting (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const inlineParts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          inlineParts.push(line.substring(lastIndex, match.index));
        }
        inlineParts.push(
          <strong key={match.index} className="font-semibold text-primary">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        inlineParts.push(line.substring(lastIndex));
      }

      content = inlineParts.length > 0 ? inlineParts : line;

      // Handle links [text](url)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      if (typeof line === "string" && linkRegex.test(line)) {
        const linkParts: React.ReactNode[] = [];
        let lLastIndex = 0;
        let lMatch;
        linkRegex.lastIndex = 0;

        while ((lMatch = linkRegex.exec(line)) !== null) {
          if (lMatch.index > lLastIndex) {
            linkParts.push(line.substring(lLastIndex, lMatch.index));
          }
          linkParts.push(
            <a
              key={lMatch.index}
              href={lMatch[2]}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              {lMatch[1]}
            </a>
          );
          lLastIndex = linkRegex.lastIndex;
        }

        if (lLastIndex < line.length) {
          linkParts.push(line.substring(lLastIndex));
        }
        content = linkParts;
      }

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-sm text-foreground/85 leading-relaxed my-1">
            {content}
          </li>
        );
      }

      return line.trim() === "" ? (
        <div key={lIdx} className="h-2" />
      ) : (
        <p key={lIdx} className="text-sm text-foreground/85 leading-relaxed my-1">
          {content}
        </p>
      );
    });
  });
}

export default function AIAssistant() {
  const {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    activeTab,
    setActiveTab,
    sendMessage,
    clearHistory,
    jobMatchResult,
    isMatching,
    matchJob,
    submitContact,
  } = useAI();

  const [input, setInput] = useState("");
  const [jdInput, setJdInput] = useState("");
  
  // Recruiter Contact States
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactTime, setContactTime] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, showContactForm]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleMatch = () => {
    if (!jdInput.trim()) return;
    matchJob(jdInput.trim());
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage || !contactTime) return;

    setSubmittingContact(true);
    const success = await submitContact(
      contactName,
      contactCompany,
      contactEmail,
      contactMessage,
      contactTime
    );

    setSubmittingContact(false);
    if (success) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setShowContactForm(false);
        setContactName("");
        setContactCompany("");
        setContactEmail("");
        setContactMessage("");
        setContactTime("");
      }, 3000);
    }
  };

  const suggestionPills = [
    { label: "Summarize Resume", text: "Summarize Cimil's resume, including core strengths." },
    { label: "Explain Sentinel AI", text: "Explain the Sentinel AI project features, stack, and architecture." },
    { label: "Why hire Cimil?", text: "Why should a recruiter hire Cimil for SDE or AI roles?" },
    { label: "Check GitHub Stats", text: "Show Cimil's latest GitHub repositories and statistics." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-glass-border bg-background/80 shadow-2xl backdrop-blur-md sm:w-[460px] md:w-[480px]"
        >
          <Window title="cimil.ai" subtitle="assistant" draggable={false} className="h-full rounded-none border-y-0 border-r-0">
            {/* Header controls inside window header space */}
            <div className="absolute right-4 top-3.5 z-10 flex items-center gap-2">
              <button
                onClick={clearHistory}
                title="Clear Chat History"
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-foreground/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {!showContactForm && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Messages list */}
                  <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
                    {messages.map((m, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {m.sender === "bot" && (
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Bot className="h-4.5 w-4.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2.5 shadow-md ${
                            m.sender === "user"
                              ? "rounded-tr-sm bg-primary text-primary-foreground"
                              : "rounded-tl-sm border border-glass-border bg-secondary/40 text-foreground"
                          }`}
                        >
                          <div className="prose prose-sm dark:prose-invert">
                            {formatMarkdown(m.text)}
                          </div>
                          <span className="mt-1 block text-right font-mono text-[9px] text-muted-foreground uppercase">
                            {m.timestamp}
                          </span>
                        </div>
                        {m.sender === "user" && (
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <User className="h-4.5 w-4.5" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Bot className="h-4.5 w-4.5" />
                        </div>
                        <div className="rounded-xl rounded-tl-sm border border-glass-border bg-secondary/40 px-4 py-3.5 shadow-md">
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messageEndRef} />
                  </div>

                  {/* Suggestion Pills */}
                  <div className="flex flex-wrap gap-2 border-t border-glass-border bg-secondary/5 p-3">
                    {suggestionPills.map((pill) => (
                      <button
                        key={pill.label}
                        onClick={() => sendMessage(pill.text)}
                        className="rounded-full border border-glass-border bg-secondary/40 px-3 py-1 font-mono text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                      >
                        {pill.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] text-primary transition hover:bg-primary/20"
                    >
                      📅 Schedule Interview
                    </button>
                  </div>

                  {/* Message Form */}
                  <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-glass-border p-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me about skills, experience, projects..."
                      className="flex-1 rounded-full border border-glass-border bg-secondary/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Send message"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* Recruiter Contact Form */}
              {showContactForm && (
                <div className="flex flex-1 flex-col overflow-y-auto p-6">
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <h3 className="font-display text-xl text-foreground">Schedule with Cimil</h3>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="rounded-full p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {contactSubmitted ? (
                    <div className="flex flex-1 flex-col items-center justify-center text-center p-6 space-y-3">
                      <CheckCircle2 className="h-16 w-16 text-emerald-400 animate-pulse" />
                      <h4 className="font-display text-2xl text-foreground">Invitation Sent!</h4>
                      <p className="text-sm text-muted-foreground">
                        Your preferred times have been logged and synced. An calendar invite + email confirmation has been triggered.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="mt-4 flex-1 space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Interested in hiring or discussing opportunities? Fill out your details below. This will trigger local n8n flows, logging to Google Sheets, sending a Gmail alert, and proposing a Calendar meeting.
                      </p>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-glass-border bg-secondary/30 py-2 pl-9 pr-4 text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Company (Optional)
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={contactCompany}
                            onChange={(e) => setContactCompany(e.target.value)}
                            placeholder="Acme Corp"
                            className="w-full rounded-lg border border-glass-border bg-secondary/30 py-2 pl-9 pr-4 text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="recruiter@acme.com"
                            className="w-full rounded-lg border border-glass-border bg-secondary/30 py-2 pl-9 pr-4 text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Preferred Date & Time
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="datetime-local"
                            required
                            value={contactTime}
                            onChange={(e) => setContactTime(e.target.value)}
                            className="w-full rounded-lg border border-glass-border bg-secondary/30 py-2 pl-9 pr-4 text-sm text-foreground focus:border-primary/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Message
                        </label>
                        <textarea
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tell Cimil about the role, stack, or project..."
                          rows={4}
                          className="w-full rounded-lg border border-glass-border bg-secondary/30 p-3 text-sm text-foreground focus:border-primary/60 focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingContact}
                        className="w-full flex justify-center items-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-50"
                      >
                        {submittingContact ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
                          </>
                        ) : (
                          "Confirm & Schedule"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </Window>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
