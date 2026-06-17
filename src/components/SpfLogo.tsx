export function SpfLogo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-spf-ink";
  const sub = variant === "light" ? "text-blue-100" : "text-slate-500";
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
          variant === "light" ? "bg-white/10" : "bg-spf-ink"
        }`}
        aria-hidden
      >
        {/* Stylised heraldic lion mark — placeholder for the official emblem */}
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
          <path
            d="M12 2l7 3v6c0 4.4-3 8.3-7 9-4-0.7-7-4.6-7-9V5l7-3z"
            fill={variant === "light" ? "white" : "#facc15"}
            fillOpacity={variant === "light" ? 0.9 : 1}
          />
          <path d="M9 11l2 2 4-4" stroke={variant === "light" ? "#1746a8" : "#0f2a5e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={`text-[11px] font-medium uppercase tracking-wide ${sub}`}>
          Service Public Fédéral
        </div>
        <div className={`text-base font-bold ${text}`}>FINANCES</div>
      </div>
    </div>
  );
}
