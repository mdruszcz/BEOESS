const CONF_STYLES: Record<string, { label: string; cls: string }> = {
  PUBLIC: { label: "Public", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  INTERNAL: { label: "Interne", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  RESTRICTED: { label: "Restreint", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

export function ConfidentialityBadge({ value }: { value: string }) {
  const s = CONF_STYLES[value] ?? CONF_STYLES.INTERNAL;
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function TopicBadge({ topic }: { topic: string }) {
  return (
    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
      {topic}
    </span>
  );
}
