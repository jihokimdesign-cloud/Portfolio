// Site footer — markup for the existing .jk-foot stylesheet (styles/jk-cases-foot.css).
// Used on Home and every case page. Dark via [data-theme="dark"] on <html>.
import { useState } from "react";
import { SITE } from "../lib/constants";

const EMAIL = "jihokimdesign@gmail.com";

export default function SiteFooter() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const t = document.createElement("textarea");
      t.value = EMAIL;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
      } catch {}
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <footer className="jk-foot">
      <hr className="jk-foot-line" />
      <h2 className="jk-foot-title">Let&rsquo;s work together</h2>

      <div className="jk-foot-mail">
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <button
          type="button"
          onClick={copy}
          className={copied ? "done" : undefined}
          aria-label={copied ? "Email copied" : "Copy email address"}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 16 16" aria-hidden>
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" aria-hidden>
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                <path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div className="jk-foot-links">
        <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={SITE.resumeUrl} target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </div>

      <div className="jk-foot-bar">
        <span className="jk-foot-open">Open to new roles</span>
        <span>&copy; 2026</span>
      </div>
    </footer>
  );
}
