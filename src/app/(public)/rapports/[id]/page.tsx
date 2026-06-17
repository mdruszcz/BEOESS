import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Download, ArrowLeft, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicUrl } from "@/lib/r2";
import { ConfidentialityBadge, TopicBadge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("fr-BE", { dateStyle: "long" }).format(new Date(d));
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) notFound();

  const session = await auth();
  const isApproved =
    !!session?.user && (session.user as { status?: string }).status === "APPROVED";

  // Internal/restricted metadata is visible only to approved users.
  const canSeeContent = report.confidentiality === "PUBLIC" || isApproved;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/rapports"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-spf-royal"
      >
        <ArrowLeft size={15} /> Retour aux rapports
      </Link>

      <div className="rounded-card border border-spf-line bg-white p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TopicBadge topic={report.topic} />
          <ConfidentialityBadge value={report.confidentiality} />
        </div>

        <h1 className="text-2xl font-bold text-spf-ink">{report.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {report.authorName} · {fmtDate(report.documentDate)}
        </p>

        {canSeeContent ? (
          <>
            <div className="mt-6 border-t border-spf-line pt-6">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Résumé
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {report.summary}
              </p>
            </div>

            <div className="mt-6">
              {report.sourceType === "FILE" && report.fileKey ? (
                <a
                  href={publicUrl(report.fileKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-spf-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-spf-royal"
                >
                  <Download size={16} /> Télécharger le document
                  {report.fileName ? ` (${report.fileName})` : ""}
                </a>
              ) : report.sharepointUrl ? (
                <a
                  href={report.sharepointUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-spf-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-spf-royal"
                >
                  <ExternalLink size={16} /> Ouvrir sur SharePoint
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <div className="mt-6 flex items-start gap-3 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Lock size={16} className="mt-0.5 shrink-0" />
            <div>
              Ce document est réservé aux agents du Service d&apos;Études.{" "}
              <Link href="/connexion" className="font-semibold underline">
                Connectez-vous
              </Link>{" "}
              pour y accéder.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
