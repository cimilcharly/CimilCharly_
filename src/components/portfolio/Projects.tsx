import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Folder, Github, X } from "lucide-react";
import { useState } from "react";
import { projects } from "./data";
import { Window } from "./Window";

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId);

  return (
    <section id="projects" className="relative px-4 py-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker="~/projects" title="Folders on my desk" />

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setOpenId(p.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-start gap-3 text-left"
            >
              <div
                className={`relative h-28 w-full rounded-xl bg-gradient-to-br ${p.color} p-1 shadow-lg ring-1 ring-glass-border transition group-hover:shadow-2xl`}
              >
                <div className="absolute -top-2 left-3 h-3 w-12 rounded-t-md bg-current opacity-70" />
                <div className="glass flex h-full w-full items-end justify-between rounded-[10px] p-3">
                  <Folder className="h-6 w-6 text-foreground/80 transition group-hover:scale-110" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.folder}
                  </span>
                </div>
              </div>
              <div className="px-1">
                <div className="text-sm font-semibold text-foreground">{p.name}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{p.tagline}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 py-8 backdrop-blur-sm"
              onClick={() => setOpenId(null)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl"
              >
                <Window title={open.name} subtitle={open.folder} draggable>
                  <div className="relative">
                    <button
                      onClick={() => setOpenId(null)}
                      aria-label="Close window"
                      className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className={`h-40 bg-gradient-to-br ${open.color} sm:h-56`} />
                    <div className="p-6 sm:p-8">
                      <h3 className="font-display text-3xl text-foreground">{open.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{open.tagline}</p>
                      <p className="mt-5 text-sm leading-relaxed text-foreground/90">{open.description}</p>

                      <div className="mt-6">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Features
                        </div>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {open.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                              <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-primary" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {open.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-glass-border bg-secondary/60 px-3 py-1 font-mono text-[11px] text-foreground/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {open.github && (
                          <a
                            href={open.github}
                            target="_blank"
                            rel="noreferrer"
                            className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition hover:scale-[1.02]"
                          >
                            <Github className="h-4 w-4" /> Code
                          </a>
                        )}
                        {open.demo && (
                          <a
                            href={open.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
                          >
                            <ExternalLink className="h-4 w-4" /> Live demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Window>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{kicker}</div>
      <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">{title}</h2>
    </div>
  );
}