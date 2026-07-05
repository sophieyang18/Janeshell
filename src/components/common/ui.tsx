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
        "inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700",
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
        "pill-button bg-emerald-600 px-5 py-3 text-white shadow-[0_18px_30px_rgba(22,163,74,0.24)] hover:bg-emerald-700",
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
        "pill-button border border-emerald-100 bg-emerald-50 px-5 py-3 text-emerald-700 hover:bg-emerald-100",
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
  accent = "bg-emerald-50 text-emerald-700",
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
      <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${value}%` }} />
    </div>
  );
}
