"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/portal/login");
  };

  return (
    <div className="min-h-screen page-fade">
      <header className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sky-300 font-medium tracking-wide text-sm uppercase">
                SPCTEK Control Room
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-dark-50 mt-2">
                Admin Dashboard
              </h1>
              <p className="text-dark-300 mt-3 text-base md:text-lg max-w-2xl">
                Manage contacts and blogs through a clean, fast, high-contrast
                workspace designed for daily operations.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-dark-300 text-sm">Logged in as</p>
                <p className="text-sky-300 font-medium">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <Link href="/portal/contacts" className="group">
            <div className="glass glass-hover rounded-3xl p-8 h-full">
              <div className="w-12 h-12 rounded-2xl bg-sky-400/20 border border-sky-300/30 flex items-center justify-center text-2xl mb-5">
                📋
              </div>
              <h2 className="text-2xl font-bold text-dark-50 mb-2">Contacts</h2>
              <p className="text-dark-300">
                Review incoming inquiries, edit details, and keep communication
                records organized.
              </p>
              <div className="mt-7 inline-flex items-center gap-2 text-sky-300 font-medium">
                Open Contacts
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/portal/blogs" className="group">
            <div className="glass glass-hover rounded-3xl p-8 h-full">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center text-2xl mb-5">
                📝
              </div>
              <h2 className="text-2xl font-bold text-dark-50 mb-2">Blogs</h2>
              <p className="text-dark-300">
                Publish polished articles with full schema controls including
                slug, summary, and publication status.
              </p>
              <div className="mt-7 inline-flex items-center gap-2 text-cyan-300 font-medium">
                Open Blogs
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
