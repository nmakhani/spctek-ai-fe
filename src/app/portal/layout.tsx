import type { Metadata } from "next";
import ToastProvider from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "SPCTEK Admin Portal",
  description: "Dark glassmorphic dashboard for blogs and contacts",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="ambient-orb one" />
      <div className="ambient-orb two" />
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </>
  );
}
