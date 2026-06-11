import { motion } from "framer-motion";
import { SectionHeading } from "./Projects";

const notes = [
  {
    title: "what i do",
    body: "I build AI/ML systems and full-stack apps end-to-end — from research idea to deployed product.",
    tilt: -3,
    tone: "bg-amber-200 text-amber-950 dark:bg-amber-300/90 dark:text-amber-950",
  },
  {
    title: "currently",
    body: "Final-year B.Tech CS (AI & ML) at CHRIST University. Looking for SDE / ML engineer roles for Summer 2027.",
    tilt: 2,
    tone: "bg-cyan-200 text-cyan-950 dark:bg-cyan-300/90 dark:text-cyan-950",
  },
  {
    title: "how i work",
    body: "Ship small, iterate fast, document well. Comfortable owning a feature from spec → tests → deploy.",
    tilt: -1.5,
    tone: "bg-rose-200 text-rose-950 dark:bg-rose-300/90 dark:text-rose-950",
  },
  {
    title: "off-hours",
    body: "Leading NSS volunteers, mentoring juniors, and exploring research on LLM safety & insider risk.",
    tilt: 3,
    tone: "bg-emerald-200 text-emerald-950 dark:bg-emerald-300/90 dark:text-emerald-950",
  },
];

export function About() {
  return (
    <section id="about" className="px-4 py-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker="~/about" title="Notes on me" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((n, i) => (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, y: 30, rotate: n.tilt * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: n.tilt }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, type: "spring", damping: 18 }}
              whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
              className={`relative aspect-square rounded-md p-6 shadow-xl shadow-black/20 ${n.tone}`}
            >
              <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-sm bg-foreground/15 backdrop-blur-sm" />
              <div className="font-mono text-[10px] uppercase tracking-wider opacity-70">{n.title}</div>
              <p className="mt-4 font-display text-xl leading-snug">{n.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}