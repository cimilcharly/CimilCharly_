import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import {
  Briefcase,
  Code2,
  Command as CommandIcon,
  FolderGit2,
  Home,
  Mail,
  User,
} from "lucide-react";

type Item = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

function DockIcon({
  mouseX,
  item,
  onActivate,
}: {
  mouseX: MotionValue<number>;
  item: Item;
  onActivate: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeRaw = useTransform(distance, [-120, 0, 120], [44, 64, 44]);
  const size = useSpring(sizeRaw, { stiffness: 300, damping: 22, mass: 0.4 });

  const Icon = item.icon;
  return (
    <motion.button
      ref={ref}
      onClick={onActivate}
      aria-label={item.label}
      style={{ width: size, height: size }}
      className="group relative grid place-items-center rounded-2xl bg-foreground/5 text-foreground/80 transition hover:text-foreground"
    >
      <Icon className="h-5 w-5" />
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background opacity-0 transition group-hover:opacity-100">
        {item.label}
      </span>
    </motion.button>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Dock({ onCommand }: { onCommand: () => void }) {
  const mouseX = useMotionValue(Infinity);

  const items: Item[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "about", label: "About", icon: User },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        className="glass pointer-events-auto flex items-end gap-2 rounded-3xl px-3 py-2"
      >
        {items.map((it) => (
          <DockIcon
            key={it.id}
            item={it}
            mouseX={mouseX}
            onActivate={() => scrollTo(it.id)}
          />
        ))}
        <div className="mx-1 h-10 w-px bg-foreground/10" />
        <DockIcon
          item={{ id: "cmdk", label: "⌘K · Command", icon: CommandIcon }}
          mouseX={mouseX}
          onActivate={onCommand}
        />
      </motion.div>
    </div>
  );
}