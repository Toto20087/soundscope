"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, RotateCcw, Loader2 } from "lucide-react";

interface AiAnalysisProps {
  artistName: string;
}

export function AiAnalysis({ artistName }: AiAnalysisProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "done" | "error">("idle");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(`ai-analysis:${artistName}`);
    if (cached) {
      setText(cached);
      setStatus("done");
    }
  }, [artistName]);

  const runAnalysis = useCallback(async () => {
    setText("");
    textRef.current = "";
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("No response body");

      setStatus("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textRef.current += decoder.decode(value, { stream: true });
        setText(textRef.current);
      }

      sessionStorage.setItem(`ai-analysis:${artistName}`, textRef.current);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate analysis");
      setStatus("error");
    }
  }, [artistName]);

  useEffect(() => {
    if (status === "streaming" && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, status]);

  return (
    <section className="mt-24">
      <div className="bg-white p-12 md:p-20 rounded-[2rem] relative overflow-hidden group shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-[120px] h-[120px] transition-colors duration-300" style={{ color: "var(--accent-hex)" }} />
        </div>

        <div className="max-w-3xl space-y-8">
          <div className="flex items-center gap-4">
            <Sparkles className="w-6 h-6 transition-colors duration-300" style={{ color: "var(--accent-hex)" }} />
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Musical Evolution Analysis</h2>
          </div>

          {status === "idle" && (
            <div className="space-y-6">
              <p className="text-xl md:text-2xl leading-relaxed text-text-secondary italic">
                &ldquo;Discover the creative journey, genre shifts, and cultural impact of {artistName} through AI-powered analysis.&rdquo;
              </p>
              <button
                onClick={runAnalysis}
                className="px-6 py-2.5 text-white font-bold text-sm rounded-full uppercase tracking-widest transition-colors duration-300"
                style={{ backgroundColor: "var(--accent-hex)" }}
              >
                Analyze Evolution
              </button>
            </div>
          )}

          {status === "loading" && (
            <div className="flex items-center gap-4 py-8">
              <Loader2 className="w-6 h-6 animate-spin transition-colors duration-300" style={{ color: "var(--accent-hex)" }} />
              <p className="text-text-secondary italic">Analyzing {artistName}&apos;s evolution...</p>
            </div>
          )}

          {(status === "streaming" || status === "done") && (
            <div ref={containerRef} className="max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                <MarkdownRenderer text={text} />
              </div>
              {status === "streaming" && (
                <span className="inline-block w-2 h-5 animate-pulse ml-0.5 align-text-bottom transition-colors duration-300" style={{ backgroundColor: "var(--accent-hex)" }} />
              )}
              {status === "done" && (
                <button
                  onClick={runAnalysis}
                  className="flex items-center gap-1.5 mt-6 text-sm font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <p className="text-error">{error}</p>
              <button onClick={runAnalysis} className="px-4 py-2 bg-zinc-100 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-heading font-bold text-text-primary mt-8 mb-3">
          {trimmed.replace("## ", "")}
        </h3>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-heading font-black text-text-primary mt-8 mb-4">
          {trimmed.replace("# ", "")}
        </h2>
      );
    } else if (trimmed === "") {
      // skip empty
    } else {
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={key++} className="text-lg leading-relaxed text-text-secondary">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={i} className="text-text-primary font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
  }
  return <>{elements}</>;
}
