"use client";

import { useState } from "react";
import { useT } from "@/i18n";

export default function LoginForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.error || t("login.error"));
        setLoading(false);
        return;
      }
      // Success: reload so server shows the logged-in panel
      window.location.href = "/login";
    } catch {
      setErr(t("login.error"));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-sm rounded-2xl bg-white p-6 shadow">
      <h1 className="mb-6 text-center text-2xl font-semibold">
        {t("login.title")}
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            {t("login.email")}
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            {t("login.password")}
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          />
        </div>

        {err && (
          <p className="text-sm text-red-600" role="alert">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "…" : t("login.submit")}
        </button>
      </form>

      <div className="mt-4 text-center">
        <a href="/forgot" className="text-sm text-gray-600 underline">
          {t("login.forgot")}
        </a>
      </div>
    </div>
  );
}
