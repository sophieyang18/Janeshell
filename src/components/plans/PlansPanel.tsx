import { type ReactNode } from "react";
import { BrainCircuit, CalendarRange, HeartPulse, Sparkles } from "lucide-react";

import { GlassCard, ProgressBar, SectionTitle, SoftCard, StatCard, Tag } from "@/components/common/ui";
import { useAppStore } from "@/store/use-app-store";

const categoryAccent: Record<string, string> = {
  饮食: "bg-emerald-100 text-emerald-700",
  运动: "bg-sky-100 text-sky-700",
  情绪: "bg-violet-100 text-violet-700",
  打卡: "bg-amber-100 text-amber-700",
};

export function PlansPanel() {
  const profile = useAppStore((state) => state.profile);
  const tasks = useAppStore((state) => state.tasks);
  const toggleTask = useAppStore((state) => state.toggleTask);

  const bmi =
    profile && profile.heightInCentimeters
      ? (profile.currentWeight / ((profile.heightInCentimeters / 100) ** 2)).toFixed(1)
      : "--";
  const completed = tasks.filter((task) => task.isCompleted).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="grid h-full min-h-0 grid-cols-[0.95fr_1.05fr] gap-5 overflow-hidden">
      <div className="flex min-h-0 flex-col gap-5 overflow-hidden">
        <GlassCard className="flex min-h-0 flex-1 flex-col p-5">
          <SectionTitle title="今日任务" subtitle="优先读取后端今日计划；服务不可用时使用本地兜底。" />
          <div className="scrollbar-thin mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <SoftCard key={task.id} className="p-3 shadow-none">
                <div className="flex items-start gap-4">
                  <button
                    aria-label={`切换任务 ${task.title}`}
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border ${
                      task.isCompleted ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {task.isCompleted ? "✓" : ""}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-900">{task.title}</div>
                      <Tag className={`${categoryAccent[task.category]} px-3 py-1 text-xs`}>{task.category}</Tag>
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{task.detail}</div>
                  </div>
                </div>
              </SoftCard>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="计划进度" subtitle="今天只看最关键的三个数。" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <StatCard label="BMI" value={String(bmi)} />
            <StatCard label="已完成任务" value={`${completed}/${tasks.length}`} accent="bg-slate-50" />
            <StatCard label="今日完成度" value={`${progress}%`} accent="bg-violet-50" />
          </div>
          <div className="mt-4">
            <ProgressBar value={progress} />
          </div>
        </GlassCard>
      </div>

      <div className="flex min-h-0 flex-col gap-5 overflow-hidden">
        <GlassCard className="p-5">
          <SectionTitle title="后续能力" subtitle="先留入口，不铺满说明文字。" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <CapabilityCard
              icon={<BrainCircuit className="size-5" />}
              title="知识库建议"
            />
            <CapabilityCard
              icon={<HeartPulse className="size-5" />}
              title="体脂预测"
            />
            <CapabilityCard
              icon={<Sparkles className="size-5" />}
              title="数字人陪伴"
            />
            <CapabilityCard
              icon={<CalendarRange className="size-5" />}
              title="周报复盘"
            />
          </div>
        </GlassCard>

        <GlassCard className="min-h-0 flex-1 overflow-hidden p-4">
          <SectionTitle title="个人档案" subtitle="摘要信息，完整编辑后续做成子页。" />
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm leading-6 text-slate-600">
            <DetailRow label="搭子设定" value={profile ? `${profile.companion.customName} / ${profile.companion.archetype}` : "未设置"} />
            <DetailRow label="体重 / 身高" value={`${profile?.currentWeight ?? "--"}kg / ${profile?.heightInCentimeters ?? "--"}cm`} />
            <DetailRow label="减脂目标" value={profile?.goal || "先建立连续记录和稳定执行。"} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function CapabilityCard({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <SoftCard className="flex items-center gap-3 p-4 shadow-none">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div>
      <div className="text-base font-semibold text-slate-900">{title}</div>
    </SoftCard>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-slate-50 px-4 py-2.5">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-1 truncate text-sm text-slate-800">{value}</div>
    </div>
  );
}
