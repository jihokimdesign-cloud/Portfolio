// 사이트 테마 전환 단일 진입점 — 나브 토글과 벤토 ModeSwitch가 함께 쓴다.
// 전환 중에만 html에 .theme-transitioning을 달아 색상 크로스페이드를 켠다
// (globals.css 참조). 항상 켜두면 스크롤 중 hover 등 다른 전환까지 느려진다.
let transitionTimer: number | undefined;

export function setSiteTheme(next: "light" | "dark") {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(
    () => root.classList.remove("theme-transitioning"),
    450
  );
}
