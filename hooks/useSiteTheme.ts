import { useEffect, useState } from "react";

// 사이트 테마(data-theme on <html>)를 읽어 'light'|'dark' 반환.
// {theme} 토큰이 든 iframe src를 테마별 파일로 스위칭할 때 사용.
export function useSiteTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const read = () =>
      setTheme(
        document.documentElement.dataset.theme === "light" ? "light" : "dark"
      );
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);
  return theme;
}
