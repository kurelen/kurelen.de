import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // always fresh in dev

export default async function UsersPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Users (dev)</h1>
      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Role</th>
              <th className="px-3 py-2 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.name ?? "—"}</td>
                <td className="px-3 py-2">{u.role}</td>
                <td className="px-3 py-2">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-gray-500" colSpan={4}>
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
