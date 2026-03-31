import Link from "next/link";
import { SearchX } from "lucide-react";
import { HeroSearchBar } from "@/components/search/hero-search-bar";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 bg-bg-primary">
      <SearchX className="w-16 h-16 text-text-tertiary mb-6" />
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
        Page Not Found
      </h1>
      <p className="text-text-secondary mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. Try searching for an artist instead.
      </p>

      <div className="w-full max-w-lg mb-8">
        <HeroSearchBar />
      </div>

      <Link
        href="/"
        className="text-sm text-accent-purple hover:text-accent-purple-light transition-colors"
      >
        Go back home
      </Link>
    </main>
  );
}
