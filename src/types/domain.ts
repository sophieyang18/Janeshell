export type MainView = "workspace" | "chat" | "records" | "plans";

export type CompanionCategory = "帅哥" | "美女" | "萌宠";

export type MaleArchetype = "肌肉男教练" | "青春男大" | "霸总" | "破碎感帅哥";
export type FemaleArchetype = "性感学姐" | "可爱学妹" | "性感女上司" | "性感主妇" | "贴心秘书";
export type PetArchetype = "熊" | "狗" | "猫" | "兔子" | "刺猬" | "熊猫" | "仓鼠";
export type CompanionArchetype = MaleArchetype | FemaleArchetype | PetArchetype;

export type GenderOption = "女" | "男" | "非二元" | "暂不说明";

export type RecordType = "体重" | "用餐" | "运动";

export type TaskCategory = "饮食" | "运动" | "情绪" | "打卡";

export type CompanionPanel = "聊天" | "调戏" | "送礼物" | "查看属性";

export interface CompanionSetup {
  category: CompanionCategory;
  archetype: CompanionArchetype;
  customName: string;
  profession: string;
  persona: string;
  personality: string;
}

export interface UserProfile {
  companion: CompanionSetup;
  currentWeight: number;
  heightInCentimeters: number;
  gender: GenderOption;
  birthDate: string;
  occupation: string;
  goal: string;
  preferences: string;
}

export interface RecordEntry {
  id: string;
  type: RecordType;
  date: string;
  title: string;
  note: string;
  score: number;
}

export interface DailyTask {
  id: string;
  title: string;
  detail: string;
  category: TaskCategory;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "companion";
  text: string;
  timestamp: string;
}

export interface CompanionStat {
  label: string;
  value: number;
}

export interface CompanionProfile {
  name: string;
  roleTitle: string;
  openingLine: string;
  metrics: CompanionStat[];
  summary: string;
  moodLine: string;
}

export interface CompanionTheme {
  id: CompanionCategory;
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  palette: {
    background: string;
    orb: string;
    orbGlow: string;
    foreground: string;
    foregroundMuted: string;
    tagBg: string;
    tagText: string;
    panelActive: string;
    panelIdle: string;
    panelIdleText: string;
    accentSoft: string;
    accentText: string;
    summaryGlow: string;
    shellCardBg: string;
    shellCardBorder: string;
    shellText: string;
    shellMutedText: string;
    stageCardBg: string;
    stageMetaText: string;
    stageBodyText: string;
    previewCardBg: string;
    previewText: string;
    previewMutedText: string;
  };
}

export interface OnboardingDraft {
  companion: CompanionSetup;
  currentWeight: string;
  heightInCentimeters: string;
  gender: GenderOption;
  birthDate: string;
  occupation: string;
  goal: string;
  preferences: string;
}

export const companionCategories: CompanionCategory[] = ["帅哥", "美女", "萌宠"];

export const companionArchetypes: Record<CompanionCategory, CompanionArchetype[]> = {
  帅哥: ["肌肉男教练", "青春男大", "霸总", "破碎感帅哥"],
  美女: ["性感学姐", "可爱学妹", "性感女上司", "性感主妇", "贴心秘书"],
  萌宠: ["熊", "狗", "猫", "兔子", "刺猬", "熊猫", "仓鼠"],
};

export const genderOptions: GenderOption[] = ["女", "男", "非二元", "暂不说明"];

export const recordTypes: RecordType[] = ["体重", "用餐", "运动"];

export const companionPanels: CompanionPanel[] = ["聊天", "调戏", "送礼物", "查看属性"];

export const companionFigureSrc: Record<CompanionCategory, string> = {
  帅哥: "/companions/male.jpeg",
  美女: "/companions/female.jpeg",
  萌宠: "/companions/pet.png",
};

export const defaultOnboardingDraft: OnboardingDraft = {
  companion: {
    category: "帅哥",
    archetype: "肌肉男教练",
    customName: "阿简",
    profession: "减脂私教",
    persona: "高执行力、会监督你按计划吃和练",
    personality: "外冷内热，关键时刻很会哄人，也会盯执行",
  },
  currentWeight: "",
  heightInCentimeters: "",
  gender: "女",
  birthDate: "2000-06-28",
  occupation: "",
  goal: "",
  preferences: "",
};

export const placeholderProfile: UserProfile = {
  companion: {
    category: "帅哥",
    archetype: "肌肉男教练",
    customName: "阿简",
    profession: "减脂私教",
    persona: "高执行力、会监督你按计划吃和练",
    personality: "外冷内热，关键时刻很会哄人，也会盯执行",
  },
  currentWeight: 62,
  heightInCentimeters: 165,
  gender: "女",
  birthDate: "2000-06-28",
  occupation: "",
  goal: "先瘦 5kg，并建立稳定生活节奏",
  preferences: "更希望温柔提醒，不喜欢太强硬。",
};

export const companionThemes: Record<CompanionCategory, CompanionTheme> = {
  帅哥: {
    id: "帅哥",
    heroLabel: "少女粉漫画系",
    heroTitle: "樱粉心动馆",
    heroDescription: "明亮少女粉底色，像清爽漫画男主陪你打卡，甜感更足但不油腻。",
    palette: {
      background: "linear-gradient(135deg, rgba(255,232,244,0.98), rgba(255,207,229,0.96) 42%, rgba(255,238,247,0.94))",
      orb: "linear-gradient(135deg, #ff8fc7, #ff6fab)",
      orbGlow: "0 30px 90px rgba(255,111,171,0.30)",
      foreground: "#5a2140",
      foregroundMuted: "rgba(90,33,64,0.72)",
      tagBg: "rgba(255,255,255,0.68)",
      tagText: "#c22572",
      panelActive: "linear-gradient(135deg, #ff8fc7, #ec5f9d)",
      panelIdle: "rgba(255,255,255,0.66)",
      panelIdleText: "#b02c6b",
      accentSoft: "rgba(255,255,255,0.62)",
      accentText: "#b02c6b",
      summaryGlow: "rgba(255,111,171,0.22)",
      shellCardBg: "rgba(255,255,255,0.54)",
      shellCardBorder: "rgba(255,255,255,0.68)",
      shellText: "#5a2140",
      shellMutedText: "rgba(90,33,64,0.66)",
      stageCardBg: "rgba(255,255,255,0.54)",
      stageMetaText: "rgba(90,33,64,0.52)",
      stageBodyText: "rgba(90,33,64,0.80)",
      previewCardBg: "rgba(255,255,255,0.58)",
      previewText: "#5a2140",
      previewMutedText: "rgba(90,33,64,0.66)",
    },
  },
  美女: {
    id: "美女",
    heroLabel: "紫晶二次元系",
    heroTitle: "紫夜次元屋",
    heroDescription: "明亮紫色底色，像番剧女主陪你完成每日计划，梦幻、轻甜、有记忆点。",
    palette: {
      background: "linear-gradient(135deg, rgba(244,232,255,0.98), rgba(220,198,255,0.96) 44%, rgba(239,220,255,0.94))",
      orb: "linear-gradient(135deg, #b084ff, #8b5cf6)",
      orbGlow: "0 30px 92px rgba(139,92,246,0.30)",
      foreground: "#3d2368",
      foregroundMuted: "rgba(61,35,104,0.72)",
      tagBg: "rgba(255,255,255,0.66)",
      tagText: "#6d3fc2",
      panelActive: "linear-gradient(135deg, #b084ff, #7c3aed)",
      panelIdle: "rgba(255,255,255,0.64)",
      panelIdleText: "#6740a8",
      accentSoft: "rgba(255,255,255,0.60)",
      accentText: "#6740a8",
      summaryGlow: "rgba(139,92,246,0.22)",
      shellCardBg: "rgba(255,255,255,0.52)",
      shellCardBorder: "rgba(255,255,255,0.66)",
      shellText: "#3d2368",
      shellMutedText: "rgba(61,35,104,0.66)",
      stageCardBg: "rgba(255,255,255,0.52)",
      stageMetaText: "rgba(61,35,104,0.52)",
      stageBodyText: "rgba(61,35,104,0.80)",
      previewCardBg: "rgba(255,255,255,0.56)",
      previewText: "#3d2368",
      previewMutedText: "rgba(61,35,104,0.66)",
    },
  },
  萌宠: {
    id: "萌宠",
    heroLabel: "暖黄治愈系",
    heroTitle: "奶黄打卡屋",
    heroDescription: "明亮黄色底色，轻松、柔软、有陪跑感，像被暖阳和小搭子一起提醒。",
    palette: {
      background: "linear-gradient(135deg, rgba(255,246,207,0.98), rgba(255,225,129,0.96) 48%, rgba(255,240,181,0.94))",
      orb: "linear-gradient(135deg, #ffd166, #f5a524)",
      orbGlow: "0 30px 90px rgba(245,165,36,0.28)",
      foreground: "#5a3b00",
      foregroundMuted: "rgba(90,59,0,0.72)",
      tagBg: "rgba(255,255,255,0.64)",
      tagText: "#b56b00",
      panelActive: "linear-gradient(135deg, #ffd166, #f5a524)",
      panelIdle: "rgba(255,255,255,0.62)",
      panelIdleText: "#96610a",
      accentSoft: "rgba(255,255,255,0.58)",
      accentText: "#96610a",
      summaryGlow: "rgba(245,165,36,0.22)",
      shellCardBg: "rgba(255,255,255,0.52)",
      shellCardBorder: "rgba(255,255,255,0.66)",
      shellText: "#5a3b00",
      shellMutedText: "rgba(90,59,0,0.66)",
      stageCardBg: "rgba(255,255,255,0.52)",
      stageMetaText: "rgba(90,59,0,0.52)",
      stageBodyText: "rgba(90,59,0,0.80)",
      previewCardBg: "rgba(255,255,255,0.56)",
      previewText: "#5a3b00",
      previewMutedText: "rgba(90,59,0,0.66)",
    },
  },
};

const femaleUserMaleCompanionTheme: CompanionTheme = {
  ...companionThemes.帅哥,
  heroLabel: "少女粉漫画系",
  heroTitle: "樱粉心动馆",
  heroDescription: "明亮少女粉底色，更像清爽漫画男主陪你打卡，甜感更足但不油腻。",
  palette: {
    ...companionThemes.帅哥.palette,
    background: "linear-gradient(135deg, rgba(255,235,246,0.98), rgba(255,204,229,0.96) 45%, rgba(255,240,249,0.94))",
    orb: "linear-gradient(135deg, #ff9ed1, #ff6faf)",
    orbGlow: "0 28px 86px rgba(255,111,175,0.26)",
  },
};

const maleUserFemaleCompanionTheme: CompanionTheme = {
  ...companionThemes.美女,
  heroLabel: "紫晶二次元陪伴系",
  heroTitle: "紫夜次元屋",
  heroDescription: "明亮紫色底色，更像番剧里的专属女主角陪你打卡，梦幻感和记忆点更强。",
  palette: {
    ...companionThemes.美女.palette,
    background: "linear-gradient(135deg, rgba(244,232,255,0.98), rgba(213,190,255,0.96) 42%, rgba(236,219,255,0.94))",
    orb: "linear-gradient(135deg, #b084ff, #8b5cf6)",
    orbGlow: "0 30px 92px rgba(139,92,246,0.30)",
  },
};

export function getCompanionTheme(category: CompanionCategory, gender?: GenderOption): CompanionTheme {
  if (gender === "女" && category === "帅哥") return femaleUserMaleCompanionTheme;
  if (gender === "男" && category === "美女") return maleUserFemaleCompanionTheme;
  return companionThemes[category];
}
