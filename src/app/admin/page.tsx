import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [pending, totalUsers, reports] = await Promise.all([
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.report.count(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-spf-ink">Tableau de bord</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card label="Comptes en attente" value={pending} href="/admin/comptes" highlight={pending > 0} />
        <Card label="Comptes au total" value={totalUsers} href="/admin/comptes" />
        <Card label="Rapports" value={reports} href="/admin/rapports" />
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-card border bg-white p-5 transition hover:shadow-sm ${
        highlight ? "border-amber-300" : "border-spf-line"
      }`}
    >
      <div className="text-3xl font-bold text-spf-ink">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </Link>
  );
}
