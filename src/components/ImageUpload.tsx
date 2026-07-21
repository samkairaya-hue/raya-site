import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { uploadMedia } from "@/lib/cms.functions";

export function ImageUpload({
  value,
  onChange,
  hint,
}: {
  value: string | null | undefined;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const upload = useServerFn(uploadMedia);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(f: File) {
    setErr("");
    setBusy(true);
    try {
      const buf = await f.arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const base64 = btoa(bin);
      const res = await upload({
        data: { filename: f.name, contentType: f.type || "application/octet-stream", base64 },
      });
      onChange(res.url);
    } catch (e: any) {
      setErr(e?.message ?? "העלאה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        {value ? (
          <img
            src={value}
            alt=""
            style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)" }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              background: "rgba(0,0,0,.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: 24,
            }}
          >
            🖼️
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
          {busy ? "מעלה…" : value ? "החלף תמונה" : "העלה תמונה"}
        </button>
        {value && (
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
        <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
          {hint}
        </small>
      )}
      {err && <small style={{ color: "var(--destructive, #c00)" }}>{err}</small>}
    </div>
  );
}
