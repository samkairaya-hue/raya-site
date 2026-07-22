import { useRef, useState } from "react";

export function HtmlUpload({
  value,
  onChange,
  hint,
}: {
  value: string | null | undefined;
  onChange: (html: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const hasContent = !!value && value.trim().length > 0;
  const sizeKb = hasContent ? Math.max(1, Math.round(new Blob([value!]).size / 1024)) : 0;

  async function handleFile(f: File) {
    setErr("");
    setBusy(true);
    try {
      const text = await f.text();
      if (!text.trim()) throw new Error("הקובץ ריק");
      onChange(text);
    } catch (e: any) {
      setErr(e?.message ?? "טעינה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: hasContent ? "rgba(16,185,129,.12)" : "rgba(0,0,0,.05)",
            color: hasContent ? "#065F46" : "var(--text-muted)",
            fontSize: ".85rem",
          }}
        >
          {hasContent ? `קובץ HTML נטען · ${sizeKb} KB` : "לא נטען קובץ – הריבוע לא יהיה לחיץ"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".html,.htm,text/html"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="cta"
          style={{ background: "var(--text-dark)" }}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "טוען…" : hasContent ? "החלף קובץ" : "העלה קובץ HTML"}
        </button>
        {hasContent && (
          <button
            type="button"
            className="cta"
            style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid rgba(0,0,0,.15)" }}
            onClick={() => onChange("")}
            disabled={busy}
          >
            הסר
          </button>
        )}
      </div>
      {hint && (
        <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{hint}</small>
      )}
      {err && <small style={{ color: "var(--destructive, #c00)" }}>{err}</small>}
    </div>
  );
}
