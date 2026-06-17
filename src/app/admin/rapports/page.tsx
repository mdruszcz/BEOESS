import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfidentialityBadge } from "@/components/ui/Badge";
import { DeleteReportButton } from "@/components/DeleteReportButton";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("fr-BE", { dateStyle: "medium" }).format(new Date(d));
}

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-spf-ink">Rapports</h1>
          <p className="mt-1 text-sm text-slate-500">{reports.length} document(s)</p>
        </div>
        <Link
          href="/contribuer"
          className="rounded bg-spf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-spf-royal"
        >
          Ajouter
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-spf-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-spf-line bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Auteur</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Confidentialité</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spf-line">
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="max-w-xs px-4 py-3">
                  <Link href={`/rapports/${r.id}`} className="font-medium text-spf-ink hover:text-spf-royal">
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{r.authorName}</td>
                <td className="px-4 py-3 text-slate-600">{fmtDate(r.documentDate)}</td>
                <td className="px-4 py-3">
                  <ConfidentialityBadge value={r.confidentiality} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {r.sourceType === "FILE" ? "Fichier" : "SharePoint"}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteReportButton id={r.id} title={r.title} />
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Aucun rapport.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
