import Link from "next/link";
import { FileBarChart } from "lucide-react";
import { TopicBadge } from "@/components/ui/Badge";

export type ReportListItem = {
  id: string;
  title: string;
  authorName: string;
  documentDate: Date;
  topic: string;
};

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(d));
}

export function ReportRow({ report }: { report: ReportListItem }) {
  return (
    <Link
      href={`/rapports/${report.id}`}
      className="group flex items-start gap-3 rounded-md border border-transparent px-2 py-3 hover:border-spf-line hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-spf-sky text-spf-royal">
        <FileBarChart size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1">
          <TopicBadge topic={report.topic} />
        </div>
        <h3 className="truncate text-sm font-semibold text-spf-ink group-hover:text-spf-royal">
          {report.title}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          {report.authorName} · {fmtDate(report.documentDate)}
        </p>
      </div>
    </Link>
  );
}
