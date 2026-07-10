import { type ButtonHTMLAttributes, type CSSProperties, type PropsWithChildren, type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  subtitle,
  actions,
  tone = "light",
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h3 className={cn("text-[28px] font-black leading-none", tone === "dark" ? "text-white" : "text-slate-900")}>{title}</h3>
        {subtitle ? (
          <p className={cn("max-w-2xl text-sm leading-6", tone === "dark" ? "text-white/64" : "text-slate-500")}>{subtitle}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function Tag({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: CSSProperties }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export function GlassCard({
  children,
  className,
  delay = 0,
  style,
}: PropsWithChildren<{ className?: string; delay?: number; style?: CSSProperties }>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, delay }}
      className={cn("glass-card", className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SoftCard({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: CSSProperties }>) {
  return (
    <div className={cn("soft-card", className)} style={style}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "pill-button bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] px-5 py-3 text-white shadow-[0_18px_30px_rgba(117,186,255,0.26)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "pill-button border border-blue-100 bg-blue-50 px-5 py-3 text-blue-700 hover:bg-pink-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatCard({
  label,
  value,
  accent = "bg-blue-50 text-blue-700",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className={cn("rounded-[22px] p-4", accent)}>
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] transition-[width]" style={{ width: `${value}%` }} />
    </div>
  );
}
