import sanitize from "sanitize-html";

const ALLOWED_TAGS = ["p", "br", "a", "em", "strong", "b", "i"];
const ALLOWED_ATTR: Record<string, string[]> = {
  a: ["href", "rel", "target"],
};

/**
 * Sanitize HTML content from Last.fm bios and wikis.
 * Only allows safe formatting tags.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  const clean = sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
  });

  // Add rel="noopener noreferrer" and target="_blank" to all links
  return clean.replace(
    /<a\s/g,
    '<a rel="noopener noreferrer" target="_blank" '
  );
}

/**
 * Strip the "Read more on Last.fm" link that appears at the end of summaries.
 */
export function stripReadMoreLink(html: string): string {
  if (!html) return "";
  // Remove the <a> tag that contains "Read more on Last.fm" or similar
  return html
    .replace(/<a[^>]*>Read more on Last\.fm<\/a>/gi, "")
    .replace(/<a[^>]*>read more on last\.fm<\/a>/gi, "")
    .trim();
}
