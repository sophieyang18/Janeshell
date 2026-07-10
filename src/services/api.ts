import {
  type ChatMessage,
  type CompanionProfile,
  type CompanionSetup,
  type DailyTask,
  type RecordEntry,
  type UserProfile,
} from "@/types/domain";

const API_BASE_URL = (import.meta.env.VITE_JANESHELL_API_BASE_URL ?? "").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 30000;

export type BackendStatus = "idle" | "connected" | "offline";

export interface WebBootstrapResponse {
  userId: string;
  chatSessionId: string;
  profile: UserProfile;
  companionProfile: CompanionProfile;
  records: RecordEntry[];
  tasks: DailyTask[];
  messages: ChatMessage[];
  selectedPanel: string;
}

export interface WebSendMessageResponse {
  chatSessionId: string;
  userMessage: ChatMessage;
  companionReply: ChatMessage;
  messages: ChatMessage[];
  contextSummary: string;
}

export interface BackendCompanionAttributes {
  age: number;
  personality: string;
  weight_kg: number;
  height_cm: number;
  emotion: string;
  intimacy: number;
  discipline: number;
  trust: number;
  mood_line: string;
}

export interface BackendInteractionResponse {
  id: string;
  action: string;
  result_line: string;
  attributes: BackendCompanionAttributes;
}

export interface BackendGiftResponse {
  id: string;
  gift_name: string;
  is_paid: boolean;
  amount_cents: number;
  currency: string;
  status: "succeeded" | "payment_required";
  result_line: string;
  attributes: BackendCompanionAttributes;
}

export interface CalorieDetectionResult {
  detected_foods: string[];
  total_calories_kcal: number;
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  confidence: number;
  provider: string;
  explain: string;
}

interface BackendDailyPlan {
  tasks: Array<{
    id: string;
    title: string;
    detail: string;
    task_type: "food" | "exercise" | "record" | "emotion";
    is_completed: boolean;
  }>;
}

export interface QuickRecordDraft {
  date: string;
  value: string;
  secondaryValue: string;
  note: string;
}

export const apiClient = {
  async health() {
    return request<unknown>("/health");
  },

  async createDefaultProfile() {
    return request<WebBootstrapResponse>("/api/v1/web/profile/default", { method: "POST" });
  },

  async createProfile(profile: UserProfile) {
    const created = await request<{ id: string }>("/api/v1/profile", {
      method: "POST",
      body: JSON.stringify(toBackendProfile(profile)),
    });
    return this.bootstrap(created.id);
  },

  async bootstrap(userId: string) {
    return request<WebBootstrapResponse>(`/api/v1/web/users/${encodeURIComponent(userId)}/bootstrap`);
  },

  async sendMessage(userId: string, text: string, sessionId?: string | null) {
    return request<WebSendMessageResponse>(`/api/v1/web/users/${encodeURIComponent(userId)}/chat/messages`, {
      method: "POST",
      body: JSON.stringify({ text, sessionId }),
    });
  },

  async toggleTask(userId: string, taskId: string, isCompleted: boolean) {
    const plan = await request<BackendDailyPlan>(
      `/api/v1/users/${encodeURIComponent(userId)}/plans/tasks/${encodeURIComponent(taskId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ is_completed: isCompleted }),
      },
    );
    return plan.tasks.map(fromBackendTask);
  },

  async interact(userId: string, action: string) {
    return request<BackendInteractionResponse>(
      `/api/v1/users/${encodeURIComponent(userId)}/companion/interactions?action=${encodeURIComponent(action)}`,
      { method: "POST" },
    );
  },

  async sendGift(userId: string, giftName: string) {
    return request<BackendGiftResponse>(`/api/v1/users/${encodeURIComponent(userId)}/companion/gifts`, {
      method: "POST",
      body: JSON.stringify({ gift_name: toBackendGiftName(giftName) }),
    });
  },

  async createCall(userId: string, callType: "voice" | "video") {
    return request<{ id: string; status: "initiating" | "connected" | "ended" | "failed"; call_type: string }>(
      `/api/v1/users/${encodeURIComponent(userId)}/chat/calls`,
      {
        method: "POST",
        body: JSON.stringify({ call_type: callType }),
      },
    );
  },

  async detectCalories(userId: string, imageBase64: string, description: string) {
    return request<CalorieDetectionResult>(`/api/v1/users/${encodeURIComponent(userId)}/detections/calories`, {
      method: "POST",
      body: JSON.stringify({
        image_base64: imageBase64,
        description,
      }),
    });
  },

  async createQuickRecord(
    userId: string,
    type: RecordEntry["type"],
    mode: string,
    draft: QuickRecordDraft,
    profile: UserProfile | null,
  ) {
    const source = mode === "手动录入" ? "manual" : "photo";
    const value = draft.value.trim();
    const secondaryValue = draft.secondaryValue.trim();
    const note = draft.note.trim();

    return request<unknown>(`/api/v1/users/${encodeURIComponent(userId)}/records/quick`, {
      method: "POST",
      body: JSON.stringify({
        record_type: type,
        date: draft.date || new Date().toISOString().slice(0, 10),
        mode,
        value: value || getDefaultQuickRecordValue(type, profile),
        secondary_value: secondaryValue,
        note,
        source,
      }),
    });
  },
};

function getDefaultQuickRecordValue(type: RecordEntry["type"], profile: UserProfile | null) {
  if (type === "体重") return String(profile?.currentWeight || 62);
  if (type === "用餐") return "用餐记录";
  if (type === "运动") return "快走";
  return "500";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function toBackendProfile(profile: UserProfile) {
  return {
    companion: {
      category: profile.companion.category,
      archetype: profile.companion.archetype,
      custom_name: profile.companion.customName,
      profession: profile.companion.profession,
      persona: profile.companion.persona,
      personality: profile.companion.personality,
    } satisfies Omit<CompanionSetup, "customName"> & { custom_name: string },
    current_weight_kg: profile.currentWeight,
    height_cm: profile.heightInCentimeters,
    gender: profile.gender,
    birth_date: profile.birthDate,
    occupation: profile.occupation,
    weight_loss_goal: profile.goal,
    preferences: profile.preferences,
  };
}

function fromBackendTask(task: BackendDailyPlan["tasks"][number]): DailyTask {
  const categoryMap = {
    food: "饮食",
    exercise: "运动",
    record: "打卡",
    emotion: "情绪",
  } as const;

  return {
    id: task.id,
    title: task.title,
    detail: task.detail,
    category: categoryMap[task.task_type],
    isCompleted: task.is_completed,
  };
}

function toBackendGiftName(giftName: string) {
  if (giftName === "鲜花") return "一只鲜花";
  if (giftName === "小蛋糕") return "一个小蛋糕";
  return giftName;
}
