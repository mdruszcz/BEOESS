"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteReport } from "@/lib/actions";

export function DeleteReportButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm(`Supprimer « ${title} » ? Cette action est irréversible.`)) {
          startTransition(() => deleteReport(id));
        }
      }}
      className="flex items-center gap-1 rounded border border-spf-line px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
    >
      <Trash2 size={13} /> Supprimer
    </button>
  );
}
