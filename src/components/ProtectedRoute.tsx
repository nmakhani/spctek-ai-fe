"use client";

import { ReactNode, useEffect } from "react";
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

  const shouldRedirect = !loading && (!user || (requireAdmin && !isAdmin));

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/portal/login");
    }
  }, [shouldRedirect, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-dark-300">Loading...</div>
      </div>
    );
  }

  if (shouldRedirect) {
    return null;
  }

  return <>{children}</>;
}
