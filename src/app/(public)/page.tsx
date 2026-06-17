import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TileGrid } from "@/components/TileGrid";
import { ReportRow } from "@/components/ReportRow";

export const dynamic = "force-dynamic";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-blue-100">{label}</div>
    </div>
  );
}

export default async function HomePage() {
  const [reportCount, authorRows, topics, featured, recent] = await Promise.all([
    prisma.report.count(),
    prisma.report.findMany({ select: { authorName: true }, distinct: ["authorName"] }),
    prisma.report.findMany({ select: { topic: true }, distinct: ["topic"] }),
    prisma.report.findMany({
      where: { confidentiality: "PUBLIC" },
      orderBy: { documentDate: "desc" },
      take: 3,
    }),
    prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-card bg-gradient-to-br from-spf-royal to-spf-ink">
        <div className="flex flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Bibliothèque des rapports et analyses
            </h1>
            <p className="mt-2 text-lg font-medium text-blue-100">Service d&apos;Études</p>
            <p className="mt-4 text-sm leading-relaxed text-blue-100/90">
              Accédez à l&apos;ensemble des rapports, analyses et publications réalisés par le
              Service d&apos;Études du SPF Finances.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:gap-x-8">
            <Stat value={reportCount.toLocaleString("fr-BE")} label="Rapports" />
            <Stat value={`${topics.length}+`} label="Thématiques" />
            <Stat value={`${authorRows.length}`} label="Auteurs" />
            <Stat value={`${topics.length}`} label="Sujets" />
          </div>
        </div>
      </section>

      {/* Tiles */}
      <section className="mt-6">
        <TileGrid />
      </section>

      {/* Feeds */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-spf-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-spf-ink">
              Rapports à la une
            </h2>
          </div>
          {featured.length === 0 ? (
            <EmptyFeed />
          ) : (
            <div className="divide-y divide-spf-line">
              {featured.map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          )}
          <FeedFooter href="/rapports?tri=une" label="Voir tous les rapports à la une" />
        </div>

        <div className="rounded-card border border-spf-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-spf-ink">
              Ajoutés récemment
            </h2>
          </div>
          {recent.length === 0 ? (
            <EmptyFeed />
          ) : (
            <div className="divide-y divide-spf-line">
              {recent.map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          )}
          <FeedFooter href="/rapports?tri=recent" label="Voir tous les ajouts récents" />
        </div>
      </section>
    </div>
  );
}

function EmptyFeed() {
  return (
    <p className="py-8 text-center text-sm text-slate-400">
      Aucun rapport pour le moment. Ajoutez-en un depuis « Contribuer ».
    </p>
  );
}

function FeedFooter({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-3 border-t border-spf-line pt-3">
      <Link
        href={href}
        className="block rounded border border-spf-line py-2 text-center text-sm font-medium text-spf-royal hover:bg-spf-sky"
      >
        {label}
      </Link>
    </div>
  );
}
