import { Navigate } from "react-router-dom";

import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { useAppStore } from "@/store/use-app-store";

export default function OnboardingPage() {
  const profile = useAppStore((state) => state.profile);

  if (profile) {
    return <Navigate to="/workspace" replace />;
  }

  return <OnboardingForm />;
}
