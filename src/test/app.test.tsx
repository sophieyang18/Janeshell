import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "@/App";
import { useAppStore } from "@/store/use-app-store";
import { placeholderProfile } from "@/types/domain";

describe("简贝 Web 应用", () => {
  beforeEach(() => {
    globalThis.localStorage?.clear?.();
    useAppStore.setState({
      profile: null,
      onboardingDraft: {
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
      },
    });
  });

  it("未建档时会进入建档页", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByText("开始建档")).toBeInTheDocument();
  });

  it("已建档时能看到横版工作台", () => {
    useAppStore.setState({ profile: placeholderProfile });
    window.history.pushState({}, "", "/workspace");

    render(<App />);

    expect(screen.getByText("简贝横版工作台")).toBeInTheDocument();
    expect(screen.getByText("阿简")).toBeInTheDocument();
  });
});
