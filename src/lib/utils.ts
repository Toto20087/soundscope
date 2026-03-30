import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a large number with abbreviation (1234567 → "1.2M")
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toString();
}

/**
 * Format seconds into MM:SS
 */
export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format total seconds into "Xh Ym" or "Ym"
 */
export function formatTotalDuration(seconds: number): string {
  if (seconds <= 0) return "Unknown";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Get artist initials for avatar (max 2 chars)
 */
export function getInitials(name: string): string {
  const words = name.replace(/^the\s+/i, "").split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Safely parse a string to number, returning 0 on failure
 */
export function toNumber(value: string | number | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === "number") return value;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}
