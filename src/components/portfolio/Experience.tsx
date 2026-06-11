import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { experience } from "./data";
import { Window } from "./Window";
import { SectionHeading } from "./Projects";

export function Experience() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const entry = experience[page];

  const go = (d: number) => {
    setDir(d);
    setPage((p) => (p + d + experience.length) % experience.length);
  };

  return (
    <section id="experience" className="px-4 py-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker="~/notebook" title="Pages from my journey" />

        <div className="mt-12">
          <Window title="journal.md" subtitle={`page ${page + 1} / ${experience.length}`}>
            <div className="relative min-h-[26rem] overflow-hidden bg-[linear-gradient(transparent_31px,var(--grid-line)_32px)] bg-[size:100%_32px] p-6 sm:p-10">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.article
                  key={page}
                  custom={dir}
                  initial={{ opacity: 0, rotateY: dir * 25, x: dir * 40 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: -dir * 25, x: -dir * 40 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="origin-left"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-3xl text-foreground sm:text-4xl">{entry.role}</h3>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {entry.when}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {entry.company} · {entry.where}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {entry.notes.map((n) => (
                      <li key={n} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => go(-1)}
                  className="glass-soft inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {experience.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDir(i > page ? 1 : -1); setPage(i); }}
                      aria-label={`Go to page ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === page ? "w-8 bg-primary" : "w-1.5 bg-foreground/20"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => go(1)}
                  className="glass-soft inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Window>
        </div>
      </div>
    </section>
  );
}