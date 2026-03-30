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
      <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
        Biography
      </h2>
      <div className="glass rounded-2xl p-6">
        <div
          className="text-text-secondary leading-relaxed prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: expanded ? bio.full : bio.summary,
          }}
        />
        {hasFullBio && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-4 text-sm text-accent-purple hover:text-accent-purple-light transition-colors"
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
