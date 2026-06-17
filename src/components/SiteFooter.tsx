import { SpfLogo } from "@/components/SpfLogo";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-spf-ink text-blue-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <SpfLogo variant="light" />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="cursor-default hover:text-white">Contact</span>
          <span className="cursor-default hover:text-white">Mentions légales</span>
          <span className="cursor-default hover:text-white">Protection des données</span>
          <span className="cursor-default hover:text-white">Accessibilité</span>
        </nav>
        <div className="text-xs text-blue-200/70">
          © {new Date().getFullYear()} SPF Finances
        </div>
      </div>
    </footer>
  );
}
