import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-heading font-bold text-gradient hover:opacity-80 transition-opacity"
        >
          {siteConfig.name}
        </Link>
      </div>
    </header>
  );
}
