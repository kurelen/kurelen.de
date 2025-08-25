"use client";

import { useT } from "@/i18n";

type UserInfo = {
  id: string;
  email: string;
  name?: string | null;
  permissions?: string[] | { permission: string }[];
};

export default function LoggedInPanel({ user }: { user: UserInfo }) {
  const t = useT();
  const perms = (user.permissions ?? []).map((p) =>
    typeof p === "string" ? p : p.permission
  );

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // refresh page so server renders login form again
    window.location.reload();
  }

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold">{t("me.title")}</h1>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">{t("me.id")}: </span>
          <span>{user.id}</span>
        </div>
        <div>
          <span className="font-medium">{t("me.email")}: </span>
          <span>{user.email}</span>
        </div>
        {!!perms.length && (
          <div>
            <span className="font-medium">{t("me.permissions")}: </span>
            <span>{perms.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={logout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          {t("me.logout")}
        </button>
      </div>
    </div>
  );
}
