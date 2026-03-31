import { cn } from "@/lib/utils";

interface SoundScopeLogoProps {
  size?: number;
  className?: string;
}

export function SoundScopeLogo({ size = 40, className }: SoundScopeLogoProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-lg overflow-hidden ring-1 ring-white/10 flex items-center justify-center shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="logoBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="waveGrad" x1="16" y1="20" x2="48" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* BG */}
        <rect width="64" height="64" rx="16" fill="url(#logoBg)" />

        {/* Sound wave bars — like an equalizer / audio waveform */}
        <rect x="14" y="28" width="4" height="8" rx="2" fill="url(#waveGrad)">
          <animate attributeName="height" values="8;20;8" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="28;22;28" dur="1.2s" repeatCount="indefinite" />
        </rect>
        <rect x="22" y="22" width="4" height="20" rx="2" fill="url(#waveGrad)">
          <animate attributeName="height" values="20;10;20" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="22;27;22" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="30" y="18" width="4" height="28" rx="2" fill="url(#waveGrad)">
          <animate attributeName="height" values="28;14;28" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="y" values="18;25;18" dur="1.4s" repeatCount="indefinite" />
        </rect>
        <rect x="38" y="24" width="4" height="16" rx="2" fill="url(#waveGrad)">
          <animate attributeName="height" values="16;26;16" dur="0.9s" repeatCount="indefinite" />
          <animate attributeName="y" values="24;19;24" dur="0.9s" repeatCount="indefinite" />
        </rect>
        <rect x="46" y="26" width="4" height="12" rx="2" fill="url(#waveGrad)">
          <animate attributeName="height" values="12;22;12" dur="1.1s" repeatCount="indefinite" />
          <animate attributeName="y" values="26;21;26" dur="1.1s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  );
}

export function SoundScopeWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-heading font-bold text-gradient", className)}>
      SoundScope
    </span>
  );
}
