import { prisma } from "@/lib/prisma";
import { AccountActions } from "@/components/AccountActions";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

export default async function AdminAccountsPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-spf-ink">Comptes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Approuvez les nouvelles inscriptions et gérez les rôles.
      </p>

      <div className="mt-6 overflow-hidden rounded-card border border-spf-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-spf-line bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spf-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-spf-ink">{u.displayName}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">
                  {u.role === "ADMIN" ? "Administrateur" : "Contributeur"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[u.status]}`}
                  >
                    {STATUS_LABEL[u.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AccountActions userId={u.id} status={u.status} role={u.role} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Aucun compte.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
