import Link from "next/link";
import { SpfLogo } from "@/components/SpfLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-spf-royal to-spf-ink">
      <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-5">
        <Link href="/">
          <SpfLogo variant="light" />
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
