export type MainView = "workspace" | "chat" | "records" | "plans";

export type CompanionCategory = "帅哥" | "美女" | "萌宠";

export type MaleArchetype = "明星" | "暖心同事" | "破碎感帅哥" | "篮球队队长" | "肌肉男教练" | "贤夫良父" | "酷帅学长" | "青春男大" | "黑涩会老大";
export type FemaleArchetype = "学妹" | "性感学姐" | "性感秘书" | "虚拟idol" | "贤妻良母";
export type PetArchetype = "仓鼠" | "兔子" | "小狗" | "小猫" | "熊" | "熊猫";
export type CompanionArchetype = MaleArchetype | FemaleArchetype | PetArchetype;

export type GenderOption = "女" | "男" | "非二元" | "暂不说明";

export type RecordType = "体重" | "用餐" | "运动" | "经期" | "排便" | "饮水";

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
  帅哥: ["明星", "暖心同事", "破碎感帅哥", "篮球队队长", "肌肉男教练", "贤夫良父", "酷帅学长", "青春男大", "黑涩会老大"],
  美女: ["学妹", "性感学姐", "性感秘书", "虚拟idol", "贤妻良母"],
  萌宠: ["仓鼠", "兔子", "小狗", "小猫", "熊", "熊猫"],
};

export function getSafeCompanionArchetype(category: CompanionCategory, archetype?: string | null): CompanionArchetype {
  const options = companionArchetypes[category];
  const matched = options.find((option) => option === archetype);

  return matched ?? options[0];
}

export const genderOptions: GenderOption[] = ["女", "男", "非二元", "暂不说明"];

export const recordTypes: RecordType[] = ["体重", "用餐", "运动", "饮水"];

export const companionPanels: CompanionPanel[] = ["聊天", "调戏", "送礼物", "查看属性"];

export const companionFigureSrc: Record<CompanionCategory, string> = {
  帅哥: "/companions/male.jpeg",
  美女: "/companions/female.jpeg",
  萌宠: "/companions/pet.png",
};

export const companionArchetypeFigureSrc: Record<CompanionArchetype, string> = {
  明星: "/companions/archetypes/male/明星/cover.jpeg",
  暖心同事: "/companions/archetypes/male/暖心同事/cover.jpg",
  破碎感帅哥: "/companions/archetypes/male/破碎感帅哥/cover.jpg",
  篮球队队长: "/companions/archetypes/male/篮球队队长/cover.jpg",
  肌肉男教练: "/companions/archetypes/male/肌肉男教练/cover.jpg",
  贤夫良父: "/companions/archetypes/male/贤夫良父/cover.jpg",
  酷帅学长: "/companions/archetypes/male/酷帅学长/cover.jpg",
  青春男大: "/companions/archetypes/male/青春男大/cover.jpg",
  黑涩会老大: "/companions/archetypes/male/黑涩会老大/cover.jpg",
  学妹: "/companions/archetypes/female/学妹/cover.jpeg",
  性感学姐: "/companions/archetypes/female/性感学姐/cover.jpg",
  性感秘书: "/companions/archetypes/female/性感秘书/cover.jpg",
  虚拟idol: "/companions/archetypes/female/虚拟idol/cover.jpg",
  贤妻良母: "/companions/archetypes/female/贤妻良母/cover.jpg",
  仓鼠: "/companions/archetypes/pet/仓鼠/cover.png",
  兔子: "/companions/archetypes/pet/兔子/cover.png",
  小狗: "/companions/archetypes/pet/小狗/cover.png",
  小猫: "/companions/archetypes/pet/小猫/cover.png",
  熊: "/companions/archetypes/pet/熊/cover.png",
  熊猫: "/companions/archetypes/pet/熊猫/cover.png",
};

export function getCompanionFigureSrc(companion?: Pick<CompanionSetup, "category" | "archetype"> | null) {
  if (!companion) return companionFigureSrc.帅哥;

  const archetype = getSafeCompanionArchetype(companion.category, companion.archetype);

  return companionArchetypeFigureSrc[archetype] ?? companionFigureSrc[companion.category];
}

export const companionSceneSrc: Record<CompanionCategory, string> = {
  帅哥: "/companions/scenes/with_bg_1/male/男明星.png",
  美女: "/companions/scenes/with_bg_1/female/idol.png",
  萌宠: "/companions/scenes/with_bg_1/pet/小狗.png",
};

export const companionArchetypeSceneSrc: Partial<Record<CompanionArchetype, string>> = {
  明星: "/companions/scenes/with_bg_1/male/男明星.png",
  暖心同事: "/companions/scenes/with_bg_1/male/暖心同事.png",
  破碎感帅哥: "/companions/scenes/with_bg_1/male/破碎文艺男.png",
  篮球队队长: "/companions/scenes/with_bg_1/male/篮球队队长.png",
  肌肉男教练: "/companions/scenes/with_bg_1/male/健身教练.png",
  贤夫良父: "/companions/scenes/with_bg_1/male/贤夫良夫.png",
  酷帅学长: "/companions/scenes/with_bg_1/male/酷帅学长.png",
  青春男大: "/companions/scenes/with_bg_1/male/青春男大.png",
  黑涩会老大: "/companions/scenes/with_bg_1/male/霸道总裁.png",
  学妹: "/companions/scenes/with_bg_1/female/青春学妹.png",
  性感学姐: "/companions/scenes/with_bg_1/female/性感学姐.png",
  性感秘书: "/companions/scenes/with_bg_1/female/性感秘书.png",
  虚拟idol: "/companions/scenes/with_bg_1/female/idol.png",
  贤妻良母: "/companions/scenes/with_bg_1/female/贤妻良母.png",
  兔子: "/companions/scenes/with_bg_1/pet/兔子.png",
  小狗: "/companions/scenes/with_bg_1/pet/小狗.png",
  小猫: "/companions/scenes/with_bg_1/pet/小猫.png",
  熊猫: "/companions/scenes/with_bg_1/pet/熊猫.png",
};

export function getCompanionSceneSrc(companion?: Pick<CompanionSetup, "category" | "archetype"> | null) {
  if (!companion) return companionSceneSrc.帅哥;

  const archetype = getSafeCompanionArchetype(companion.category, companion.archetype);

  return companionArchetypeSceneSrc[archetype] ?? companionSceneSrc[companion.category];
}

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

const pinkBluePalette: CompanionTheme["palette"] = {
  background:
    "linear-gradient(135deg, rgba(255,201,230,0.98), rgba(183,221,255,0.98) 48%, rgba(214,204,255,0.96))",
  orb: "linear-gradient(135deg, #ff86c5, #75baff)",
  orbGlow: "0 30px 94px rgba(117,186,255,0.32)",
  foreground: "#172554",
  foregroundMuted: "rgba(23,37,84,0.72)",
  tagBg: "rgba(255,255,255,0.62)",
  tagText: "#2563eb",
  panelActive: "linear-gradient(135deg, #ff7abd, #68b4ff)",
  panelIdle: "rgba(255,255,255,0.68)",
  panelIdleText: "#315fba",
  accentSoft: "rgba(255,255,255,0.64)",
  accentText: "#315fba",
  summaryGlow: "rgba(117,186,255,0.28)",
  shellCardBg: "rgba(255,255,255,0.58)",
  shellCardBorder: "rgba(255,255,255,0.72)",
  shellText: "#172554",
  shellMutedText: "rgba(23,37,84,0.66)",
  stageCardBg: "rgba(255,255,255,0.56)",
  stageMetaText: "rgba(23,37,84,0.54)",
  stageBodyText: "rgba(23,37,84,0.82)",
  previewCardBg: "rgba(255,255,255,0.62)",
  previewText: "#172554",
  previewMutedText: "rgba(23,37,84,0.66)",
};

export const companionThemes: Record<CompanionCategory, CompanionTheme> = {
  帅哥: {
    id: "帅哥",
    heroLabel: "粉蓝渐变陪伴系",
    heroTitle: "粉蓝搭子空间",
    heroDescription: "柔和粉蓝渐变底色，清爽、轻盈、适合专注搭子和记录本身。",
    palette: pinkBluePalette,
  },
  美女: {
    id: "美女",
    heroLabel: "粉蓝渐变陪伴系",
    heroTitle: "粉蓝搭子空间",
    heroDescription: "柔和粉蓝渐变底色，清爽、轻盈、适合专注搭子和记录本身。",
    palette: pinkBluePalette,
  },
  萌宠: {
    id: "萌宠",
    heroLabel: "粉蓝渐变陪伴系",
    heroTitle: "粉蓝搭子空间",
    heroDescription: "柔和粉蓝渐变底色，清爽、轻盈、适合专注搭子和记录本身。",
    palette: pinkBluePalette,
  },
};

export function getCompanionTheme(category: CompanionCategory, _gender?: GenderOption): CompanionTheme {
  return companionThemes[category];
}
