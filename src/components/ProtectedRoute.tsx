"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-dark-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login
    router.push("/portal/login");
    return null;
  }

  if (requireAdmin && !isAdmin) {
    // Not an admin, redirect to login
    router.push("/portal/login");
    return null;
  }

  return <>{children}</>;
}
