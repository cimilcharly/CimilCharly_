import { motion } from "framer-motion";
import { skillGroups, certifications } from "./data";
import { Window } from "./Window";
import { SectionHeading } from "./Projects";
import { Award } from "lucide-react";

export function Skills() {
  return (
    <section id="skills" className="px-4 py-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker="~/toolbox" title="Tools I reach for" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Window title="toolbox" subtitle="hover to inspect">
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {skillGroups.map((g) => (
                <div key={g.name} className="rounded-xl border border-glass-border bg-secondary/40 p-5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {g.name}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <motion.span
                        key={s}
                        whileHover={{ y: -3, scale: 1.04 }}
                        className="cursor-default rounded-lg border border-glass-border bg-card/60 px-3 py-1.5 text-sm text-foreground/90 shadow-sm transition hover:border-primary/40 hover:text-primary"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Window>

          <Window title="certifications.txt" subtitle="achievements">
            <ul className="space-y-3 p-6">
              {certifications.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-foreground/85">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Window>
        </div>
      </div>
    </section>
  );
}