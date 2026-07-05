import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  companionPanels,
  defaultOnboardingDraft,
  placeholderProfile,
  type ChatMessage,
  type CompanionPanel,
  type DailyTask,
  type OnboardingDraft,
  type RecordEntry,
  type CompanionProfile,
  type UserProfile,
} from "@/types/domain";
import { apiClient, type BackendCompanionAttributes, type BackendStatus, type WebBootstrapResponse } from "@/services/api";
import { createCompanionProfile, createMockTasks, mockMessages, mockRecords } from "@/services/mock-data";

type AppStore = {
  userId: string | null;
  chatSessionId: string | null;
  backendStatus: BackendStatus;
  profile: UserProfile | null;
  companionProfile: CompanionProfile;
  records: RecordEntry[];
  tasks: DailyTask[];
  messages: ChatMessage[];
  selectedPanel: CompanionPanel;
  onboardingDraft: OnboardingDraft;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  resetProfile: () => void;
  bootstrapFromBackend: () => Promise<void>;
  updateOnboardingDraft: (patch: Partial<OnboardingDraft>) => void;
  selectPanel: (panel: CompanionPanel) => void;
  sendMessage: (text: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  interactWithCompanion: (action: string) => Promise<string>;
  sendGiftToCompanion: (giftName: string) => Promise<string>;
  createQuickRecord: (type: RecordEntry["type"], mode: string, value: string) => Promise<string>;
};

const initialTasks = createMockTasks(null);
const memoryStorage = new Map<string, string>();

const safeStorage = createJSONStorage(() => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  return {
    getItem: (name: string) => memoryStorage.get(name) ?? null,
    setItem: (name: string, value: string) => {
      memoryStorage.set(name, value);
    },
    removeItem: (name: string) => {
      memoryStorage.delete(name);
    },
  };
});

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      userId: null,
      chatSessionId: null,
      backendStatus: "idle",
      profile: null,
      companionProfile: createCompanionProfile(null),
      records: mockRecords,
      tasks: initialTasks,
      messages: mockMessages,
      selectedPanel: companionPanels[0],
      onboardingDraft: defaultOnboardingDraft,
      completeOnboarding: async (profile) => {
        try {
          applyBootstrap(set, await apiClient.createProfile(profile));
        } catch {
          set({
            userId: null,
            chatSessionId: null,
            backendStatus: "offline",
            profile,
            companionProfile: createCompanionProfile(profile),
            tasks: createMockTasks(profile),
          });
        }
      },
      skipOnboarding: async () => {
        try {
          applyBootstrap(set, await apiClient.createDefaultProfile());
        } catch {
          set({
            userId: null,
            chatSessionId: null,
            backendStatus: "offline",
            profile: placeholderProfile,
            companionProfile: createCompanionProfile(placeholderProfile),
            tasks: createMockTasks(placeholderProfile),
          });
        }
      },
      resetProfile: () =>
        set((state) => ({
          userId: null,
          chatSessionId: null,
          profile: null,
          companionProfile: createCompanionProfile(null),
          tasks: initialTasks,
          onboardingDraft: state.profile ? draftFromProfile(state.profile) : defaultOnboardingDraft,
        })),
      bootstrapFromBackend: async () => {
        const userId = get().userId;
        if (!userId) return;

        try {
          applyBootstrap(set, await apiClient.bootstrap(userId));
        } catch {
          set({ backendStatus: "offline" });
        }
      },
      updateOnboardingDraft: (patch) =>
        set((state) => ({
          onboardingDraft: {
            ...state.onboardingDraft,
            ...patch,
          },
        })),
      selectPanel: (panel) => set({ selectedPanel: panel }),
      sendMessage: async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const optimisticUserMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: "me",
          text: trimmed,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, optimisticUserMessage],
        }));

        try {
          let state = get();
          if (!state.userId) {
            const bootstrap = state.profile
              ? await apiClient.createProfile(state.profile)
              : await apiClient.createDefaultProfile();
            applyBootstrap(set, bootstrap);
            state = get();
            set((currentState) => ({
              messages: [...currentState.messages, optimisticUserMessage],
            }));
          }

          if (!state.userId) {
            throw new Error("missing backend user id");
          }

          const result = await apiClient.sendMessage(state.userId, trimmed, state.chatSessionId);
          set({
            chatSessionId: result.chatSessionId,
            messages: result.messages,
            backendStatus: "connected",
          });
        } catch {
          set({ backendStatus: "offline" });
          const failureMessages: ChatMessage[] = [
            ...get().messages,
            {
              id: crypto.randomUUID(),
              sender: "companion",
              text: "后端 agent 暂时没有连上。我先保留你的消息，等服务恢复后再继续联调。",
              timestamp: new Date().toISOString(),
            },
          ];
          set({ messages: failureMessages });
        }
      },
      toggleTask: async (taskId) => {
        const state = get();
        const target = state.tasks.find((task) => task.id === taskId);
        if (!target) return;

        set({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
          ),
        });

        if (!state.userId) return;

        try {
          const tasks = await apiClient.toggleTask(state.userId, taskId, !target.isCompleted);
          set({ tasks, backendStatus: "connected" });
        } catch {
          set({ backendStatus: "offline" });
        }
      },
      interactWithCompanion: async (action) => {
        const userId = get().userId;
        if (!userId) return `${action}反馈 +2`;

        try {
          const result = await apiClient.interact(userId, action);
          set((state) => ({
            backendStatus: "connected",
            companionProfile: withAttributes(state.companionProfile, result.attributes),
          }));
          return result.result_line;
        } catch {
          set({ backendStatus: "offline" });
          return `${action}反馈 +2`;
        }
      },
      sendGiftToCompanion: async (giftName) => {
        const userId = get().userId;
        if (!userId) return `已送出 ${giftName}`;

        try {
          const result = await apiClient.sendGift(userId, giftName);
          set((state) => ({
            backendStatus: "connected",
            companionProfile: withAttributes(state.companionProfile, result.attributes),
          }));
          return result.status === "succeeded" ? result.result_line : `付费礼物「${giftName}」需要 mock 支付确认`;
        } catch {
          set({ backendStatus: "offline" });
          return `已送出 ${giftName}`;
        }
      },
      createQuickRecord: async (type, mode, value) => {
        const state = get();
        const title = value.trim() || defaultRecordTitle(type);
        const localRecord: RecordEntry = {
          id: crypto.randomUUID(),
          type,
          date: new Date().toISOString(),
          title,
          note: `${mode}记录已保存。`,
          score: 82,
        };

        set({ records: [localRecord, ...state.records] });

        if (!state.userId) return `${type}记录已保存到本地。`;

        try {
          await apiClient.createQuickRecord(state.userId, type, mode, value, state.profile);
          applyBootstrap(set, await apiClient.bootstrap(state.userId));
          return `${type}记录已写入后端。`;
        } catch {
          set({ backendStatus: "offline" });
          return `${type}记录已本地保存，后端暂时不可用。`;
        }
      },
    }),
    {
      name: "jianbei.web.uiState",
      storage: safeStorage,
      partialize: (state) => ({
        userId: state.userId,
        chatSessionId: state.chatSessionId,
        profile: state.profile,
        companionProfile: state.companionProfile,
        records: state.records,
        tasks: state.tasks,
        messages: state.messages,
        selectedPanel: state.selectedPanel,
        onboardingDraft: state.onboardingDraft,
      }),
    },
  ),
);

function applyBootstrap(
  set: (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>)) => void,
  bootstrap: WebBootstrapResponse,
) {
  set({
    userId: bootstrap.userId,
    chatSessionId: bootstrap.chatSessionId,
    backendStatus: "connected",
    profile: bootstrap.profile,
    companionProfile: bootstrap.companionProfile,
    records: bootstrap.records,
    tasks: bootstrap.tasks,
    messages: bootstrap.messages,
    selectedPanel: companionPanels.includes(bootstrap.selectedPanel as CompanionPanel)
      ? (bootstrap.selectedPanel as CompanionPanel)
      : "聊天",
  });
}

function withAttributes(companionProfile: CompanionProfile, attributes: BackendCompanionAttributes): CompanionProfile {
  return {
    ...companionProfile,
    moodLine: attributes.mood_line || companionProfile.moodLine,
    metrics: [
      { label: "信任值", value: attributes.trust },
      { label: "亲密度", value: attributes.intimacy },
      { label: "活力", value: attributes.emotion === "happy" || attributes.emotion === "playful" ? 96 : 90 },
      { label: "督促力", value: attributes.discipline },
    ],
  };
}

function defaultRecordTitle(type: RecordEntry["type"]) {
  if (type === "体重") return "今日体重记录";
  if (type === "用餐") return "今日用餐记录";
  return "今日运动记录";
}

function draftFromProfile(profile: UserProfile): OnboardingDraft {
  return {
    companion: profile.companion,
    currentWeight: String(profile.currentWeight),
    heightInCentimeters: String(profile.heightInCentimeters),
    gender: profile.gender,
    birthDate: profile.birthDate,
    occupation: profile.occupation,
    goal: profile.goal,
    preferences: profile.preferences,
  };
}

export function buildProfileFromDraft(draft: OnboardingDraft): UserProfile | null {
  const currentWeight = Number(draft.currentWeight);
  const heightInCentimeters = Number(draft.heightInCentimeters);

  if (!currentWeight || !heightInCentimeters) {
    return null;
  }

  return {
    companion: draft.companion,
    currentWeight,
    heightInCentimeters,
    gender: draft.gender,
    birthDate: draft.birthDate,
    occupation: draft.occupation.trim(),
    goal: draft.goal.trim(),
    preferences: draft.preferences.trim(),
  };
}
