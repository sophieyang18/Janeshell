import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircleMore, NotebookTabs, Sparkles, StickyNote } from "lucide-react";

import { ChatPanel } from "@/components/chat/ChatPanel";
import { GlassCard, SectionTitle, Tag } from "@/components/common/ui";
import { PlansPanel } from "@/components/plans/PlansPanel";
import { RecordsPanel } from "@/components/records/RecordsPanel";
import { useAppStore } from "@/store/use-app-store";
import { companionPanels, getCompanionTheme, type CompanionPanel } from "@/types/domain";

function resolveSectionTone(): "light" | "dark" {
  return "light";
}

export function WorkspaceShell({ view = "workspace" }: { view?: "workspace" | "chat" | "records" | "plans" }) {
  const location = useLocation();
  const profile = useAppStore((state) => state.profile);
  const selectedPanel = useAppStore((state) => state.selectedPanel);
  const selectPanel = useAppStore((state) => state.selectPanel);
  const resetProfile = useAppStore((state) => state.resetProfile);
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
    return <FocusedPageLayout title="记录中心" subtitle="体重、用餐、运动都在这里做横版浏览。"><RecordsPanel /></FocusedPageLayout>;
  }

  if (view === "plans") {
    return <FocusedPageLayout title="计划中心" subtitle="任务、趋势、档案、后续能力接口集中在同一页。"><PlansPanel /></FocusedPageLayout>;
  }

  return (
    <div className="h-[100dvh] overflow-hidden p-5" style={{ background: theme.palette.background }}>
      <div className="mx-auto grid h-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)] gap-5 overflow-hidden">
        <header
          className="glass-card flex items-center justify-between px-5 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.shellCardBg, color: theme.palette.shellText }}
        >
          <div className="flex items-center gap-5">
            <div>
              <div className="text-xs uppercase tracking-[0.28em]" style={{ color: theme.palette.shellMutedText }}>JianBei Workspace</div>
              <h1 className="text-2xl font-black" style={{ color: theme.palette.shellText }}>简贝横版工作台</h1>
            </div>
            <Tag className="border border-white/10" style={{ background: theme.palette.tagBg, color: theme.palette.tagText }}>
              {profile?.companion.category ?? "帅哥"} / {profile?.companion.archetype ?? "肌肉男教练"}
            </Tag>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex gap-1 rounded-full p-1.5" style={{ border: `1px solid ${theme.palette.shellCardBorder}`, background: theme.palette.previewCardBg }}>
              <TopNavLink to="/workspace" active={currentNav === "workspace"} icon={<Sparkles className="size-4" />} label="主页" />
              <TopNavLink to="/chat" active={currentNav === "chat"} icon={<MessageCircleMore className="size-4" />} label="聊天" />
              <TopNavLink to="/records" active={currentNav === "records"} icon={<NotebookTabs className="size-4" />} label="记录" />
              <TopNavLink to="/plans" active={currentNav === "plans"} icon={<StickyNote className="size-4" />} label="计划" />
            </nav>
            <button
              onClick={resetProfile}
              className="pill-button px-4 py-2.5 text-sm"
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
  const sectionTone = resolveSectionTone();
  return (
    <GlassCard
      className="grid h-full min-h-0 grid-cols-[92px_minmax(0,1fr)] gap-5 overflow-hidden p-5 shadow-[0_24px_70px_rgba(9,14,28,0.18)] xl:grid-cols-[118px_minmax(0,1fr)] xl:gap-6 xl:p-6"
      style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.shellCardBg }}
    >
      <div className="flex flex-col gap-3 xl:gap-4">
        {companionPanels.map((panel) => (
          <button
            key={panel}
            onClick={() => selectPanel(panel)}
            className="rounded-[20px] px-3 py-3 text-sm font-semibold transition xl:rounded-[24px] xl:px-4 xl:py-4"
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

      <div className="relative min-h-0 min-w-0 overflow-hidden rounded-[30px] border p-6 xl:rounded-[34px] xl:p-8" style={{ background: theme.palette.background, borderColor: theme.palette.shellCardBorder }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_35%)]" />
        <div className="relative grid h-full min-h-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-5">
          <ThemeThumbnail />
          <div className="flex min-h-0 flex-col items-center justify-center gap-6">
            <div
              className="flex size-44 items-center justify-center rounded-full text-7xl font-black text-white xl:size-64 xl:text-8xl"
              style={{ background: theme.palette.orb, boxShadow: theme.palette.orbGlow }}
            >
              {companionProfile.name.slice(0, 1)}
            </div>
            <div className="text-center">
              <div className="text-5xl font-black xl:text-7xl" style={{ color: theme.palette.foreground }}>{companionProfile.name}</div>
              <div className="mt-3 text-sm uppercase tracking-[0.22em] xl:mt-4 xl:text-base xl:tracking-[0.28em]" style={{ color: theme.palette.stageMetaText }}>{companionProfile.summary}</div>
              <div className="mt-4 max-w-3xl text-base leading-7 xl:mt-5 xl:text-xl xl:leading-9" style={{ color: theme.palette.stageBodyText }}>
                {companionProfile.moodLine}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-[28px] px-6 py-5" style={{ background: theme.palette.previewCardBg }}>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.18em]" style={{ color: theme.palette.previewMutedText }}>阿简正在说</div>
              <div className="mt-2 truncate text-2xl font-semibold" style={{ color: theme.palette.previewText }}>{resolveSpeech(selectedPanel)}</div>
            </div>
            <Link to="/chat" className="pill-button hidden shrink-0 px-6 py-3 xl:inline-flex" style={{ background: theme.palette.panelActive, color: "#ffffff" }}>
              进入聊天
            </Link>
          </div>
        </div>
      </div>

    </GlassCard>
  );
}

function ThemeThumbnail() {
  const profile = useAppStore((state) => state.profile);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  return (
    <div
      className="min-w-0 rounded-[22px] border px-4 py-3"
      style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg }}
    >
      <div className="text-xs uppercase tracking-[0.18em]" style={{ color: theme.palette.previewMutedText }}>
        当前主题
      </div>
      <div className="mt-1 truncate text-lg font-black" style={{ color: theme.palette.previewText }}>
        {theme.heroTitle}
      </div>
    </div>
  );
}

function TopNavLink({
  to,
  active,
  icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: ReactNode;
  label: string;
}) {
  const profile = useAppStore((state) => state.profile);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  return (
    <Link
      to={to}
      className="pill-button gap-2 px-4 py-2.5"
      style={
        active
          ? { background: theme.palette.panelActive, color: "#ffffff" }
          : { background: "transparent", color: theme.palette.shellMutedText }
      }
    >
      {icon}
      {label}
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
