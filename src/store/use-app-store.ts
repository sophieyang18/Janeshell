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
import { createCompanionProfile, createMockTasks, mockMessages, mockRecords, replyToMessage } from "@/services/mock-data";

type AppStore = {
  profile: UserProfile | null;
  companionProfile: CompanionProfile;
  records: RecordEntry[];
  tasks: DailyTask[];
  messages: ChatMessage[];
  selectedPanel: CompanionPanel;
  onboardingDraft: OnboardingDraft;
  completeOnboarding: (profile: UserProfile) => void;
  skipOnboarding: () => void;
  resetProfile: () => void;
  updateOnboardingDraft: (patch: Partial<OnboardingDraft>) => void;
  selectPanel: (panel: CompanionPanel) => void;
  sendMessage: (text: string) => void;
  toggleTask: (taskId: string) => void;
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
      profile: null,
      companionProfile: createCompanionProfile(null),
      records: mockRecords,
      tasks: initialTasks,
      messages: mockMessages,
      selectedPanel: companionPanels[0],
      onboardingDraft: defaultOnboardingDraft,
      completeOnboarding: (profile) =>
        set({
          profile,
          companionProfile: createCompanionProfile(profile),
          tasks: createMockTasks(profile),
        }),
      skipOnboarding: () =>
        set({
          profile: placeholderProfile,
          companionProfile: createCompanionProfile(placeholderProfile),
          tasks: createMockTasks(placeholderProfile),
        }),
      resetProfile: () =>
        set((state) => ({
          profile: null,
          companionProfile: createCompanionProfile(null),
          tasks: initialTasks,
          onboardingDraft: state.profile ? draftFromProfile(state.profile) : defaultOnboardingDraft,
        })),
      updateOnboardingDraft: (patch) =>
        set((state) => ({
          onboardingDraft: {
            ...state.onboardingDraft,
            ...patch,
          },
        })),
      selectPanel: (panel) => set({ selectedPanel: panel }),
      sendMessage: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const nextMessages: ChatMessage[] = [
          ...get().messages,
          {
            id: crypto.randomUUID(),
            sender: "me",
            text: trimmed,
            timestamp: new Date().toISOString(),
          },
          replyToMessage(trimmed),
        ];

        set({ messages: nextMessages });
      },
      toggleTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
          ),
        })),
    }),
    {
      name: "jianbei.web.uiState",
      storage: safeStorage,
      partialize: (state) => ({
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
