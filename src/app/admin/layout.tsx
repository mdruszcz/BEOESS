import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, FileText, Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { SpfLogo } from "@/components/SpfLogo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-spf-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <SpfLogo />
            <span className="border-l border-spf-line pl-4 text-sm font-bold text-spf-ink">
              Administration
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded border border-spf-line px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Home size={14} /> Retour au site
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6 sm:px-6">
        <nav className="w-52 shrink-0">
          <div className="flex flex-col gap-1">
            <AdminLink href="/admin/comptes" icon={<Users size={16} />} label="Comptes" />
            <AdminLink href="/admin/rapports" icon={<FileText size={16} />} label="Rapports" />
          </div>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-spf-sky hover:text-spf-royal"
    >
      {icon} {label}
    </Link>
  );
}
