import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.05] py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-tertiary">
        <p>{siteConfig.name}</p>
        <a
          href={siteConfig.attribution.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-secondary transition-colors"
        >
          {siteConfig.attribution.text}
        </a>
      </div>
    </footer>
  );
}
