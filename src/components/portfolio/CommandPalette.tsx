import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Briefcase,
  Code2,
  FileDown,
  FolderGit2,
  Github,
  Home,
  Linkedin,
  Mail,
  Moon,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { profile, projects } from "./data";
import { useTheme } from "./theme";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 60);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => scrollTo("home"))}>
            <Home /> <span>Home</span>
            <CommandShortcut>G H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => scrollTo("projects"))}>
            <FolderGit2 /> <span>Projects</span>
            <CommandShortcut>G P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => scrollTo("experience"))}>
            <Briefcase /> <span>Experience</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => scrollTo("skills"))}>
            <Code2 /> <span>Skills</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => scrollTo("about"))}>
            <User /> <span>About</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => scrollTo("contact"))}>
            <Mail /> <span>Contact</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.name} ${p.folder}`}
              onSelect={() => run(() => scrollTo("projects"))}
            >
              <Sparkles /> <span>{p.name}</span>
              <CommandShortcut>{p.folder}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem onSelect={() => run(() => window.open(profile.resume, "_blank"))}>
            <FileDown /> <span>Download résumé</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.github, "_blank"))}>
            <Github /> <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.linkedin, "_blank"))}>
            <Linkedin /> <span>LinkedIn</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => (window.location.href = `mailto:${profile.email}`))}>
            <Mail /> <span>Email {profile.email}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Appearance">
          <CommandItem onSelect={() => run(toggle)}>
            {theme === "dark" ? <Sun /> : <Moon />}
            <span>Switch to {theme === "dark" ? "light" : "dark"} mode</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}