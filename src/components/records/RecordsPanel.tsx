import { type ReactNode, useEffect, useState } from "react";
import { CalendarDays, Image, PencilLine, ScanSearch, X } from "lucide-react";

import { GlassCard, SectionTitle, SoftCard, Tag } from "@/components/common/ui";
import { apiClient, type CalorieDetectionResult, type QuickRecordDraft } from "@/services/api";
import { useAppStore } from "@/store/use-app-store";
import { recordTypes, type RecordEntry, type RecordType } from "@/types/domain";

export function RecordsPanel({
  focusType = "体重" as RecordType,
  initialMode = null,
}: {
  focusType?: RecordType;
  initialMode?: "manual" | "image" | null;
}) {
  const [activeType, setActiveType] = useState<RecordType>(focusType);
  const [modalMode, setModalMode] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuickRecordDraft>(() => createEmptyDraft());
  const [entryStatus, setEntryStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const records = useAppStore((state) => state.records);
  const userId = useAppStore((state) => state.userId);
  const createQuickRecord = useAppStore((state) => state.createQuickRecord);
  const visibleRecords = records.filter((record) => recordTypes.includes(record.type));
  const filtered = visibleRecords.filter((record) => record.type === activeType);
  const days = buildCalendarDays(visibleRecords);

  useEffect(() => {
    setActiveType(focusType);
    setModalMode(resolveInitialRecordMode(focusType, initialMode));
    setDraft(createEmptyDraft());
    setEntryStatus("");
  }, [focusType, initialMode]);

  const openRecordModal = (mode: string) => {
    setModalMode(mode);
    setDraft(createEmptyDraft());
    setEntryStatus("");
  };

  const closeRecordModal = () => {
    if (isSaving) return;
    setModalMode(null);
    setEntryStatus("");
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-[1.2fr_0.8fr] gap-5 overflow-hidden">
      <GlassCard className="min-h-0 overflow-visible p-5">
        <div className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-4">
          <div className="flex items-center justify-between gap-4">
            <SectionTitle title="综合记录日历" subtitle="体重、用餐、运动、饮水会合并显示；同一天有多类记录会同时标在日期里。" />
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

          <div className="grid h-full min-h-0 grid-cols-7 grid-rows-5 gap-2 overflow-visible pt-6">
            {days.map((day) => (
              <div
                key={day.key}
                className={`group relative min-h-0 rounded-[18px] border px-2 py-2 text-sm font-medium transition hover:z-50 xl:rounded-[20px] ${
                  day.active
                    ? "border-blue-100 bg-white text-blue-900 shadow-[0_12px_28px_rgba(117,186,255,0.13)] hover:-translate-y-0.5 hover:border-pink-200"
                    : "border-white/70 bg-white/70 text-slate-400"
                }`}
              >
                <div className="grid h-full min-w-0 grid-rows-[auto_minmax(0,1fr)]">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black leading-none">{day.label}</span>
                    {day.moreCount > 0 ? (
                      <span className="rounded-full bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
                        ...
                      </span>
                    ) : null}
                  </div>
                  {day.active ? (
                    <>
                      <div className="flex min-h-0 max-w-full items-center justify-center gap-1 overflow-hidden">
                        {day.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge}
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black leading-none text-white shadow-sm ${getRecordBadgeClassName(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-50 hidden w-52 -translate-x-1/2 rounded-[20px] border border-blue-100 bg-white/95 p-3 text-left shadow-[0_18px_45px_rgba(117,186,255,0.18)] backdrop-blur group-hover:block">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-black text-slate-900">{day.label} 日记录</div>
                          <div className="text-[10px] font-black text-blue-600">{day.details.length} 项</div>
                        </div>
                        <div className="mt-2 grid gap-1.5">
                          {day.details.map((detail) => (
                            <div key={detail} className="rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-semibold leading-4 text-blue-900">
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
        <GlassCard className="p-5">
          <SectionTitle title="记录分类" subtitle="选择分类后，右侧最近记录和下方录入会随之切换。" />
          <div className="mt-4 grid grid-cols-2 gap-2 xl:gap-3">
            {recordTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveType(type);
                  setModalMode(null);
                  setDraft(createEmptyDraft());
                  setEntryStatus("");
                }}
                className={`rounded-[20px] px-3 py-3 text-center text-sm font-semibold transition ${
                  activeType === type ? "bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] text-white" : "bg-blue-50 text-blue-700 hover:bg-pink-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="flex min-h-0 flex-1 flex-col p-5">
          <SectionTitle title="最近记录" subtitle="保存后的记录会在这里同步展示。" />
          <div className="scrollbar-thin mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {filtered.length ? filtered.map((record) => (
              <SoftCard key={record.id} className="p-4 shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-500">{record.note}</div>
                  </div>
                  <Tag className="bg-blue-50 text-blue-700">{record.score} 分</Tag>
                </div>
              </SoftCard>
            )) : (
              <SoftCard className="p-4 text-sm font-semibold text-slate-500 shadow-none">
                暂无{activeType}记录。点击下方按钮会打开一个居中的大录入框。
              </SoftCard>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <QuickAction
              icon={<Image className="size-4" />}
              label={getImageImportActionLabel(activeType)}
              active={modalMode === getImageImportActionLabel(activeType)}
              onClick={() => openRecordModal(getImageImportActionLabel(activeType))}
            />
            <QuickAction icon={<PencilLine className="size-4" />} label="手动录入" active={modalMode === "手动录入"} onClick={() => openRecordModal("手动录入")} />
          </div>
        </GlassCard>
      </div>

      {modalMode ? (
        <RecordEntryModal
          type={activeType}
          mode={modalMode}
          draft={draft}
          status={entryStatus}
          isSaving={isSaving}
          userId={userId}
          onClose={closeRecordModal}
          onDraftChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          onSave={async () => {
            if (isSaving) return;

            setIsSaving(true);
            setEntryStatus("保存中...");
            try {
              const status = await createQuickRecord(activeType, modalMode, draft);
              setEntryStatus(status);
              window.setTimeout(() => {
                setModalMode(null);
                setEntryStatus("");
              }, 600);
            } finally {
              setIsSaving(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function QuickAction({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[20px] px-3 py-3 text-sm font-medium transition ${
        active ? "bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] text-white" : "bg-blue-50 text-blue-700 hover:bg-pink-50"
      }`}
    >
      <div className="mb-2 flex justify-center">{icon}</div>
      {label}
    </button>
  );
}

function RecordEntryModal({
  type,
  mode,
  draft,
  status,
  isSaving,
  userId,
  onClose,
  onDraftChange,
  onSave,
}: {
  type: RecordType;
  mode: string;
  draft: QuickRecordDraft;
  status: string;
  isSaving: boolean;
  userId: string | null;
  onClose: () => void;
  onDraftChange: (patch: Partial<QuickRecordDraft>) => void;
  onSave: () => void;
}) {
  const copy = getRecordFormCopy(type);
  const isImageMode = mode !== "手动录入";
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [detectStatus, setDetectStatus] = useState<string>("");
  const [detectionResult, setDetectionResult] = useState<CalorieDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleImageFile = async (file: File | null) => {
    if (!file) return;

    const dataUrl = await readImageAsDataUrl(file);
    setImagePreview(dataUrl);
    setImageBase64(dataUrl.split(",")[1] ?? dataUrl);
    setDetectionResult(null);
      setDetectStatus(type === "用餐" ? "图片已选择，可以识别食物和热量。" : "图片已选择，会作为本次记录来源。");
  };

  const detectCalories = async () => {
    if (!userId) {
      setDetectStatus("还没有连接到后端用户，请先完成建档或刷新后再试。");
      return;
    }
    if (!imageBase64) {
      setDetectStatus("请先选择或拍摄一张食物照片。");
      return;
    }

    setIsDetecting(true);
    setDetectStatus("正在识别食物和热量...");
    try {
      const result = await apiClient.detectCalories(userId, imageBase64, draft.value || "食物照片");
      setDetectionResult(result);
      const detectedFoods = result.detected_foods.join("、") || "食物";
      const macroText =
        result.macros.protein_g || result.macros.carbs_g || result.macros.fat_g
          ? `蛋白质 ${result.macros.protein_g}g，碳水 ${result.macros.carbs_g}g，脂肪 ${result.macros.fat_g}g。`
          : "";
      onDraftChange({
        value: detectedFoods,
        secondaryValue: String(result.total_calories_kcal),
        note:
          draft.note ||
          `图片识别完成：估算 ${result.total_calories_kcal} kcal，识别到 ${detectedFoods}。${macroText}结果仅供参考，可按实际份量手动调整。`,
      });
      setDetectStatus("识别完成，已自动回填食物和热量。");
    } catch {
      setDetectStatus("识别失败，可以先手动填写，后端识别服务恢复后再试。");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-blue-950/30 px-4 py-4 backdrop-blur-sm">
      <div className="grid max-h-[calc(100dvh-32px)] w-full max-w-3xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_35px_110px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-5 bg-[linear-gradient(135deg,#ffe1f1,#e3f2ff_52%,#eee6ff)] px-6 py-5 xl:px-7 xl:py-6">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">{mode}</div>
            <div className="mt-2 text-3xl font-black text-blue-950">记录{type}</div>
            <div className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">{copy.description}</div>
          </div>
          <button
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_14px_35px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:text-slate-900"
            aria-label="关闭记录弹窗"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="scrollbar-thin grid min-h-0 gap-4 overflow-y-auto px-6 py-5 xl:px-7">
          {isImageMode ? (
            <div className="grid gap-4 rounded-[28px] border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-black text-slate-800">{getImageImportTitle(type)}</div>
                  <div className="mt-1 text-sm font-medium leading-6 text-slate-500">
                    {getImageImportDescription(type)}
                  </div>
                </div>
                {type === "用餐" ? (
                  <button
                    onClick={detectCalories}
                    disabled={isDetecting}
                    className="inline-flex h-11 shrink-0 items-center rounded-[18px] bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] px-4 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    <ScanSearch className="mr-2 size-4" />
                    {isDetecting ? "识别中" : "识别食物和热量"}
                  </button>
                ) : null}
              </div>

              <label className="grid min-h-32 cursor-pointer place-items-center overflow-hidden rounded-[24px] border border-dashed border-blue-300 bg-white text-center transition hover:border-pink-400">
                {imagePreview ? (
                  <img src={imagePreview} alt="记录图片预览" className="h-40 w-full object-cover xl:h-44" />
                ) : (
                  <div className="px-6 py-6">
                    <Image className="mx-auto size-9 text-blue-600" />
                    <div className="mt-3 text-base font-black text-slate-800">点击选择相册图片</div>
                    <div className="mt-1 text-sm font-medium text-slate-500">暂时先不唤起摄像头，支持从相册或本地选择图片。</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleImageFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>

              {detectStatus ? <div className="text-sm font-semibold text-blue-700">{detectStatus}</div> : null}
              {detectionResult ? (
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-black text-slate-600">
                  <div className="rounded-2xl bg-white px-3 py-2">热量 {detectionResult.total_calories_kcal} kcal</div>
                  <div className="rounded-2xl bg-white px-3 py-2">蛋白 {detectionResult.macros.protein_g}g</div>
                  <div className="rounded-2xl bg-white px-3 py-2">碳水 {detectionResult.macros.carbs_g}g</div>
                  <div className="rounded-2xl bg-white px-3 py-2">脂肪 {detectionResult.macros.fat_g}g</div>
                </div>
              ) : null}
            </div>
          ) : null}

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">记录日期</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) => onDraftChange({ date: event.target.value })}
              className="h-14 rounded-[22px] border border-blue-100 bg-blue-50/60 px-5 text-base font-semibold text-blue-950 outline-none transition focus:border-pink-300 focus:bg-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">{copy.primaryLabel}</span>
              {type === "运动" ? (
                <div className="grid gap-3">
                  <select
                    value={getExerciseSelectValue(draft.value)}
                    onChange={(event) => onDraftChange({ value: event.target.value === "其他" ? "" : event.target.value })}
                    className="h-14 rounded-[22px] border border-blue-100 bg-blue-50/60 px-5 text-base font-semibold text-blue-950 outline-none transition focus:border-pink-300 focus:bg-white"
                  >
                    {exerciseOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {getExerciseSelectValue(draft.value) === "其他" ? (
                    <input
                      value={draft.value}
                      onChange={(event) => onDraftChange({ value: event.target.value })}
                      placeholder="请输入其他运动，例如：普拉提"
                      className="h-12 rounded-[20px] border border-blue-100 bg-white px-5 text-sm font-semibold text-blue-950 outline-none transition focus:border-pink-300"
                    />
                  ) : null}
                </div>
              ) : (
                <input
                  value={draft.value}
                  onChange={(event) => onDraftChange({ value: event.target.value })}
                  placeholder={copy.primaryPlaceholder}
                  className="h-14 rounded-[22px] border border-blue-100 bg-blue-50/60 px-5 text-base font-semibold text-blue-950 outline-none transition focus:border-pink-300 focus:bg-white"
                />
              )}
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">{copy.secondaryLabel}</span>
              <input
                value={draft.secondaryValue}
                onChange={(event) => onDraftChange({ secondaryValue: event.target.value })}
                placeholder={copy.secondaryPlaceholder}
                className="h-14 rounded-[22px] border border-blue-100 bg-blue-50/60 px-5 text-base font-semibold text-blue-950 outline-none transition focus:border-pink-300 focus:bg-white"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">备注</span>
            <textarea
              value={draft.note}
              onChange={(event) => onDraftChange({ note: event.target.value })}
              placeholder={copy.notePlaceholder}
              className="min-h-24 resize-none rounded-[24px] border border-blue-100 bg-blue-50/60 px-5 py-4 text-base font-medium leading-7 text-blue-950 outline-none transition focus:border-pink-300 focus:bg-white"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur xl:px-7">
          <div className="min-w-0 text-sm font-semibold text-blue-700">
            {status || "保存后会同步刷新最近记录和日历标记。"}
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              onClick={onClose}
              className="h-12 rounded-[20px] bg-slate-100 px-5 text-sm font-black text-slate-600 transition hover:bg-slate-200"
            >
              取消
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="h-12 rounded-[20px] bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] px-7 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSaving ? "保存中" : "保存记录"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function buildCalendarDays(records: RecordEntry[]) {
  const monthLength = 35;
  const today = new Date();
  const recordsByDay = new Map<number, RecordEntry[]>();

  records.forEach((record) => {
    const date = new Date(record.date);
    if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) return;

    const day = date.getDate();
    recordsByDay.set(day, [...(recordsByDay.get(day) ?? []), record]);
  });

  return Array.from({ length: monthLength }, (_, index) => ({
    key: `day-${index}`,
    label: index < 30 ? String(index + 1) : "",
    ...getCalendarDayMeta(recordsByDay.get(index + 1) ?? []),
  }));
}

function getCalendarDayMeta(records: RecordEntry[]) {
  if (!records.length) {
    return {
      active: false,
      badges: [] as string[],
      summaries: [] as string[],
      details: [] as string[],
      moreCount: 0,
    };
  }

  const orderedTypes = recordTypes.filter((type) => records.some((record) => record.type === type));
  const latestByType = orderedTypes
    .map((type) => records.find((record) => record.type === type))
    .filter((record): record is RecordEntry => Boolean(record));

  return {
    active: true,
    badges: orderedTypes.map(getRecordBadge),
    summaries: latestByType.map(getRecordCalendarSummary).slice(0, 2),
    details: latestByType.map((record) => `${record.type}：${getRecordCalendarSummary(record)}`),
    moreCount: Math.max(0, orderedTypes.length - 3),
  };
}

function getRecordBadge(type: RecordType) {
  if (type === "体重") return "重";
  if (type === "用餐") return "餐";
  if (type === "运动") return "动";
  if (type === "饮水") return "水";
  return "记";
}

function getRecordBadgeClassName(badge: string) {
  if (badge === "重") return "bg-sky-500";
  if (badge === "餐") return "bg-orange-500";
  if (badge === "动") return "bg-violet-500";
  if (badge === "水") return "bg-cyan-500";
  return "bg-blue-600";
}

function getRecordCalendarSummary(record: RecordEntry) {
  if (record.type === "体重") {
    const weight = record.title.match(/(\d+(?:\.\d+)?)kg/i)?.[1];
    const bodyFat = record.note.match(/体脂(?:率)?\s*(\d+(?:\.\d+)?)%/)?.[1] ?? record.title.match(/体脂(?:率)?\s*(\d+(?:\.\d+)?)%/)?.[1];
    return [weight ? `${weight}kg` : "", bodyFat ? `${bodyFat}%` : ""].filter(Boolean).join(" / ") || "已记录";
  }
  if (record.type === "用餐") {
    return record.title.match(/(\d+)\s*kcal/i)?.[0] ?? record.note.match(/(\d+)\s*kcal/i)?.[0] ?? "已记录";
  }
  if (record.type === "运动") {
    return record.title.match(/(\d+)\s*分钟/)?.[0] ?? "已运动";
  }
  if (record.type === "饮水") {
    return record.title.match(/(\d+)\s*ml/i)?.[0] ?? record.note.match(/(\d+)\s*ml/i)?.[0] ?? "已饮水";
  }
  return "已记录";
}

function createEmptyDraft(): QuickRecordDraft {
  return {
    date: new Date().toISOString().slice(0, 10),
    value: "",
    secondaryValue: "",
    note: "",
  };
}

const exerciseOptions = ["快走", "跑步", "骑行", "游泳", "力量训练", "瑜伽", "椭圆机", "普拉提", "其他"];

function getExerciseSelectValue(value: string) {
  if (!value) return "其他";
  return exerciseOptions.includes(value) ? value : "其他";
}

function getImageImportActionLabel(type: RecordType) {
  if (type === "用餐") return "拍照自动识别热量";
  if (type === "体重") return "导入体重照片";
  if (type === "运动") return "导入运动截图";
  return "导入饮水截图";
}

function resolveInitialRecordMode(type: RecordType, mode: "manual" | "image" | null) {
  if (mode === "manual") return "手动录入";
  if (mode === "image") return getImageImportActionLabel(type);
  return null;
}

function getImageImportTitle(type: RecordType) {
  if (type === "用餐") return "从相册导入食物图片";
  if (type === "体重") return "从相册导入体重照片";
  if (type === "运动") return "从相册导入运动截图";
  return "从相册导入饮水截图";
}

function getImageImportDescription(type: RecordType) {
  if (type === "用餐") return "这里已接入后端食物热量识别，选图后可以自动回填食物和热量。";
  if (type === "体重") return "先把体重照片作为记录来源保存，后续可以继续接入体重秤 OCR。";
  if (type === "运动") return "适合导入运动 App 截图，当前先保存图片来源和手动填写的运动信息。";
  return "适合导入水杯、水壶或 App 截图，当前先保存图片来源和手动填写的饮水量。";
}

function getRecordFormCopy(type: RecordType) {
  if (type === "体重") {
    return {
      description: "输入今天的体重，也可以补充体脂率。后端会自动计算脂肪量并同步到体重日历。",
      primaryLabel: "体重 kg",
      primaryPlaceholder: "例如：61.8",
      secondaryLabel: "体脂率 %（可选）",
      secondaryPlaceholder: "例如：24.5",
      notePlaceholder: "例如：早起空腹测量，状态不错。",
    };
  }
  if (type === "用餐") {
    return {
      description: "记录这一餐吃了什么和大致热量，后端会保存成餐食记录。",
      primaryLabel: "食物内容",
      primaryPlaceholder: "例如：鸡胸肉沙拉、玉米、拿铁",
      secondaryLabel: "估算热量 kcal",
      secondaryPlaceholder: "例如：520",
      notePlaceholder: "例如：晚餐七分饱，蛋白质比较够。",
    };
  }
  if (type === "运动") {
    return {
      description: "记录运动项目和时长，后端会估算基础消耗并放进运动日历。",
      primaryLabel: "运动项目",
      primaryPlaceholder: "例如：快走 / 椭圆机 / 力量训练",
      secondaryLabel: "时长 分钟",
      secondaryPlaceholder: "例如：35",
      notePlaceholder: "例如：强度适中，能说短句。",
    };
  }
  return {
    description: "记录饮水量，帮助阿简结合运动和饮食提醒补水。",
    primaryLabel: "饮水量 ml",
    primaryPlaceholder: "例如：500",
    secondaryLabel: "补充说明",
    secondaryPlaceholder: "例如：温水 / 运动后",
    notePlaceholder: "例如：运动后补水一杯。",
  };
}

function getRecordSubtitle(type: RecordType) {
  if (type === "体重") return "记录体重、体脂率和脂肪量，场景里的体重秤会直接跳到这里。";
  if (type === "用餐") return "记录餐次、食物和热量，场景里的意大利面会直接跳到这里。";
  if (type === "运动") return "记录运动类型、时长和消耗，场景里的跑步机会直接跳到这里。";
  return "记录每日饮水量，帮助阿简判断饱腹感、代谢和训练状态。";
}
