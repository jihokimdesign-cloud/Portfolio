import { Html, Head, Main, NextScript } from "next/document";

// Sets data-theme before first paint so the chosen theme never flashes.
const themeInit = `
try {
  var q = new URLSearchParams(location.search).get("theme");
  var t = (q === "light" || q === "dark") ? q : localStorage.getItem("theme");
  if (!t) t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
