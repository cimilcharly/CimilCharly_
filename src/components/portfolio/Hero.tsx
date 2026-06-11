import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { profile } from "./data";
import { Window } from "./Window";

export function Hero() {
  return (
    <section id="home" className="relative px-4 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Window title="welcome.workspace" subtitle="~/cimil">
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 pulse-dot" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {profile.available ? "Open to opportunities · Summer 2027" : "Currently focused"}
              </div>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                Welcome to my <em className="italic text-primary">workspace</em>.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.intro}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={profile.resume}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.02] hover:shadow-primary/40"
                >
                  <Download className="h-4 w-4" /> Download Résumé
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition hover:scale-[1.02]"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition hover:scale-[1.02]"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Mail className="h-3.5 w-3.5" /> {profile.email}
                </a>
              </div>
            </div>
          </Window>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <Window title="now.playing" subtitle="status">
            <div className="space-y-3 p-5 text-sm">
              <Row label="Building" value="LLM-driven threat detection" />
              <Row label="Learning" value="Systems design · MLOps" />
              <Row label="Reading" value="Designing Data-Intensive Applications" />
              <Row label="Stack" value="Python · Django · LLMs · Firebase" />
            </div>
          </Window>

          <Window title="terminal" subtitle="zsh">
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-muted-foreground">
{`$ whoami
cimil charly · ai/ml engineer

$ stack --list
  python · java · kotlin · django
  llms · nlp · firebase · mongodb

$ status
  ✓ shipping projects
  ✓ open to roles · summer 2027`}
            </pre>
          </Window>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="truncate text-foreground/90">{value}</span>
    </div>
  );
}