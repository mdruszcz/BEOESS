import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportRow } from "@/components/ReportRow";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; topic?: string; tri?: string }>;

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, topic, tri } = await searchParams;
  const session = await auth();
  const isApproved =
    !!session?.user &&
    (session.user as { status?: string }).status === "APPROVED";

  // Anonymous + non-approved visitors only see PUBLIC reports.
  // Approved users also see INTERNAL. RESTRICTED is always link-only but listed.
  const visibility: Prisma.ReportWhereInput = isApproved
    ? {}
    : { confidentiality: "PUBLIC" };

  const where: Prisma.ReportWhereInput = {
    ...visibility,
    ...(topic ? { topic } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
            { authorName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ReportOrderByWithRelationInput =
    tri === "recent" ? { createdAt: "desc" } : { documentDate: "desc" };

  const [reports, allTopics] = await Promise.all([
    prisma.report.findMany({ where, orderBy, take: 100 }),
    prisma.report.findMany({ select: { topic: true }, distinct: ["topic"], orderBy: { topic: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-spf-ink">Rapports &amp; analyses</h1>
        <p className="mt-1 text-sm text-slate-500">
          {reports.length} document{reports.length > 1 ? "s" : ""}
          {q ? ` pour « ${q} »` : ""}
          {!isApproved && " · vous voyez uniquement les documents publics"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Topic filter rail */}
        <aside>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Thématiques
          </h2>
          <div className="flex flex-col gap-1">
            <Link
              href="/rapports"
              className={`rounded px-3 py-2 text-sm ${!topic ? "bg-spf-sky font-semibold text-spf-royal" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Toutes
            </Link>
            {allTopics.map(({ topic: t }) => (
              <Link
                key={t}
                href={`/rapports?topic=${encodeURIComponent(t)}`}
                className={`rounded px-3 py-2 text-sm ${topic === t ? "bg-spf-sky font-semibold text-spf-royal" : "text-slate-700 hover:bg-slate-50"}`}
              >
                {t}
              </Link>
            ))}
          </div>
        </aside>

        {/* Results */}
        <section className="rounded-card border border-spf-line bg-white p-2">
          {reports.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              Aucun document ne correspond à votre recherche.
            </p>
          ) : (
            <div className="divide-y divide-spf-line">
              {reports.map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
