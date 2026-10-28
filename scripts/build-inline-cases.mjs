// Build-time pipeline: turn a standalone case mockup (public artifact HTML) into
// a scoped stylesheet + a markup/script module the site can render WITHOUT an iframe.
//
// For each case it:
//   1. splits the mockup into <style> / body / <script>
//   2. scopes every CSS rule under `.<slug>-case` (remaps :root / html / body / * ,
//      renames @keyframes) so the mockup's resets + tokens never leak onto the shell
//   3. swaps base64 images for real files
//   4. hides the mockup's own .chrome + #next (the site supplies those)
//   5. emits styles/<slug>-case.css and components/ProjectView/generated/<slug>.ts
//
// Re-run after editing a mockup:  node scripts/build-inline-cases.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postcss = (await import(path.join(ROOT, "node_modules/postcss/lib/postcss.js"))).default;

const CASES = [
  {
    slug: "tap3d",
    src: "TAPimgs/tap3d-case.html",
    // tap3d-hero.jpg (the Figma export) is not in the repo yet; use the existing
    // high-res TAP hero as the poster until it lands (deploy guide Step 0 #8).
    swaps: [
      { re: /(\bsrc=)"data:image\/jpeg;base64,[^"]*"/g, to: '$1"/TAPimgs/TAP_case_hero_pic.png"' },
      { re: /((?:xlink:href|href)=)"data:image\/webp;base64,[^"]*"/g, to: '$1"/TAPimgs/tap3d-trainee.png"' },
    ],
  },
  {
    slug: "lepal",
    src: "lepal_img/lepal-case-repo.html",
    swaps: [],
  },
  {
    slug: "sidewalk",
    src: "ProjectSidewalk/sidewalk-case-repo.html",
    swaps: [],
  },
  {
    slug: "cheffy",
    src: "cheffy_img/cheffy-case.html",
    swaps: [],
  },
  {
    slug: "cookar",
    src: "projects/cookar-case.html",
    swaps: [],
  },
];

function prefixSelector(sel, wrap) {
  const s = sel.trim();
  if (!s) return [s];
  // :root, optionally with an attribute like [data-theme="light"]
  const m = s.match(/^:root(\[[^\]]*\])?\s*(.*)$/);
  if (m) {
    const attr = m[1] || "";
    const rest = m[2] ? " " + m[2] : "";
    // themed root → drive the scoped wrapper from the <html> attribute
    if (attr) return [`html${attr} ${wrap}${rest}`];
    return [`${wrap}${rest}`];
  }
  if (s === "html" || s === "body") return [wrap];
  if (s === "*") return [wrap, `${wrap} *`];
  // bare pseudo / pseudo-element → scope as descendant
  if (s.startsWith(":") || s.startsWith("::")) return [`${wrap} ${s}`];
  return [`${wrap} ${s}`];
}

function scopeCss(css, wrap, slugSafe) {
  const root = postcss.parse(css);

  // rename @keyframes so animation names can't collide globally
  const kf = {};
  root.walkAtRules(/^(-\w+-)?keyframes$/i, (at) => {
    const old = at.params.trim();
    const neo = `${slugSafe}-${old}`;
    kf[old] = neo;
    at.params = neo;
  });
  if (Object.keys(kf).length) {
    root.walkDecls(/^(-\w+-)?animation(-name)?$/i, (d) => {
      for (const [old, neo] of Object.entries(kf)) {
        d.value = d.value.replace(new RegExp(`\\b${old}\\b`, "g"), neo);
      }
    });
  }

  root.walkRules((rule) => {
    // leave keyframe step selectors (0%, to, from…) untouched
    if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
    rule.selectors = rule.selectors.flatMap((sel) => prefixSelector(sel, wrap));
  });

  return root.toString();
}

for (const c of CASES) {
  const abs = path.join(ROOT, c.src);
  const srcText = fs.readFileSync(abs, "utf8");
  const wrap = `.${c.slug}-case`;
  const slugSafe = c.slug.replace(/[^\w-]/g, "");

  // 1. split
  const styleM = srcText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleM) throw new Error(`${c.src}: no <style> block`);
  const rawCss = styleM[1];

  const scriptM = srcText.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  let rawJs = scriptM ? scriptM[1] : "";
  // Cases render inside the site now, so the hero motion/video should always
  // load (not just on jihokim.me/localhost). Drop the hostname gate; the
  // prefers-reduced-motion check inside the script still applies.
  rawJs = rawJs.replace(/onSite\s*=\s*[^;]*jihokim[^;]*;/g, "onSite=true;");

  // the Google Fonts stylesheet link the mockup declares (Inter, + Nunito Sans etc.)
  const fontM = srcText.match(/<link[^>]+href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/i);
  const fontHref = fontM ? fontM[1].replace(/&amp;/g, "&") : "";

  const afterStyle = srcText.indexOf("</style>") + "</style>".length;
  const scriptStart = scriptM ? srcText.indexOf(scriptM[0], afterStyle) : srcText.length;
  let body = srcText.slice(afterStyle, scriptStart).trim();

  // 2. scope css + append shell overrides (hide mockup chrome / next; keep DOM so JS wiring survives)
  let css = scopeCss(rawCss, wrap, slugSafe);
  css +=
    `\n\n/* shell overrides: the site supplies close / Next / theme chrome */\n` +
    `${wrap} .chrome{display:none !important}\n` +
    `${wrap} #next{display:none !important}\n` +
    `${wrap}{min-height:100vh}\n` +
    `\n/* hero: tag row full-width above a TOP-aligned two-column row */\n` +
    `${wrap} .hero-inner .hero-top{max-width:960px;margin:0 auto 18px}\n` +
    `${wrap} .hero-inner .hero-grid{align-items:start}\n` +
    `${wrap} .hero-right{padding-top:0}\n` +
    // the lead's line-height is taller than the H1's, so nudge it up a few px
    // to make the cap tops of the first lines sit on the same visual line
    `${wrap} .hero-right .t-lead{margin-top:-3px}\n` +
    // desktop only: dark over the bottom ~half + soft backdrop blur behind the
    // text (top half of the motion stays clear). On mobile (<=760px) the mockup's
    // own stronger scrim handles the stacked layout where the text sits higher.
    `\n/* scrim (desktop): dark over the bottom ~half, soft backdrop blur behind the text */\n` +
    `@media (min-width:761px){\n` +
    `${wrap} .hero-bleed::after{background:linear-gradient(180deg,transparent 0%,transparent 38%,rgba(0,0,0,.5) 55%,rgba(0,0,0,.9) 70%,rgba(0,0,0,.97) 100%)}\n` +
    `${wrap} .hero-bleed::before{content:"";position:absolute;left:0;right:0;bottom:0;top:40%;z-index:2;pointer-events:none;background:rgba(0,0,0,.28);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);-webkit-mask-image:linear-gradient(180deg,transparent,#000 28%);mask-image:linear-gradient(180deg,transparent,#000 28%)}\n` +
    `}\n` +
    `\n/* hero: summary/primary button moves under the H1 in the left column */\n` +
    `${wrap} .hero-left{display:flex;flex-direction:column;gap:20px;align-items:flex-start}\n` +
    `\n/* iframe hero: render at a fixed 1440x810 design size and scale to cover width, top-centered (no responsive blow-up) */\n` +
    `${wrap} .hero-media iframe{width:1440px;height:810px;left:50%;top:0;margin-left:-720px;transform-origin:top center;transform:scale(var(--hero-scale,1))}\n` +
    // the motion iframe is transparent; once it's loaded, hide the poster/art
    // underneath so it doesn't ghost through the motion.
    `${wrap} .hero-bleed:has(.hero-media iframe.ready) > img,${wrap} .hero-bleed:has(.hero-media iframe.ready) > .hero-art{opacity:0 !important}\n` +
    `\n/* content images: full brightness; only a Before comparison may dim via inline style */\n` +
    `${wrap} .shot img,${wrap} .duo img,${wrap} figure img,${wrap} section img{filter:none;opacity:1}\n`;

  // 3. swap base64 → files
  for (const s of c.swaps) body = body.replace(s.re, s.to);

  // hero restructure: lift .hero-top out of the left column so it spans both
  // columns on its own row above the H1 + right column. Identical hero scaffold
  // across all five mockups, so one transform covers them.
  body = body.replace(
    /<div class="hero-grid">\s*<div>\s*(<div class="hero-top">[\s\S]*?<\/div>)\s*(<h1\b[\s\S]*?<\/h1>)\s*<\/div>/,
    (m, top, h1) => `${top}\n          <div class="hero-grid">\n            ${h1}`
  );
  // move the summary / primary CTA button under the H1 in a left column; the
  // right column keeps lead + tags (+ any store/paper/live link).
  body = body.replace(
    /(<h1\b[\s\S]*?<\/h1>)\s*<div class="hero-right">([\s\S]*?)(<(?:button|a) class="btn-summary"[\s\S]*?<\/(?:button|a)>)/,
    (m, h1, pre, btn) =>
      `<div class="hero-left">\n            ${h1}\n            ${btn}\n          </div>\n          <div class="hero-right">${pre}`
  );

  // guard: no megabyte data-URIs should remain in the shipped markup
  const leftover = body.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]{2000,}/g);
  if (leftover) {
    console.warn(`  ! ${c.slug}: ${leftover.length} large base64 image(s) still inline (add a swap)`);
  }

  // 4. write outputs
  const cssPath = path.join(ROOT, "styles", `${c.slug}-case.css`);
  fs.writeFileSync(cssPath, css, "utf8");

  const genDir = path.join(ROOT, "components/ProjectView/generated");
  fs.mkdirSync(genDir, { recursive: true });
  const modPath = path.join(genDir, `${c.slug}.ts`);
  const mod =
    `// GENERATED by scripts/build-inline-cases.mjs from ${c.src}\n` +
    `// Do not edit by hand — edit the mockup and re-run the script.\n` +
    `/* eslint-disable */\n` +
    `export const html = ${JSON.stringify(body)};\n` +
    `export const js = ${JSON.stringify(rawJs)};\n` +
    `export const fontHref = ${JSON.stringify(fontHref)};\n`;
  fs.writeFileSync(modPath, mod, "utf8");

  console.log(
    `✓ ${c.slug}: css ${(css.length / 1024).toFixed(0)}kb · html ${(body.length / 1024).toFixed(0)}kb · js ${(rawJs.length / 1024).toFixed(0)}kb`
  );
}
