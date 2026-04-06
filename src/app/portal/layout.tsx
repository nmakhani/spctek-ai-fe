"use client";

import ToastProvider from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlowBackground } from "@/components/portal/GlowBackground";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate overflow-x-hidden">
      <GlowBackground />
      <AuthProvider>
        <ToastProvider />
        <div className="relative z-10">{children}</div>
      </AuthProvider>
    </div>
  );
}
