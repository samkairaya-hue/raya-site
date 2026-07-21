import type { Theme } from "@/lib/cms-types";

export function ThemeStyle({ theme }: { theme: Theme }) {
  const css = `:root{
    --bg-cream:${theme.bg_cream};
    --bg-sand:${theme.bg_sand};
    --text-dark:${theme.text_dark};
    --text-muted:${theme.text_muted};
    --accent-primary:${theme.accent_primary};
    --accent-hover:${theme.accent_hover};
    --footer-bg:${theme.footer_bg};
  }`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
