import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DebugUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      permissions: { select: { permission: true } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Users (debug)</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Permissions</th>
            <th className="px-3 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.name ?? "—"}</td>
              <td className="px-3 py-2">
                {u.permissions.length
                  ? u.permissions.map((p) => p.permission).join(", ")
                  : "—"}
              </td>
              <td className="px-3 py-2">
                {new Date(u.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
