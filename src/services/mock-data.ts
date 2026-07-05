import {
  type ChatMessage,
  type CompanionProfile,
  type DailyTask,
  type RecordEntry,
  type UserProfile,
} from "@/types/domain";

function isoDaysFromToday(offset: number) {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

export function createCompanionProfile(profile?: UserProfile | null): CompanionProfile {
  const companion = profile?.companion;
  const category = companion?.category ?? "帅哥";
  const archetype = companion?.archetype ?? "肌肉男教练";
  const name = companion?.customName || "阿简";
  const profession = companion?.profession || "减脂私教";

  const openingLineByCategory = {
    帅哥: `${name} 在这。先别分心，今天的饮食和训练我都给你盯着，体脂要不要顺手测一下？`,
    美女: `宝，${name}已经替你把今天的减脂节奏排好了。要先测体脂，还是先让我看看你今天吃了什么？`,
    萌宠: `${name}已经把小爪子搭在你的任务卡上啦，要先测体脂，还是先陪你把今天的记录补上？`,
  } as const;

  const moodLineByCategory = {
    帅哥: `${archetype}气质拉满，督促感和压迫感更强，适合执行驱动型用户。`,
    美女: `${archetype}风格更偏暧昧陪伴，能把情绪价值和节奏提醒揉在一起。`,
    萌宠: `${archetype}路线更偏治愈系，适合需要被轻推着坚持的人。`,
  } as const;

  return {
    name,
    roleTitle: `${category}搭子 / ${profession}`,
    openingLine: openingLineByCategory[category],
    summary: `${name} · ${archetype} · ${profession}`,
    moodLine: moodLineByCategory[category],
    metrics: [
      { label: "信任值", value: category === "帅哥" ? 88 : category === "美女" ? 84 : 91 },
      { label: "亲密度", value: category === "美女" ? 89 : category === "萌宠" ? 95 : 76 },
      { label: "活力", value: category === "萌宠" ? 96 : 90 },
      { label: "督促力", value: category === "帅哥" ? 93 : category === "美女" ? 79 : 72 },
    ],
  };
}

export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "companion",
    text: "晚上好，今天想先聊体脂、饮食，还是让我哄你坚持一下？",
    timestamp: isoDaysFromToday(0),
  },
  {
    id: "m2",
    sender: "me",
    text: "先看看我今天是不是吃多了。",
    timestamp: isoDaysFromToday(0),
  },
  {
    id: "m3",
    sender: "companion",
    text: "行，把今天三餐拍给我。我先按减脂期给你估算热量和饱腹感。",
    timestamp: isoDaysFromToday(0),
  },
];

export const mockRecords: RecordEntry[] = [
  { id: "r1", type: "体重", date: isoDaysFromToday(0), title: "晨起体重 61.4kg", note: "比昨天轻了 0.2kg，继续稳住。", score: 86 },
  { id: "r2", type: "用餐", date: isoDaysFromToday(0), title: "早餐燕麦碗", note: "蛋白质和碳水比例不错。", score: 80 },
  { id: "r3", type: "运动", date: isoDaysFromToday(-1), title: "跑步机 25 分钟", note: "心率控制得比较稳定。", score: 78 },
  { id: "r4", type: "用餐", date: isoDaysFromToday(-2), title: "午餐鸡胸肉沙拉", note: "整体偏清淡，下午注意补充能量。", score: 88 },
  { id: "r5", type: "体重", date: isoDaysFromToday(-3), title: "晨起体重 61.8kg", note: "波动正常，重点看周趋势。", score: 75 },
  { id: "r6", type: "运动", date: isoDaysFromToday(-4), title: "居家燃脂训练", note: "完成度高，动作质量不错。", score: 82 },
  { id: "r7", type: "用餐", date: isoDaysFromToday(-5), title: "晚餐火锅", note: "建议明天控制钠摄入和补水。", score: 60 },
];

export function createMockTasks(profile?: UserProfile | null): DailyTask[] {
  const nickname = profile?.companion.customName || "减肥搭子";
  const bmi = profile ? profile.currentWeight / ((profile.heightInCentimeters / 100) ** 2) : 22.5;
  const intensityHint = bmi > 24 ? "今天以稳步减脂为主，不追求极端热量缺口。" : "今天以维持节奏和稳定执行为主。";

  return [
    {
      id: "t1",
      title: "早餐拍照打卡",
      detail: `上传早餐照片，${nickname} 会给你一个轻量点评。`,
      category: "饮食",
      isCompleted: false,
    },
    {
      id: "t2",
      title: "午后快走 35 分钟",
      detail: intensityHint,
      category: "运动",
      isCompleted: false,
    },
    {
      id: "t3",
      title: "晚间情绪复盘",
      detail: "用一句话记录今天最想暴食的时刻和原因。",
      category: "情绪",
      isCompleted: false,
    },
    {
      id: "t4",
      title: "睡前体重/围度登记",
      detail: "完成今日记录后自动形成减肥日历。",
      category: "打卡",
      isCompleted: false,
    },
  ];
}

export function replyToMessage(input: string): ChatMessage {
  let text = "我收到啦。你继续说，我会结合你的历史记录给你更个性化的建议。";

  if (input.includes("体脂")) {
    text = "可以，等你上传照片或基础数据后，我先给你一个体脂预测区间，再解释为什么会这样。";
  } else if (input.includes("饿") || input.includes("想吃")) {
    text = "先别急着硬扛。你先喝点温水，我给你排一个 10 分钟的替代方案，再看这波饥饿是不是情绪性的。";
  }

  return {
    id: crypto.randomUUID(),
    sender: "companion",
    text,
    timestamp: new Date().toISOString(),
  };
}
