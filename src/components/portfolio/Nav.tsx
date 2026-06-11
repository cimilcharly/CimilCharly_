import { ThemeToggle } from "./theme";

const links = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed left-1/2 top-4 z-40 w-[min(96%,52rem)] -translate-x-1/2">
      <nav className="glass-soft flex items-center justify-between gap-2 rounded-full px-3 py-2 sm:px-4">
        <a href="#home" className="flex shrink-0 items-center gap-2 px-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            CC
          </span>
          <span className="hidden font-display text-sm text-foreground sm:inline">cimil.dev</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition hover:scale-105 sm:inline-block"
          >
            Hire me
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}