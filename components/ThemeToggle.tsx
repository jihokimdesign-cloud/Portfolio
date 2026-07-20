import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// DESIGN.md-token theme switch. Persists to localStorage; _document's init
// script applies the saved value before first paint.
// `inline` renders a bare button for embedding (e.g. inside GlassNav);
// default renders the standalone floating pill.
export default function ThemeToggle({ inline = false }: { inline?: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const read = () => {
      const current = document.documentElement.dataset.theme;
      if (current === "light" || current === "dark") setTheme(current);
    };
    read();
    // stay in sync when the theme is changed elsewhere (bento ModeSwitch)
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={
        inline
          ? "flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110"
          : "fixed right-5 top-5 z-[202] flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105"
      }
      style={
        inline
          ? { color: "var(--fg)" }
          : {
              background: "var(--surface)",
              color: "var(--fg)",
              boxShadow: "0 4px 16px rgba(0,0,0,.25)",
            }
      }
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
