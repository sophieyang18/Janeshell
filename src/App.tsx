import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAppStore } from "@/store/use-app-store";
import ChatPage from "@/pages/ChatPage";
import NotFoundPage from "@/pages/NotFoundPage";
import OnboardingPage from "@/pages/OnboardingPage";
import PlansPage from "@/pages/PlansPage";
import RecordsPage from "@/pages/RecordsPage";
import WelcomePage from "@/pages/WelcomePage";
import WorkspacePage from "@/pages/WorkspacePage";

function RootRedirect() {
  const profile = useAppStore((state) => state.profile);
  return <Navigate to={profile ? "/workspace" : "/welcome"} replace />;
}

export default function App() {
  const bootstrapFromBackend = useAppStore((state) => state.bootstrapFromBackend);

  useEffect(() => {
    void bootstrapFromBackend();
  }, [bootstrapFromBackend]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
