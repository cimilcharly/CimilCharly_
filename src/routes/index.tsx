import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { Skills } from "@/components/portfolio/Skills";
import { About } from "@/components/portfolio/About";
import { Contact } from "@/components/portfolio/Contact";
import { CommandPalette } from "@/components/portfolio/CommandPalette";
import { Dock } from "@/components/portfolio/Dock";
import { profile } from "@/components/portfolio/data";

import { lazy, Suspense } from "react";
import { useAI } from "@/hooks/use-ai";
import { motion } from "framer-motion";

const AIAssistant = lazy(() => import("@/components/portfolio/AIAssistant"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cimil Charly — AI/ML Engineer & Full-Stack Developer" },
      { name: "description", content: "A digital workspace portfolio for Cimil Charly — B.Tech CS (AI/ML) student building LLM systems, full-stack apps, and mobile experiences." },
      { property: "og:title", content: "Cimil Charly — AI/ML Engineer & Full-Stack Developer" },
      { property: "og:description", content: "Projects, experience, and skills — presented as a calm, premium workspace." },
    ],
  }),
  component: Index,
});

function Index() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const { isOpen, setIsOpen } = useAI();

  return (
    <div className="workspace-bg relative min-h-screen text-foreground">
      <Nav onOpenCommand={() => setCmdOpen(true)} />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="border-t border-glass-border px-6 py-10 pb-28">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {profile.name} · crafted with care.</span>
          <span>Press ⌘K to navigate.</span>
        </div>
      </footer>
      <Dock onCommand={() => setCmdOpen(true)} />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />

      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-soft fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/10 transition"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          🤖 Ask Cimil AI
        </motion.button>
      )}

      {/* AI Recruiter Assistant UI */}
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </div>
  );
}
