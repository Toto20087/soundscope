"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ArtistBioProps {
  bio: {
    summary: string;
    full: string;
  };
}

export function ArtistBio({ bio }: ArtistBioProps) {
  const [expanded, setExpanded] = useState(false);
  const hasFullBio = bio.full && bio.full.length > bio.summary.length;

  return (
    <section>
      <h2 className="text-3xl font-heading font-semibold text-text-primary mb-8">
        About
      </h2>
      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        <div
          className="text-text-secondary leading-relaxed prose prose-gray prose-base max-w-none"
          dangerouslySetInnerHTML={{
            __html: expanded ? bio.full : bio.summary,
          }}
        />
        {hasFullBio && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-4 text-sm font-medium transition-colors duration-300"
            style={{ color: "var(--accent-hex)" }}
          >
            {expanded ? (
              <>
                Read less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
