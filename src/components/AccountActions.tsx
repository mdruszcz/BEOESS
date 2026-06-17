"use client";

import { useTransition } from "react";
import { Check, X, Shield, User as UserIcon } from "lucide-react";
import { setAccountStatus, setAccountRole } from "@/lib/actions";

export function AccountActions({
  userId,
  status,
  role,
}: {
  userId: string;
  status: string;
  role: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {status === "PENDING" && (
        <>
          <button
            disabled={pending}
            onClick={() => startTransition(() => setAccountStatus(userId, "APPROVED"))}
            className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check size={13} /> Approuver
          </button>
          <button
            disabled={pending}
            onClick={() => startTransition(() => setAccountStatus(userId, "REJECTED"))}
            className="flex items-center gap-1 rounded border border-spf-line px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={13} /> Refuser
          </button>
        </>
      )}
      {status === "APPROVED" &&
        (role === "ADMIN" ? (
          <button
            disabled={pending}
            onClick={() => startTransition(() => setAccountRole(userId, "READER"))}
            className="flex items-center gap-1 rounded border border-spf-line px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <UserIcon size={13} /> Retirer admin
          </button>
        ) : (
          <button
            disabled={pending}
            onClick={() => startTransition(() => setAccountRole(userId, "ADMIN"))}
            className="flex items-center gap-1 rounded border border-spf-line px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <Shield size={13} /> Rendre admin
          </button>
        ))}
      {status === "REJECTED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => setAccountStatus(userId, "APPROVED"))}
          className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check size={13} /> Approuver
        </button>
      )}
    </div>
  );
}
