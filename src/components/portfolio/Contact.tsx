import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { profile } from "./data";
import { Window } from "./Window";
import { SectionHeading } from "./Projects";

interface Msg { from: "them" | "me"; text: string; time: string; }

const initial: Msg[] = [
  { from: "them", text: "Hey 👋 — thanks for stopping by my workspace.", time: "now" },
  { from: "them", text: "Got a role, project, or idea? Drop a message and I'll get back within a day.", time: "now" },
];

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function Contact() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft.trim();
    setMessages((m) => [...m, { from: "me", text, time: timestamp() }]);
    setDraft("");
    setSent(false);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "them", text: "Got it ✓ — I'll reply at cimilcharly@gmail.com. You can also reach me on LinkedIn.", time: timestamp() },
      ]);
      setSent(true);
    }, 700);
  };

  return (
    <section id="contact" className="px-4 py-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker="~/contact" title="Let's talk" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Window title="contact.card" subtitle="reach me">
            <div className="space-y-4 p-6">
              <a href={`mailto:${profile.email}`} className="group flex items-center gap-3 rounded-xl border border-glass-border bg-secondary/40 p-4 transition hover:border-primary/40">
                <Mail className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">email</div>
                  <div className="truncate text-sm text-foreground">{profile.email}</div>
                </div>
              </a>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="group flex items-center gap-3 rounded-xl border border-glass-border bg-secondary/40 p-4 transition hover:border-primary/40">
                <Phone className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">phone</div>
                  <div className="truncate text-sm text-foreground">{profile.phone}</div>
                </div>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-glass-border bg-secondary/40 p-4 transition hover:border-primary/40">
                <Linkedin className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">linkedin</div>
                  <div className="truncate text-sm text-foreground">/in/cimil-charly</div>
                </div>
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-glass-border bg-secondary/40 p-4 transition hover:border-primary/40">
                <Github className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">github</div>
                  <div className="truncate text-sm text-foreground">@cimilcharly</div>
                </div>
              </a>
            </div>
          </Window>

          <Window title={`chat with ${profile.name.toLowerCase()}`} subtitle={profile.available ? "● online" : "● away"}>
            <div className="flex h-[28rem] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "me"
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-secondary text-foreground"
                      }`}
                    >
                      {m.text}
                      <div className={`mt-1 font-mono text-[9px] uppercase tracking-wider ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {m.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {sent && (
                  <div className="text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    delivered
                  </div>
                )}
              </div>
              <form onSubmit={send} className="flex items-center gap-2 border-t border-glass-border p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  className="flex-1 rounded-full border border-glass-border bg-secondary/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </Window>
        </div>
      </div>
    </section>
  );
}