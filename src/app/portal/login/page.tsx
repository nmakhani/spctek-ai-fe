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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      router.push("/portal");
    } catch (err: any) {
      const message = err.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 page-fade">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-dark-50">
              SPCTEK Admin
            </h1>
            <p className="text-dark-300 mt-2">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-300/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-dark-200 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-500/50 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-sky-400 transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-500/50 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-sky-400 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-950 font-semibold transition-colors mt-8"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-sky-500/10 border border-sky-300/20">
            <p className="text-sm text-dark-300">
              <span className="text-sky-300 font-medium">
                Demo credentials:
              </span>
              <br />
              Use the credentials provided by your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
