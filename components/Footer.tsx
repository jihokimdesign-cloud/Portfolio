"use client";

import { Linkedin, Github, Mail } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-bg-alt pb-24">
      <div className="mx-auto max-w-[1080px] px-8 py-16 md:px-16 lg:px-24">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SITE.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Connect
            </h4>
            <ul className="space-y-2">
              {[
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: SITE.linkedin,
                },
                {
                  icon: Mail,
                  label: "Email",
                  href: `mailto:${SITE.email}`,
                },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://medium.com/@arproj.ject.t/how-to-design-xr-shopping-apps-64b330f7eba9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Medium logo png.png" alt="" aria-hidden className="h-3.5 w-auto object-contain" style={{ filter: "invert(0.45)" }} />
                  Medium Article
                </a>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Credits
            </h4>
            <p className="text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
            <p className="mt-1 font-mono text-xs text-text-muted">
              Built with Figma, Claude Code,<br />
              GSAP &amp; Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
