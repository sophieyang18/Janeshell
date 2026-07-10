import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAppStore } from "@/store/use-app-store";

const copy = {
  zh: {
    lang: "中",
    switchTo: "EN",
    title: "简贝帮你定制一个最懂你的专属AI减肥搭子！",
    subtitle: "想减肥？一个简贝就够了！",
    cta: "开始定制搭子",
  },
  en: {
    lang: "EN",
    switchTo: "中",
    title: "Jianbei customizes an AI weight-loss companion who truly gets you.",
    subtitle: "Want to lose weight? Jianbei is enough.",
    cta: "Start Customizing",
  },
};

export default function WelcomePage() {
  const profile = useAppStore((state) => state.profile);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const current = copy[language];

  if (profile) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <div className="grid h-[100dvh] overflow-hidden bg-[linear-gradient(135deg,#ffc9e6,#b7ddff_48%,#d6ccff)] px-6 py-5 text-blue-950">
      <main className="mx-auto grid h-full w-full max-w-4xl grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className="rounded-full border border-white/70 bg-white/55 px-4 py-2 text-sm font-black text-blue-800 shadow-sm backdrop-blur transition hover:border-blue-900 hover:text-blue-950"
          >
            {current.switchTo}
          </button>
        </div>

        <section className="grid place-items-center text-center">
          <div>
            <h1 className="text-[clamp(38px,5.2vw,68px)] font-black leading-[1.08] tracking-[-0.05em]">
              {current.title}
            </h1>
            <p className="mt-6 text-[clamp(24px,3vw,36px)] font-black tracking-[-0.03em] text-blue-900/78">
              {current.subtitle}
            </p>
            <Link
              to="/onboarding"
              className="mt-10 inline-flex rounded-full bg-[linear-gradient(135deg,#ff7abd,#68b4ff)] px-8 py-4 text-base font-black text-white shadow-[0_22px_55px_rgba(117,186,255,0.30)] transition hover:-translate-y-0.5"
            >
              {current.cta}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
