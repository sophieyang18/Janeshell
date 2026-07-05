import { type ReactNode } from "react";
import { CalendarDays, Camera, Image, PencilLine } from "lucide-react";

import { GlassCard, SectionTitle, SoftCard, Tag } from "@/components/common/ui";
import { useAppStore } from "@/store/use-app-store";
import { recordTypes, type RecordEntry, type RecordType } from "@/types/domain";

export function RecordsPanel({ focusType = "体重" as RecordType }: { focusType?: RecordType }) {
  const records = useAppStore((state) => state.records);
  const filtered = records.filter((record) => record.type === focusType);
  const days = buildCalendarDays(filtered);

  return (
    <div className="grid h-full min-h-0 grid-cols-[1.2fr_0.8fr] gap-5 overflow-hidden">
      <GlassCard className="min-h-0 overflow-hidden p-5">
        <div className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-4">
          <div className="flex items-center justify-between gap-4">
            <SectionTitle title={`${focusType}日历`} subtitle="按月查看最近的减脂记录节奏，后续可接真实拍照与识别。" />
            <Tag>
              <CalendarDays className="mr-2 size-4" />
              本月视图
            </Tag>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.18em] text-slate-400">
            {["一", "二", "三", "四", "五", "六", "日"].map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>

          <div className="grid h-full min-h-0 grid-cols-7 grid-rows-5 gap-2 overflow-hidden">
            {days.map((day) => (
              <div
                key={day.key}
                className={`flex min-h-0 items-center justify-center rounded-[16px] text-sm font-medium xl:rounded-[18px] ${
                  day.active ? "bg-emerald-100 text-emerald-700" : "bg-white/80 text-slate-400"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{day.label}</span>
                  {day.active ? <span className="size-1.5 rounded-full bg-emerald-500" /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
        <GlassCard className="p-5">
          <SectionTitle title="记录分类" subtitle="选择一个分类查看。" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {recordTypes.map((type) => (
              <button
                key={type}
                className={`rounded-[20px] px-4 py-3 text-center text-sm font-semibold transition ${
                  focusType === type ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="flex min-h-0 flex-1 flex-col p-5">
          <SectionTitle title="最近记录" subtitle="点评和分数集中在这里。" />
          <div className="scrollbar-thin mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {filtered.map((record) => (
              <SoftCard key={record.id} className="p-4 shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-500">{record.note}</div>
                  </div>
                  <Tag className="bg-emerald-50 text-emerald-700">{record.score} 分</Tag>
                </div>
              </SoftCard>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <QuickAction icon={<Camera className="size-4" />} label="拍照上传" />
            <QuickAction icon={<Image className="size-4" />} label="从相册导入" />
            <QuickAction icon={<PencilLine className="size-4" />} label="手动录入" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="rounded-[20px] bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
      <div className="mb-2 flex justify-center">{icon}</div>
      {label}
    </button>
  );
}

function buildCalendarDays(records: RecordEntry[]) {
  const monthLength = 35;
  const today = new Date();
  const activeDaySet = new Set(records.map((record) => new Date(record.date).getDate()));

  return Array.from({ length: monthLength }, (_, index) => ({
    key: `day-${index}`,
    label: index < 30 ? String(index + 1) : "",
    active: index < 30 && activeDaySet.has(index + 1) && today.getMonth() === new Date().getMonth(),
  }));
}
