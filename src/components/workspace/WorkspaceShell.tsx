import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircleMore, NotebookTabs, Sparkles, StickyNote } from "lucide-react";

import { ChatPanel } from "@/components/chat/ChatPanel";
import { GlassCard, SectionTitle, Tag } from "@/components/common/ui";
import { PlansPanel } from "@/components/plans/PlansPanel";
import { RecordsPanel } from "@/components/records/RecordsPanel";
import { useAppStore } from "@/store/use-app-store";
import {
  companionPanels,
  getCompanionFigureSrc,
  getCompanionSceneSrc,
  getCompanionTheme,
  recordTypes,
  type CompanionCategory,
  type CompanionPanel,
  type CompanionProfile,
  type CompanionTheme,
  type RecordType,
} from "@/types/domain";

function resolveSectionTone(): "light" | "dark" {
  return "light";
}

export function WorkspaceShell({ view = "workspace" }: { view?: "workspace" | "chat" | "records" | "plans" }) {
  const location = useLocation();
  const profile = useAppStore((state) => state.profile);
  const selectedPanel = useAppStore((state) => state.selectedPanel);
  const selectPanel = useAppStore((state) => state.selectPanel);
  const resetProfile = useAppStore((state) => state.resetProfile);
  const backendStatus = useAppStore((state) => state.backendStatus);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);

  const currentNav = location.pathname.startsWith("/chat")
    ? "chat"
    : location.pathname.startsWith("/records")
      ? "records"
      : location.pathname.startsWith("/plans")
        ? "plans"
        : "workspace";

  if (view === "chat") {
    return <FocusedPageLayout title="聊天工作区" subtitle="把搭子对话拉宽成更适合桌面的操作区。"><ChatPanel /></FocusedPageLayout>;
  }

  if (view === "records") {
    const focusType = getRecordTypeFromSearch(location.search);
    const initialMode = getRecordModeFromSearch(location.search);
    return <FocusedPageLayout title="记录中心" subtitle="体重、用餐、运动、饮水都在这里做横版浏览。"><RecordsPanel focusType={focusType} initialMode={initialMode} /></FocusedPageLayout>;
  }

  if (view === "plans") {
    return <FocusedPageLayout title="计划中心" subtitle="任务、趋势、档案、后续能力接口集中在同一页。"><PlansPanel /></FocusedPageLayout>;
  }

  return (
    <div className="h-[100dvh] overflow-hidden p-5" style={{ background: theme.palette.background }}>
      <div className="mx-auto grid h-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)] gap-5 overflow-hidden">
        <header
          className="glass-card grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.shellCardBg, color: theme.palette.shellText }}
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="min-w-0">
              <div className="truncate text-xs uppercase tracking-[0.28em]" style={{ color: theme.palette.shellMutedText }}>JianBei Workspace</div>
              <h1 className="truncate whitespace-nowrap text-xl font-black xl:text-2xl" style={{ color: theme.palette.shellText }}>简贝横版工作台</h1>
            </div>
            <Tag className="hidden shrink-0 whitespace-nowrap border border-white/10 xl:inline-flex" style={{ background: theme.palette.tagBg, color: theme.palette.tagText }}>
              {profile?.companion.category ?? "帅哥"} / {profile?.companion.archetype ?? "肌肉男教练"}
            </Tag>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <nav className="flex gap-1 rounded-full p-1.5" style={{ border: `1px solid ${theme.palette.shellCardBorder}`, background: theme.palette.previewCardBg }}>
              <TopNavLink to="/workspace" active={currentNav === "workspace"} icon={<Sparkles className="size-4" />} label="主页" description="主页：查看搭子主形象、实时通知、互动入口和今日状态。" align="left" />
              <TopNavLink to="/chat" active={currentNav === "chat"} icon={<MessageCircleMore className="size-4" />} label="聊天" description="聊天：进入完整对话区，支持文字、语音占位、表情和通话入口。" />
              <TopNavLink to="/records" active={currentNav === "records"} icon={<NotebookTabs className="size-4" />} label="记录" description="记录：浏览体重、用餐、运动、饮水日历和最近打卡内容。" />
              <TopNavLink to="/plans" active={currentNav === "plans"} icon={<StickyNote className="size-4" />} label="计划" description="计划：查看后端生成的今日饮食、运动、情绪和打卡任务。" align="right" />
            </nav>
            <div
              className="hidden rounded-full px-3 py-2 text-xs font-black xl:block"
              style={{ background: theme.palette.tagBg, color: theme.palette.tagText }}
            >
              {backendStatus === "connected" ? "后端已连接" : backendStatus === "offline" ? "本地兜底" : "联调中"}
            </div>
            <button
              onClick={resetProfile}
              className="pill-button shrink-0 whitespace-nowrap px-4 py-2.5 text-sm"
              style={{ border: `1px solid ${theme.palette.shellCardBorder}`, background: theme.palette.previewCardBg, color: theme.palette.shellText }}
            >
              重新建档
            </button>
          </div>
        </header>

        <main className="min-h-0 overflow-hidden">
          <CompanionStage selectedPanel={selectedPanel} selectPanel={selectPanel} />
        </main>
      </div>
    </div>
  );
}

function FocusedPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const profile = useAppStore((state) => state.profile);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  const sectionTone = resolveSectionTone();

  return (
    <div className="h-[100dvh] overflow-hidden p-5" style={{ background: theme.palette.background }}>
      <div className="mx-auto grid h-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)] gap-5 overflow-hidden">
        <header
          className="glass-card flex items-center justify-between px-5 py-3"
          style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.shellCardBg, color: theme.palette.shellText }}
        >
          <SectionTitle title={title} subtitle={subtitle} tone={sectionTone} />
          <Link to="/workspace" className="pill-button px-5 py-2.5 text-white shadow-[0_18px_30px_rgba(22,163,74,0.24)]" style={{ background: theme.palette.panelActive }}>
            回到主页
          </Link>
        </header>
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function CompanionStage({
  selectedPanel,
  selectPanel,
}: {
  selectedPanel: CompanionPanel;
  selectPanel: (panel: CompanionPanel) => void;
}) {
  const companionProfile = useAppStore((state) => state.companionProfile);
  const profile = useAppStore((state) => state.profile);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  const companionCategory = profile?.companion.category ?? "帅哥";
  const companionFigureSrc = getCompanionFigureSrc(profile?.companion);
  const companionSceneSrc = getCompanionSceneSrc(profile?.companion);
  return (
    <GlassCard
      className="relative grid h-full min-h-0 grid-cols-[88px_minmax(0,1fr)_220px] gap-4 overflow-hidden p-4 shadow-[0_24px_70px_rgba(9,14,28,0.18)] xl:grid-cols-[112px_minmax(0,1fr)_280px] xl:gap-5 xl:p-5"
      style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.shellCardBg }}
    >
      <div className="grid min-h-0 grid-rows-4 gap-3">
        {companionPanels.map((panel) => (
          <button
            key={panel}
            onClick={() => selectPanel(panel)}
            className="flex min-h-0 items-center justify-center rounded-[20px] px-2 text-sm font-semibold leading-5 transition xl:rounded-[24px] xl:px-4 xl:text-base"
            style={{
              background: selectedPanel === panel ? theme.palette.panelActive : theme.palette.panelIdle,
              color: selectedPanel === panel ? "#ffffff" : theme.palette.panelIdleText,
              boxShadow: selectedPanel === panel ? theme.palette.summaryGlow : "none",
            }}
          >
            {panel}
          </button>
        ))}
      </div>

      <section
        className="relative min-h-0 min-w-0 overflow-hidden rounded-[30px] border p-5 xl:rounded-[34px] xl:p-7"
        style={{ background: theme.palette.background, borderColor: theme.palette.shellCardBorder }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_22%,rgba(255,255,255,0.34),transparent_34%)]" />
        {selectedPanel === "聊天" ? (
          <div className="relative grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 overflow-hidden">
            <div className="min-h-0 overflow-hidden">
              <InteractiveCompanionScene category={companionCategory} src={companionSceneSrc} theme={theme} />
            </div>

            <PanelInteraction selectedPanel={selectedPanel} companionProfile={companionProfile} theme={theme} />
          </div>
        ) : (
          <div className="relative grid h-full min-h-0 grid-cols-[minmax(180px,0.62fr)_minmax(0,1fr)] items-stretch gap-6 overflow-hidden xl:grid-cols-[minmax(260px,0.58fr)_minmax(0,1fr)] xl:gap-8">
            <CompanionFigure category={companionCategory} src={companionFigureSrc} theme={theme} compact={selectedPanel === "查看属性"} />
            <PanelInteraction selectedPanel={selectedPanel} companionProfile={companionProfile} theme={theme} />
          </div>
        )}
      </section>

      <NotificationRail />
    </GlassCard>
  );
}

function CompanionFigure({
  category,
  src,
  theme,
  compact = false,
}: {
  category: CompanionCategory;
  src: string;
  theme: CompanionTheme;
  compact?: boolean;
}) {
  return (
    <div className="flex min-h-0 min-w-0 items-center justify-center">
      <div
        className={`relative flex h-full ${compact ? "max-h-[320px]" : "max-h-[380px]"} min-h-[220px] w-[min(88%,340px)] min-w-[160px] items-end justify-center overflow-hidden rounded-[34px] border`}
        style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.stageCardBg, boxShadow: theme.palette.orbGlow }}
      >
        <div className="absolute inset-x-4 bottom-0 top-10 rounded-full opacity-30 blur-2xl" style={{ background: theme.palette.orb }} />
        <img
          src={src}
          alt={`${category}搭子半身图`}
          className={getFigureClassName(category)}
          draggable={false}
        />
      </div>
    </div>
  );
}

function InteractiveCompanionScene({
  category,
  src,
  theme,
}: {
  category: CompanionCategory;
  src: string;
  theme: CompanionTheme;
}) {
  return (
    <div className="relative h-full min-h-0 w-full min-w-0 overflow-hidden rounded-[34px] border" style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.stageCardBg, boxShadow: theme.palette.orbGlow }}>
      <img
        src={src}
        alt={`${category}搭子横版场景占位图`}
        className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.70),rgba(255,255,255,0.22)_36%,rgba(255,255,255,0.34)_68%,rgba(255,255,255,0.76)),linear-gradient(180deg,rgba(255,255,255,0.34),transparent_42%,rgba(15,23,42,0.08))]" />
      <div className="pointer-events-none absolute inset-x-10 bottom-5 h-24 rounded-[50%] opacity-50 blur-3xl" style={{ background: theme.palette.orb }} />

      <div className="absolute left-5 top-5 z-20 max-w-[46%] rounded-[26px] border px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.13)] backdrop-blur-xl xl:left-7 xl:top-7" style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg }}>
        <div className="text-xs font-black tracking-[0.18em]" style={{ color: theme.palette.tagText }}>INTERACTIVE SCENE</div>
        <div className="mt-1 truncate text-xl font-black xl:text-2xl" style={{ color: theme.palette.previewText }}>阿简的减脂房间</div>
        <div className="mt-1 line-clamp-1 text-xs font-semibold xl:text-sm" style={{ color: theme.palette.previewMutedText }}>
          点击场景物件，直接进入对应记录日历。
        </div>
      </div>

      <SceneHotspot label="体重秤" detail="记录体重" icon="⚖" type="体重" className="left-[7%] top-[40%]" theme={theme} />
      <SceneHotspot label="跑步机" detail="记录运动" icon="🏃" type="运动" className="right-[8%] top-[24%]" theme={theme} />
      <SceneHotspot label="意大利面" detail="记录用餐" icon="🍝" type="用餐" className="left-[18%] bottom-[12%]" theme={theme} />
      <SceneHotspot label="饮水机" detail="记录饮水" icon="💧" type="饮水" className="right-[18%] bottom-[13%]" theme={theme} />
    </div>
  );
}

function SceneHotspot({
  label,
  detail,
  icon,
  type,
  className,
  theme,
}: {
  label: string;
  detail: string;
  icon: string;
  type: RecordType;
  className: string;
  theme: CompanionTheme;
}) {
  return (
    <Link
      to={`/records?type=${encodeURIComponent(type)}`}
      className={`group absolute z-30 min-w-[92px] rounded-[24px] border px-3 py-2.5 text-left shadow-[0_18px_48px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:scale-[1.03] xl:min-w-[118px] ${className}`}
      style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg, color: theme.palette.previewText }}
      aria-label={`${label}，${detail}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl text-lg shadow-inner" style={{ background: theme.palette.accentSoft }}>{icon}</span>
        <div className="min-w-0">
          <div className="truncate text-xs font-black xl:text-sm">{label}</div>
          <div className="truncate text-[11px] font-semibold" style={{ color: theme.palette.previewMutedText }}>{detail}</div>
        </div>
      </div>
    </Link>
  );
}

function PanelInteraction({
  selectedPanel,
  companionProfile,
  theme,
}: {
  selectedPanel: CompanionPanel;
  companionProfile: CompanionProfile;
  theme: CompanionTheme;
}) {
  const [feedback, setFeedback] = useState<{ id: number; text: string } | null>(null);
  const showFeedback = (text: string) => setFeedback({ id: Date.now(), text });
  const interactWithCompanion = useAppStore((state) => state.interactWithCompanion);
  const sendGiftToCompanion = useAppStore((state) => state.sendGiftToCompanion);

  if (selectedPanel === "聊天") {
    return (
      <div className="relative flex min-h-[80px] items-center justify-between gap-5 rounded-[26px] px-5 py-2.5 xl:min-h-[88px] xl:rounded-[28px] xl:px-7" style={{ background: theme.palette.previewCardBg }}>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: theme.palette.previewMutedText }}>阿简正在说</div>
          <div className="mt-1.5 text-base font-semibold leading-6 line-clamp-2 xl:text-xl xl:leading-7" style={{ color: theme.palette.previewText }}>{resolveSpeech(selectedPanel)}</div>
        </div>
        <Link to="/chat" className="pill-button hidden shrink-0 px-6 py-3 xl:inline-flex" style={{ background: theme.palette.panelActive, color: "#ffffff" }}>
          进入聊天
        </Link>
      </div>
    );
  }

  if (selectedPanel === "调戏") {
    return (
      <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2.5 rounded-[36px] p-4" style={{ background: theme.palette.previewCardBg }}>
        <FloatingFeedback feedback={feedback} onDone={() => setFeedback(null)} theme={theme} />
        <PanelHeader eyebrow="亲密互动" title="选动作，触发反馈" detail="轻互动会影响亲密度和情绪值。" theme={theme} />
        <div className="grid min-h-0 grid-cols-2 gap-3">
          {[
            ["挠痒痒", "破冰反馈 +2"],
            ["抬下巴", "心动反馈 +3"],
            ["捏脸", "情绪反馈 +2"],
            ["拥抱", "陪伴反馈 +4"],
          ].map(([action, hint]) => (
            <button
              key={action}
              onClick={async () => {
                const line = await interactWithCompanion(action);
                showFeedback(line || hint);
              }}
              className="group flex min-h-0 min-w-0 flex-col justify-center rounded-[30px] border px-3.5 py-3 text-left transition hover:-translate-y-0.5"
              style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.accentSoft }}
            >
              <div className="truncate text-base font-black xl:text-lg" style={{ color: theme.palette.previewText }}>{action}</div>
              <div className="mt-2 rounded-full px-3 py-1.5 text-center text-xs font-black" style={{ background: theme.palette.previewCardBg, color: theme.palette.previewText }}>{hint}</div>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 rounded-[28px] px-4 py-2" style={{ background: theme.palette.accentSoft }}>
          <span className="text-sm font-semibold" style={{ color: theme.palette.previewMutedText }}>可接动画和音效</span>
          <span className="shrink-0 text-sm font-black" style={{ color: theme.palette.previewText }}>今日 0/5</span>
        </div>
      </div>
    );
  }

  if (selectedPanel === "送礼物") {
    return (
      <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2.5 rounded-[36px] p-4" style={{ background: theme.palette.previewCardBg }}>
        <FloatingFeedback feedback={feedback} onDone={() => setFeedback(null)} theme={theme} />
        <PanelHeader eyebrow="礼物商店" title="挑一件礼物" detail="免费礼物和贝壳礼物会改变关系状态。" theme={theme} />
        <div className="grid min-h-0 grid-cols-2 gap-3">
          {[
            ["鲜花", "免费 · 好感 +1"],
            ["小蛋糕", "免费 · 情绪 +2"],
            ["花束", "12 贝壳 · 亲密 +5"],
            ["西装", "30 贝壳 · 限定装扮"],
          ].map(([gift, effect]) => (
            <button
              key={gift}
              onClick={async () => {
                const line = await sendGiftToCompanion(gift);
                showFeedback(line || `已送出 ${gift}`);
              }}
              className="group flex min-h-0 min-w-0 flex-col justify-center rounded-[30px] border px-3.5 py-3 text-left transition hover:-translate-y-0.5 xl:px-4"
              style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.accentSoft }}
            >
              <div className="truncate text-base font-black xl:text-lg" style={{ color: theme.palette.previewText }}>{gift}</div>
              <div className="mt-2 rounded-full px-3 py-1.5 text-center text-xs font-black" style={{ background: theme.palette.previewCardBg, color: theme.palette.previewText }}>{effect}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[28px] px-4 py-2" style={{ background: theme.palette.accentSoft }}>
          <div className="min-w-0">
            <div className="truncate text-sm font-black" style={{ color: theme.palette.previewText }}>贝壳余额</div>
            <div className="mt-0.5 truncate text-xs font-semibold" style={{ color: theme.palette.previewMutedText }}>Mock 状态，后续接支付和背包系统</div>
          </div>
          <div className="text-2xl font-black" style={{ color: theme.palette.previewText }}>86</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-[36px] p-4 xl:p-5" style={{ background: theme.palette.previewCardBg }}>
      <PanelHeader eyebrow="属性面板" title="当前陪伴状态" detail="属性用于表达搭子和用户互动后的关系变化，后续可接任务完成度和礼物记录。" theme={theme} />
      <div className="grid min-h-0 grid-cols-2 gap-3">
        {companionProfile.metrics.map((metric) => (
          <div key={metric.label} className="grid min-h-0 min-w-0 grid-rows-[auto_auto_auto] rounded-[30px] border px-3.5 py-3 xl:px-4 xl:py-3.5" style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.accentSoft }}>
            <div className="flex items-center justify-between gap-3">
              <div className="truncate text-sm font-black" style={{ color: theme.palette.previewText }}>{metric.label}</div>
              <div className="text-xl font-black xl:text-2xl" style={{ color: theme.palette.previewText }}>{metric.value}</div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/60">
              <div className="h-full rounded-full" style={{ width: `${metric.value}%`, background: theme.palette.panelActive }} />
            </div>
            <div className="mt-2 truncate text-xs font-semibold" style={{ color: theme.palette.previewMutedText }}>
              {metric.value >= 90 ? "状态很高" : metric.value >= 80 ? "稳定上升" : "还有提升空间"}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["年龄 24", "身高 184", "情绪 稳定"].map((item) => (
          <div key={item} className="rounded-[24px] px-3 py-1.5 text-center text-xs font-black xl:text-sm" style={{ background: theme.palette.accentSoft, color: theme.palette.previewText }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingFeedback({
  feedback,
  onDone,
  theme,
}: {
  feedback: { id: number; text: string } | null;
  onDone: () => void;
  theme: CompanionTheme;
}) {
  if (!feedback) return null;

  return (
    <div
      key={feedback.id}
      className="pointer-events-none absolute left-1/2 top-8 z-20 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-black shadow-[0_18px_40px_rgba(15,23,42,0.16)] animate-[float-heart_1.2s_ease-out_forwards]"
      style={{ background: theme.palette.tagBg, color: theme.palette.tagText }}
      onAnimationEnd={onDone}
    >
      <span className="mr-1">♥</span>
      {feedback.text.replace(/^♥\s*/, "")}
    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  detail,
  theme,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  theme: CompanionTheme;
}) {
  return (
    <div className="min-w-0">
      <div className="inline-flex rounded-full px-3 py-1 text-[11px] font-black tracking-[0.16em]" style={{ background: theme.palette.tagBg, color: theme.palette.tagText }}>{eyebrow}</div>
      <div className="mt-2 truncate text-xl font-black xl:text-2xl" style={{ color: theme.palette.previewText }}>{title}</div>
      <div className="mt-1 truncate text-sm font-semibold leading-6" style={{ color: theme.palette.previewMutedText }}>{detail}</div>
    </div>
  );
}

function NotificationRail() {
  const profile = useAppStore((state) => state.profile);
  const tasks = useAppStore((state) => state.tasks);
  const records = useAppStore((state) => state.records);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  const completed = tasks.filter((task) => task.isCompleted).length;
  const latestRecord = records[0];
  const notices = [
    {
      title: "今日任务",
      detail: `${completed}/${tasks.length} 已完成`,
    },
    {
      title: "记录提醒",
      detail: latestRecord ? `${latestRecord.type} · ${latestRecord.title}` : "今晚补一条记录",
    },
    {
      title: "搭子状态",
      detail: profile?.goal ? "目标已同步给阿简" : "可先设置减脂目标",
    },
  ];

  return (
    <aside
      className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[26px] border p-4 xl:rounded-[30px] xl:p-5"
      style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg, color: theme.palette.shellText }}
    >
      <div>
        <div className="text-base font-black leading-6">消息综合</div>
        <div className="mt-1 text-xs leading-5 line-clamp-2" style={{ color: theme.palette.previewMutedText }}>
          只保留和今天相关的信息
        </div>
      </div>
      <div className="mt-4 grid min-h-0 content-start gap-3 overflow-hidden">
        {notices.map((notice) => (
          <div key={notice.title} className="rounded-[20px] px-3 py-3" style={{ background: theme.palette.accentSoft }}>
            <div className="text-xs font-semibold leading-5" style={{ color: theme.palette.previewMutedText }}>{notice.title}</div>
            <div className="mt-1 line-clamp-2 text-sm font-semibold leading-5" style={{ color: theme.palette.previewText }}>{notice.detail}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        <Link
          to="/records?type=%E4%BD%93%E9%87%8D&mode=manual"
          className="rounded-[18px] px-3 py-3 text-sm font-black transition hover:-translate-y-0.5"
          style={{ background: theme.palette.panelActive, color: "#ffffff" }}
        >
          体重手动写入
        </Link>
        <Link
          to="/records?type=%E7%94%A8%E9%A4%90&mode=image"
          className="rounded-[18px] px-3 py-3 text-sm font-black transition hover:-translate-y-0.5"
          style={{ background: theme.palette.accentSoft, color: theme.palette.previewText }}
        >
          拍照识别饮食
        </Link>
      </div>
    </aside>
  );
}

function TopNavLink({
  to,
  active,
  icon,
  label,
  description,
  align = "center",
}: {
  to: string;
  active: boolean;
  icon: ReactNode;
  label: string;
  description: string;
  align?: "left" | "center" | "right";
}) {
  const profile = useAppStore((state) => state.profile);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  return (
    <Link
      to={to}
      className="pill-button group relative gap-2 whitespace-nowrap px-4 py-2.5"
      style={
        active
          ? { background: theme.palette.panelActive, color: "#ffffff" }
          : { background: "transparent", color: theme.palette.shellMutedText }
      }
    >
      {icon}
      {label}
      <span
        className={`pointer-events-none absolute top-[calc(100%+10px)] z-30 w-56 max-w-[calc(100vw-32px)] whitespace-normal break-words rounded-[18px] px-4 py-3 text-left text-xs font-semibold leading-5 opacity-0 shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition group-hover:opacity-100 group-focus-visible:opacity-100 ${
          align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2"
        }`}
        style={{ background: theme.palette.shellCardBg, color: theme.palette.shellText, border: `1px solid ${theme.palette.shellCardBorder}` }}
      >
        {description}
      </span>
    </Link>
  );
}

function resolveSpeech(panel: CompanionPanel) {
  const companionProfile = useAppStore.getState().companionProfile;
  if (panel === "聊天") return companionProfile.openingLine;
  if (panel === "调戏") return "要摸摸头、捏脸还是拥抱？我都记账。";
  if (panel === "送礼物") return "你今天已经被我夸过一次了，再送礼的话我会更认真盯你打卡。";
  return "这些数值后面可以和任务完成度、聊天频次、礼物、情绪陪伴联动。";
}

function getRecordTypeFromSearch(search: string): RecordType {
  const value = new URLSearchParams(search).get("type");
  const matched = recordTypes.find((type) => type === value);

  return matched ?? "体重";
}

function getRecordModeFromSearch(search: string): "manual" | "image" | null {
  const value = new URLSearchParams(search).get("mode");
  if (value === "manual" || value === "image") return value;
  return null;
}

function getFigureClassName(category: CompanionCategory) {
  if (category === "萌宠") {
    return "relative h-full w-full scale-110 object-cover object-center";
  }

  if (category === "美女") {
    return "relative h-full w-full scale-[1.16] object-cover object-[50%_20%]";
  }

  return "relative h-full w-full scale-[1.14] object-cover object-[50%_18%]";
}
