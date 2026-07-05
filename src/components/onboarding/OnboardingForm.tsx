import { useState } from "react";

import { GlassCard, PrimaryButton, SecondaryButton, SectionTitle, Tag } from "@/components/common/ui";
import { buildProfileFromDraft, useAppStore } from "@/store/use-app-store";
import { companionArchetypes, companionCategories, genderOptions, getCompanionTheme, type CompanionArchetype } from "@/types/domain";

export function OnboardingForm() {
  const draft = useAppStore((state) => state.onboardingDraft);
  const updateDraft = useAppStore((state) => state.updateOnboardingDraft);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const skipOnboarding = useAppStore((state) => state.skipOnboarding);
  const theme = getCompanionTheme(draft.companion.category, draft.gender);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("category");

  const submit = () => {
    const profile = buildProfileFromDraft(draft);
    if (!profile) return;
    completeOnboarding(profile);
  };

  const isValid = Boolean(draft.currentWeight && draft.heightInCentimeters);
  const stepOrder: OnboardingStep[] = ["category", "companion", "required", "optional"];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="mx-auto grid h-[100dvh] max-w-[1680px] grid-cols-[0.82fr_1.18fr] gap-5 overflow-hidden p-5">
      <GlassCard className="relative h-full min-h-0 overflow-hidden p-7" delay={0.05}>
        <div className="absolute inset-0" style={{ background: theme.palette.background }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),transparent_42%)]" />
        <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-4">
          <div className="space-y-3">
            <Tag
              className="border backdrop-blur-md"
              style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.tagBg, color: theme.palette.tagText }}
            >
              减脂教练 & 搭子定制台
            </Tag>
            <h1 className="max-w-3xl text-[clamp(30px,2.8vw,44px)] font-black leading-[1.18]" style={{ color: theme.palette.foreground }}>
              先选你想要谁陪你减脂，再决定这个人该怎么和你说话。
            </h1>
            <p className="max-w-2xl text-sm leading-6" style={{ color: theme.palette.foregroundMuted }}>
              创建一个长期陪你记录、提醒和复盘的减脂搭子。先把类型、人设和你的基础信息分步定下来。
            </p>
          </div>

          <div
            className="self-center rounded-[28px] border p-5 backdrop-blur-md"
            style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg }}
          >
            <div className="flex items-center justify-between gap-5">
              <div className="min-w-0">
                <div>
                  <div className="text-sm uppercase tracking-[0.24em]" style={{ color: theme.palette.previewMutedText }}>{theme.heroLabel}</div>
                  <div className="mt-2 truncate text-2xl font-black" style={{ color: theme.palette.previewText }}>{draft.companion.customName || "未命名搭子"}</div>
                </div>
                <div className="mt-3 rounded-[22px] p-4" style={{ background: theme.palette.accentSoft, color: theme.palette.previewText }}>
                  <div className="text-lg font-semibold">{draft.companion.archetype}</div>
                  <div className="mt-1 text-sm leading-6">{draft.companion.profession || "职业待设定"}</div>
                  <div className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: theme.palette.previewMutedText }}>
                    {draft.companion.persona || "人设会影响主页文案和陪伴语气。"}
                  </div>
                </div>
              </div>
              <div
                className="flex size-24 shrink-0 items-center justify-center rounded-full text-4xl font-black text-white"
                style={{ background: theme.palette.orb, boxShadow: theme.palette.orbGlow }}
              >
                {draft.companion.category === "帅哥" ? "型" : draft.companion.category === "美女" ? "魅" : "萌"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="max-w-md text-sm leading-6" style={{ color: theme.palette.foregroundMuted }}>
              {theme.heroDescription}
            </div>
            <div className="flex gap-2">
              {stepOrder.map((step, index) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  aria-label={stepLabels[step]}
                  className="size-2.5 rounded-full transition"
                  style={{ background: currentStep === step ? theme.palette.tagText : theme.palette.foregroundMuted }}
                >
                  <span className="sr-only">{index + 1}. {stepLabels[step]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] p-6" delay={0.12}>
        <div className="flex items-center justify-between gap-6">
          <SectionTitle title="开始建档" subtitle={`${currentStepIndex + 1}/4 · ${stepDescriptions[currentStep]}`} />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-full bg-slate-100 p-1">
          {stepOrder.map((step, index) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                currentStep === step
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{index + 1}</span>
              {stepLabels[step]}
            </button>
          ))}
        </div>

        <div className="mt-5 min-h-0 overflow-hidden">
          <div className="h-full overflow-hidden rounded-[26px] border border-slate-100 bg-slate-50/80 p-4">
            {currentStep === "category" ? (
              <div className="grid h-full grid-rows-[auto_1fr] gap-4">
                <div>
                    <div className="text-lg font-semibold text-slate-900">选择搭子类型</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">先定风格，再定人设，最后填你的基础资料。</div>
                </div>
                <div className="grid min-h-0 grid-rows-[auto_1fr] gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    {companionCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() =>
                          updateDraft({
                            companion: {
                              ...draft.companion,
                              category,
                              archetype: companionArchetypes[category][0],
                            },
                          })
                        }
                        className={`rounded-[22px] border px-4 py-3.5 text-left transition ${
                          draft.companion.category === category
                            ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-base font-semibold">{category}</div>
                        <div className="mt-1 text-sm leading-5 text-inherit/72">
                          {category === "帅哥" ? "冷感督促、压迫感更强" : category === "美女" ? "情绪价值更重、氛围更暧昧" : "更治愈、更轻松、陪跑感更强"}
                        </div>
                      </button>
                    ))}
                  </div>
                    <div className="min-h-0 rounded-[22px] bg-white p-3">
                    <div className="text-sm font-semibold text-slate-900">当前已选</div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-xl font-black text-slate-950">{draft.companion.category}</div>
                        <div className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{theme.heroDescription}</div>
                      </div>
                      <Tag className="shrink-0 bg-white py-1 text-slate-700">{theme.heroTitle}</Tag>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {currentStep === "companion" ? (
              <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="shrink-0">
                    <div className="text-lg font-semibold text-slate-900">定制搭子设定</div>
                    <div className="mt-0.5 text-sm text-slate-500">名字、职业、人设、性格</div>
                  </div>
                  <label className="grid min-w-[220px] flex-1 gap-1.5">
                    <span className="text-xs font-medium text-slate-500">细分原型</span>
                    <select
                      value={draft.companion.archetype}
                      onChange={(event) =>
                        updateDraft({
                          companion: {
                            ...draft.companion,
                            archetype: event.target.value as CompanionArchetype,
                          },
                        })
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500"
                    >
                      {companionArchetypes[draft.companion.category].map((archetype) => (
                        <option key={archetype} value={archetype}>
                          {archetype}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-4 overflow-hidden">
                  <CompactInputField
                    label="搭子名字"
                    value={draft.companion.customName}
                    onChange={(value) =>
                      updateDraft({
                        companion: {
                          ...draft.companion,
                          customName: value,
                        },
                      })
                    }
                  />
                  <CompactInputField
                    label="职业"
                    value={draft.companion.profession}
                    onChange={(value) =>
                      updateDraft({
                        companion: {
                          ...draft.companion,
                          profession: value,
                        },
                      })
                    }
                  />
                  <CompactTextAreaField
                    label="人设"
                    value={draft.companion.persona}
                    onChange={(value) =>
                      updateDraft({
                        companion: {
                          ...draft.companion,
                          persona: value,
                        },
                      })
                    }
                  />
                  <CompactTextAreaField
                    label="性格"
                    value={draft.companion.personality}
                    onChange={(value) =>
                      updateDraft({
                        companion: {
                          ...draft.companion,
                          personality: value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            ) : null}

            {currentStep === "required" ? (
              <div className="grid h-full min-h-0 grid-cols-[1fr_1fr] gap-5 overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">填写必填资料</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">只保留进入计划生成必须用到的信息。</div>
                  </div>
                  <InputField label="目前体重 (kg)" value={draft.currentWeight} onChange={(value) => updateDraft({ currentWeight: value })} />
                  <InputField
                    label="身高 (cm)"
                    value={draft.heightInCentimeters}
                    onChange={(value) => updateDraft({ heightInCentimeters: value })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <span className="text-sm font-medium text-slate-600">性别</span>
                    <div className="grid grid-cols-4 rounded-full bg-slate-100 p-1">
                      {genderOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => updateDraft({ gender: option })}
                          className={`rounded-full px-3 py-3 text-sm font-medium transition ${
                            draft.gender === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-600">出生日期</span>
                    <input
                      type="date"
                      value={draft.birthDate}
                      onChange={(event) => updateDraft({ birthDate: event.target.value })}
                      className="h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
                    />
                  </label>

                  <div className="rounded-[22px] bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                    这里只保留生成初始计划真正需要的核心信息。你不需要在一屏里把所有内容都填完。
                  </div>
                </div>
              </div>
            ) : null}

            {currentStep === "optional" ? (
              <div className="grid h-full min-h-0 grid-cols-[1fr_1fr] gap-5 overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">补充资料</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">这些不阻塞进入产品，所以单独收在最后一步。</div>
                  </div>
                  <InputField label="职业" value={draft.occupation} onChange={(value) => updateDraft({ occupation: value })} />
                  <InputField label="减脂目标" value={draft.goal} onChange={(value) => updateDraft({ goal: value })} />
                </div>
                <div>
                  <TextAreaField
                    label="补充偏好"
                    value={draft.preferences}
                    rows={5}
                    onChange={(value) => updateDraft({ preferences: value })}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setCurrentStep(stepOrder[Math.max(0, currentStepIndex - 1)])}
              disabled={currentStepIndex === 0}
              className={currentStepIndex === 0 ? "cursor-not-allowed opacity-50" : ""}
            >
              上一步
            </SecondaryButton>
            {currentStepIndex < stepOrder.length - 1 ? (
              <PrimaryButton onClick={() => setCurrentStep(stepOrder[Math.min(stepOrder.length - 1, currentStepIndex + 1)])}>
                下一步
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={submit} disabled={!isValid} className={!isValid ? "cursor-not-allowed opacity-50" : ""}>
                进入工作台
              </PrimaryButton>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="max-w-[280px] text-sm leading-6 text-slate-500">
              {!isValid ? "至少需要填写体重和身高，才能生成更合理的初始计划。" : "信息足够了，可以直接进入横版工作台。"}
            </div>
            <SecondaryButton onClick={skipOnboarding}>先用默认档案体验</SecondaryButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

type OnboardingStep = "category" | "companion" | "required" | "optional";

const stepLabels: Record<OnboardingStep, string> = {
  category: "搭子类型",
  companion: "搭子设定",
  required: "必填资料",
  optional: "可选资料",
};

const stepDescriptions: Record<OnboardingStep, string> = {
  category: "先定搭子类型和整体风格",
  companion: "再定名字、职业、人设和性格",
  required: "填写进入产品必需的基础信息",
  optional: "最后补充目标和偏好",
};

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}

function CompactInputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid min-h-0 grid-rows-[auto_1fr] gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 min-h-0 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}

function CompactTextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid min-h-0 grid-rows-[auto_1fr] gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-0 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}
