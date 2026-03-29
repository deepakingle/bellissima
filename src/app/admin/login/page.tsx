"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Invalid username or password.");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase text-neutral-600">
            Admin
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
            Sign in to manage catalog
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Use your admin username and password. In production, set{" "}
            <span className="font-mono bg-white/60 border border-neutral-200/70 px-2 py-0.5 rounded">
              ADMIN_USERNAME
            </span>{" "}
            and{" "}
            <span className="font-mono bg-white/60 border border-neutral-200/70 px-2 py-0.5 rounded">
              ADMIN_PASSWORD
            </span>{" "}
            in the environment to override defaults.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
              required
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2"
            >
              {error}
            </p>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm sm:text-base font-semibold text-neutral-900 hover:shadow-sm transition-shadow disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
