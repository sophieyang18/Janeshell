import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GlassCard, PrimaryButton, SecondaryButton, SectionTitle, Tag } from "@/components/common/ui";
import { buildProfileFromDraft, useAppStore } from "@/store/use-app-store";
import {
  companionArchetypes,
  companionArchetypeFigureSrc,
  companionCategories,
  genderOptions,
  getCompanionFigureSrc,
  getCompanionTheme,
  getSafeCompanionArchetype,
  type CompanionArchetype,
  type CompanionCategory,
} from "@/types/domain";

export function OnboardingForm() {
  const navigate = useNavigate();
  const rawDraft = useAppStore((state) => state.onboardingDraft);
  const updateDraft = useAppStore((state) => state.updateOnboardingDraft);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const skipOnboarding = useAppStore((state) => state.skipOnboarding);
  const draft = {
    ...rawDraft,
    companion: {
      ...rawDraft.companion,
      archetype: getSafeCompanionArchetype(rawDraft.companion.category, rawDraft.companion.archetype),
    },
  };
  const theme = getCompanionTheme(draft.companion.category, draft.gender);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("category");
  const [isEntering, setIsEntering] = useState(false);

  const submit = async () => {
    if (isEntering) return;

    const profile = buildProfileFromDraft(draft);
    if (!profile) return;
    setIsEntering(true);
    await completeOnboarding(profile);
    navigate("/workspace", { replace: true });
  };

  const isValid = Boolean(draft.currentWeight && draft.heightInCentimeters);
  const stepOrder: OnboardingStep[] = ["category", "companion", "required", "optional"];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const currentExampleIndex = companionExamples.findIndex((example) => example.category === draft.companion.category);

  const applyCompanionExample = (example: CompanionExample) => {
    updateDraft({
      companion: {
        ...draft.companion,
        category: example.category,
        archetype: example.archetype,
        customName: example.name,
        profession: example.identity,
        persona: example.persona,
        personality: example.personality,
      },
    });
  };

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
              减肥搭子定制台
            </Tag>
            <h1 className="max-w-3xl text-[clamp(30px,2.8vw,44px)] font-black leading-[1.18]" style={{ color: theme.palette.foreground }}>
              定制你的专属搭子
            </h1>
            <p className="max-w-2xl text-sm leading-6" style={{ color: theme.palette.foregroundMuted }}>
              好的搭子，是减肥成功的一半
            </p>
          </div>

          <div
            className="self-center rounded-[28px] border p-5 backdrop-blur-md"
            style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg }}
          >
            <div className="flex items-center justify-between gap-5">
              <div className="min-w-0">
                <div>
                  <div className="mt-2 truncate text-2xl font-black" style={{ color: theme.palette.previewText }}>{draft.companion.customName || "萧晗"}</div>
                  <div className="mt-1 text-sm font-semibold" style={{ color: theme.palette.previewMutedText }}>{draft.companion.profession || "偶像"}</div>
                </div>
                <div className="mt-3 rounded-[22px] p-4" style={{ background: theme.palette.accentSoft, color: theme.palette.previewText }}>
                  <div className="text-lg font-semibold">{draft.companion.archetype}</div>
                  <div className="mt-2 line-clamp-3 text-sm leading-6" style={{ color: theme.palette.previewMutedText }}>
                    {draft.companion.persona || "嘴硬王者但心很软，光芒万丈但只给你专属的温柔。"}
                  </div>
                </div>
              </div>
              <div
                className="relative h-44 w-32 shrink-0 overflow-hidden rounded-[30px] border xl:h-52 xl:w-40"
                style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.stageCardBg, boxShadow: theme.palette.orbGlow }}
              >
                <div className="absolute inset-x-3 bottom-0 top-10 rounded-full opacity-30 blur-xl" style={{ background: theme.palette.orb }} />
                <img
                  src={getCompanionFigureSrc(draft.companion)}
                  alt={`${draft.companion.category}搭子半身图`}
                  className={draft.companion.category === "萌宠" ? "relative h-full w-full scale-110 object-cover object-center" : "relative h-full w-full scale-110 object-cover object-[50%_18%]"}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="max-w-md text-sm leading-6" style={{ color: theme.palette.foregroundMuted }}>
              减肥？简贝！最懂你的专属AI减肥搭子！
            </div>
            <div className="flex gap-2">
              {companionExamples.map((example, index) => (
                <button
                  key={example.name}
                  onClick={() => applyCompanionExample(example)}
                  aria-label={example.label}
                  className="size-2.5 rounded-full transition"
                  style={{ background: currentExampleIndex === index ? theme.palette.tagText : theme.palette.foregroundMuted }}
                >
                  <span className="sr-only">{index + 1}. {example.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] p-6" delay={0.12}>
        <div className="flex items-center justify-between gap-6">
          <SectionTitle title="建立搭子和个人档案" subtitle={`${currentStepIndex + 1}/4 · ${stepDescriptions[currentStep]}`} />
            <button
              onClick={() => navigate("/welcome")}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-500 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              返回欢迎页
            </button>
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
                    <div className="text-lg font-semibold text-slate-900">选择你的搭子类型：</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">先选一个你最想被陪伴的方向。</div>
                </div>
                  <div className="grid min-h-0">
                    <div className="grid min-h-0 grid-cols-3 gap-4">
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
                          className={`grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] rounded-[26px] border px-4 py-4 text-center transition ${
                          draft.companion.category === category
                              ? "border-slate-900 bg-slate-950 text-white shadow-[0_22px_60px_rgba(15,23,42,0.20)]"
                              : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                        }`}
                      >
                          <div className="text-[clamp(24px,2.6vw,34px)] font-black leading-none tracking-[-0.04em]">
                            {getCategoryDisplayName(category)}
                          </div>
                          <div className="mx-auto mt-4 max-w-[180px] text-sm font-semibold leading-6 text-inherit/75">
                          {category === "帅哥" ? "上天欠你的帅哥我给你" : category === "美女" ? "香香软软的搭子你值得拥有" : "来只毛孩子治愈你"}
                        </div>
                          <div className="mt-auto grid max-h-[150px] grid-cols-3 justify-items-center gap-2 overflow-hidden rounded-[18px] bg-white/12 p-2">
                            {companionArchetypes[category].map((archetype) => (
                              <div
                                key={archetype}
                                className="size-10 overflow-hidden rounded-[12px] border border-white/35 bg-white/30 shadow-sm xl:size-11"
                                title={archetype}
                              >
                                <img
                                  src={companionArchetypeFigureSrc[archetype]}
                                  alt={archetype}
                                  className="h-full w-full object-cover"
                                  draggable={false}
                                />
                              </div>
                            ))}
                          </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {currentStep === "companion" ? (
              <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-5 overflow-hidden">
                <div className="grid gap-1">
                  <div className="min-w-0">
                    <div className="text-lg font-black text-slate-900">设置搭子人设</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">原型、名字、人设和性格会决定搭子的陪伴语气。</div>
                  </div>
                </div>

                <div className="grid min-h-0 grid-cols-2 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                  <label className="grid min-h-0 grid-rows-[auto_1fr] gap-2 rounded-[22px] bg-slate-50 p-3">
                    <span className="text-sm font-black text-slate-700">你的搭子是一个：</span>
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
                      className="h-11 min-h-0 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500"
                    >
                      {companionArchetypes[draft.companion.category].map((archetype) => (
                        <option key={archetype} value={archetype}>
                          {archetype}
                        </option>
                      ))}
                    </select>
                  </label>
                  <CompactInputField
                      label="你的搭子叫："
                    value={draft.companion.customName}
                      placeholder="例如：萧晗"
                    onChange={(value) =>
                      updateDraft({
                        companion: {
                          ...draft.companion,
                          customName: value,
                        },
                      })
                    }
                  />
                  <CompactTextAreaField
                      label="希望搭子怎么陪伴你："
                    value={draft.companion.persona}
                      placeholder="例如：嘴硬王者但心很软，光芒万丈但只给你专属的温柔"
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
                      label="搭子的性格是："
                    value={draft.companion.personality}
                      placeholder="例如：嘴硬、温柔、会哄人，也会认真盯你执行"
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
                      <div className="text-lg font-semibold text-slate-900">基础资料</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">最好把基础信息填完，才能帮你科学减肥哦</div>
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
                    <span className="text-sm font-medium text-slate-600">破壳日</span>
                    <input
                      type="date"
                      value={draft.birthDate}
                      onChange={(event) => updateDraft({ birthDate: event.target.value })}
                      className="h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
                    />
                  </label>

                  <div className="rounded-[22px] bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                    最好把基础信息填完，才能帮你科学减肥哦
                  </div>
                </div>
              </div>
            ) : null}

            {currentStep === "optional" ? (
              <div className="grid h-full min-h-0 grid-cols-[1fr_1fr] gap-5 overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">补充资料</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">不是必须的，但是填了搭子能更懂你哦～</div>
                  </div>
                  <InputField label="职业" value={draft.occupation} placeholder="例如：产品经理 / 学生 / 自由职业" onChange={(value) => updateDraft({ occupation: value })} />
                  <InputField label="减脂目标" value={draft.goal} placeholder="例如：先瘦 5kg，养成稳定运动习惯" onChange={(value) => updateDraft({ goal: value })} />
                </div>
                <div>
                  <TextAreaField
                    label="补充偏好"
                    value={draft.preferences}
                    placeholder="例如：希望温柔提醒，不喜欢太强硬；晚饭容易失控，需要多监督"
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
              <PrimaryButton onClick={submit} disabled={!isValid || isEntering} className={!isValid || isEntering ? "cursor-not-allowed opacity-50" : ""}>
                {isEntering ? "进入中..." : "进入工作台"}
              </PrimaryButton>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="max-w-[280px] text-sm leading-6 text-slate-500">
                不想填了，我想直接体验
            </div>
            <SecondaryButton
              onClick={async () => {
                if (isEntering) return;

                setIsEntering(true);
                await skipOnboarding();
                navigate("/workspace", { replace: true });
              }}
              disabled={isEntering}
              className={isEntering ? "cursor-not-allowed opacity-50" : ""}
            >
              {isEntering ? "进入中..." : "直接领取默认搭子"}
            </SecondaryButton>
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
  required: "基础资料",
  optional: "可选资料",
};

const stepDescriptions: Record<OnboardingStep, string> = {
  category: "选择搭子类型",
  companion: "设置搭子人设",
  required: "填写个人基础资料",
  optional: "填写个人可选资料",
};

type CompanionExample = {
  label: string;
  category: CompanionCategory;
  archetype: CompanionArchetype;
  name: string;
  identity: string;
  persona: string;
  personality: string;
};

const companionExamples: CompanionExample[] = [
  {
    label: "帅哥_偶像萧晗",
    category: "帅哥",
    archetype: "明星",
    name: "萧晗",
    identity: "偶像",
    persona: "嘴硬王者但心很软，光芒万丈但只给你专属的温柔。",
    personality: "嘴硬、克制、温柔，会把你的每一次坚持都认真记住。",
  },
  {
    label: "美女_学姐严姝",
    category: "美女",
    archetype: "性感学姐",
    name: "严姝",
    identity: "学姐",
    persona: "漂亮、清醒、会哄也会管，像校园里只偏爱你的温柔学姐。",
    personality: "成熟、亲密、会夸人，也会认真提醒你别乱吃。",
  },
  {
    label: "萌宠_小兔叽噗噗",
    category: "萌宠",
    archetype: "兔子",
    name: "噗噗",
    identity: "小兔叽",
    persona: "软乎乎的小兔叽，治愈你的焦虑，也陪你把每一天认真过完。",
    personality: "黏人、治愈、元气满满，会用可爱提醒把你拉回计划。",
  },
];

function getCategoryDisplayName(category: CompanionCategory) {
  return category === "萌宠" ? "宠物" : category;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}

function CompactInputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
      <label className="grid min-h-0 grid-rows-[auto_1fr] gap-2 rounded-[22px] bg-slate-50 p-3">
        <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
          className="h-11 min-h-0 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
      />
    </label>
  );
}

function CompactTextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
      <label className="grid min-h-0 grid-rows-[auto_1fr] gap-2 rounded-[22px] bg-slate-50 p-3">
        <span className="text-sm font-black text-slate-700">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
          className="min-h-0 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <textarea
        rows={rows}
        value={value}
          placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}
