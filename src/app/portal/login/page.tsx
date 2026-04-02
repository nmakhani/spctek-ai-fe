"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (err: unknown, fallback: string): string =>
    err instanceof Error ? err.message : fallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      router.push("/portal");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Login failed");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 page-fade">
      <div className="w-full max-w-lg">
        <div className="glass rounded-[32px] p-8 md:p-10 border border-white/15">
          <div className="mb-9">
            <h1 className="font-heading text-4xl font-bold text-dark-50 tracking-tight">
              SPCTEK Admin
            </h1>
            <p className="text-dark-300 mt-2 text-lg">
              Sign in to your admin account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-300/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-base font-semibold text-dark-200 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl glass-soft text-dark-50 placeholder:text-dark-400 ring-focus transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-semibold text-dark-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl glass-soft text-dark-50 placeholder:text-dark-400 ring-focus transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-6 py-3.5 rounded-2xl bg-[#606bfa] hover:bg-[#505cf4] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
