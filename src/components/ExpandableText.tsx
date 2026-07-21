import { useState, useRef, useLayoutEffect } from "react";

/**
 * Shows text clamped to `lines`. If it overflows, exposes a "להמשך …" toggle
 * that expands to full text. Keeps layout stable via min-height.
 */
export function ExpandableText({
  text,
  lines = 4,
  className = "",
  moreLabel = "להמשך …",
  lessLabel = "הצג פחות",
}: {
  text: string;
  lines?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight - 1 > el.clientHeight);
  }, [text, lines]);

  const paragraphs = text.split(/\n\n+/);

  return (
    <div className={className}>
      <div
        ref={ref}
        style={
          open
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: i === paragraphs.length - 1 ? 0 : "1em" }}>
            {p}
          </p>
        ))}
      </div>
      {overflows && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-2 font-bold"
          style={{ color: "var(--accent-primary)" }}
          type="button"
        >
          {open ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
