import { Navigate } from "react-router-dom";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { useAppStore } from "@/store/use-app-store";

export default function PlansPage() {
  const profile = useAppStore((state) => state.profile);

  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return <WorkspaceShell view="plans" />;
}
