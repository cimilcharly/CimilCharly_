import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  draggable?: boolean;
}

export function Window({ title, subtitle, children, className = "", draggable = false }: Props) {
  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.08}
      whileHover={draggable ? { scale: 1.005 } : undefined}
      className={`glass rounded-2xl overflow-hidden ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
    >
      <div className="window-chrome">
        <span className="traffic-dot bg-[#ff5f57]" />
        <span className="traffic-dot bg-[#febc2e]" />
        <span className="traffic-dot bg-[#28c840]" />
        <div className="ml-3 flex min-w-0 flex-1 items-baseline gap-2">
          <span className="truncate text-xs font-medium text-foreground/80">{title}</span>
          {subtitle && (
            <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}