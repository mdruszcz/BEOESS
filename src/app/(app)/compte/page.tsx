import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente d'approbation",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = session.user as { name?: string; email?: string; role?: string; status?: string };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-spf-ink">Mon compte</h1>
      <div className="mt-6 divide-y divide-spf-line rounded-card border border-spf-line bg-white">
        <Row label="Nom" value={user.name ?? "—"} />
        <Row label="Email" value={user.email ?? "—"} />
        <Row label="Rôle" value={user.role === "ADMIN" ? "Administrateur" : "Contributeur"} />
        <Row label="Statut" value={STATUS_LABEL[user.status ?? ""] ?? "—"} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-spf-ink">{value}</span>
    </div>
  );
}
