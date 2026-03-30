import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-hero-gradient">
      <h1 className="text-5xl font-heading font-bold text-gradient mb-4">
        {siteConfig.name}
      </h1>
      <p className="text-text-secondary text-lg">
        {siteConfig.tagline}
      </p>
    </main>
  );
}
