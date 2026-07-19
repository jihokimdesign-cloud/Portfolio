// Cobe globe card — card (tokens) → edge-fade mask div → canvas + a label
// synced to rotation. Cities surface their name as they pass the front.
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

type City = { name: string; lat: number; lng: number };

const CITIES: City[] = [
  { name: "Seattle", lat: 47.61, lng: -122.33 },
  { name: "Seoul", lat: 37.57, lng: 126.98 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "New York", lat: 40.71, lng: -74.01 },
];

// phi at which a longitude faces the viewer (from cobe's locationToAngles)
const lngToPhi = (lng: number) =>
  Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);

// shortest angular distance (0..π)
const angDist = (a: number, b: number) => {
  const d =
    ((((a - b) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return Math.abs(d);
};

type Props = {
  label?: string;
  markerColor?: [number, number, number]; // 0–1 RGB
  rotateSpeed?: number;
  facingThreshold?: number;
};

export default function GlobeCard({
  label = "Postcards from",
  markerColor = [0.976, 0.439, 0.188], // #F97030 — Jiho's pick
  rotateSpeed = 0.002, // Xiang: 0.4/200 per frame
  facingThreshold = 0.35,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // rotation state lives in refs — read only inside onRender (60fps, no re-renders)
  const phiRef = useRef(0);
  const pointerStart = useRef<number | null>(null);
  const pointerDelta = useRef(0);
  const reducedMotion = useRef(false);

  // follow the site theme (data-theme on <html>)
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const read = () =>
      setIsDark(document.documentElement.dataset.theme !== "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  // city label facing the viewer
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const lastShownCity = useRef<string>(CITIES[0].name);
  if (activeCity) lastShownCity.current = activeCity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let currentFacing: string | null = null;
    let width = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    // Guard against the 0-width init race: creating the globe before layout
    // settles bakes in a 0x0 canvas. Only create once a real size exists;
    // afterwards onRender keeps dimensions fresh.
    const init = () => {
      if (globe || width === 0) return;

      // Xiang의 실제 번들에서 추출한 config. 단, 색은 테마 분기:
      // Xiang의 회색 구체(baseColor .2)는 밝은 카드 전용 — 다크 카드에선
      // 배경에 묻혀 안 보인다(d6e49788에서 잡았던 그 버그).
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.06,
        dark: 1,
        diffuse: isDark ? 1.2 : 1.32,
        mapSamples: 10877,
        mapBrightness: isDark ? 6 : 12,
        baseColor: isDark ? [1, 1, 1] : [0.2, 0.2, 0.2],
        glowColor: isDark ? [0.3, 0.3, 0.3] : [1, 1, 1],
        markerColor,
        markers: CITIES.map((c) => ({
          location: [c.lat, c.lng],
          size: 0.12,
        })),
        scale: 0.875,
        offset: [0, 0],
        onRender: (state) => {
          // auto-rotate unless dragging (reduced motion: still, drag allowed)
          if (pointerStart.current === null && !reducedMotion.current) {
            phiRef.current += rotateSpeed;
          }
          const phi = phiRef.current + pointerDelta.current;
          state.phi = phi;
          state.width = width * 2;
          state.height = width * 2;

          // nearest city within ±threshold of front-facing
          let facing: string | null = null;
          let best = facingThreshold;
          for (const c of CITIES) {
            const d = angDist(phi, lngToPhi(c.lng));
            if (d < best) {
              best = d;
              facing = c.name;
            }
          }
          if (facing !== currentFacing) {
            currentFacing = facing;
            setActiveCity(facing);
          }
        },
      });

      // mount fade-in
      canvas.style.opacity = "0";
      canvas.style.transition = "opacity 600ms ease";
      requestAnimationFrame(() => (canvas.style.opacity = "1"));
    };

    // ResizeObserver instead of window resize: catches initial 0-width,
    // container resizes, and breakpoint changes
    const ro = new ResizeObserver(() => {
      width = canvas.offsetWidth;
      init();
    });
    ro.observe(canvas);
    width = canvas.offsetWidth;
    init();

    return () => {
      ro.disconnect();
      globe?.destroy();
    };
  }, [isDark, markerColor, rotateSpeed, facingThreshold]);

  // drag to rotate
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerStart.current === null) return;
    pointerDelta.current = (e.clientX - pointerStart.current) / 100;
  };
  const onPointerUp = () => {
    phiRef.current += pointerDelta.current;
    pointerDelta.current = 0;
    pointerStart.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  return (
    <div
      role="img"
      aria-label={`${label} ${lastShownCity.current} — rotating globe of cities from my journey`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        boxShadow: isDark
          ? "rgba(0,0,0,0.35) 0px 0.36px 1.23px -1px, rgba(0,0,0,0.35) 0px 1.37px 4.67px -2px, rgba(0,0,0,0.25) 0px 6px 20.4px -3px"
          : "rgba(0,0,0,0.07) 0px 0.36px 1.23px -1px, rgba(0,0,0,0.07) 0px 1.37px 4.67px -2px, rgba(0,0,0,0.05) 0px 6px 20.4px -3px",
        flex: "1 1 100%",
        width: "100%",
        height: "100%",
        aspectRatio: "1 / 1", // 단독 사용 시 fallback — 그리드가 높이를 주면 무시됨
        overflow: "hidden",
        position: "relative",
        willChange: "transform",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          aspectRatio: "0.94 / 1",
          height: "100%",
          width: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* edge fade so the glow bleeds instead of clipping at the card */}
        <div
          style={{
            aspectRatio: "1 / 1",
            width: "100%",
            maxWidth: 800,
            maskImage:
              "radial-gradient(circle, rgb(0,0,0) 60%, rgba(0,0,0,0) 70%)",
            WebkitMaskImage:
              "radial-gradient(circle, rgb(0,0,0) 60%, rgba(0,0,0,0) 70%)",
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              width: "100%",
              height: "100%",
              cursor: "grab",
              userSelect: "none",
              touchAction: "pan-y",
              contain: "size layout paint",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 12,
          left: 16,
          color: "var(--fg-muted)",
          fontSize: 12,
          lineHeight: "14px",
          whiteSpace: "pre",
        }}
      >
        {label}
      </div>

      {/* city name rises as it passes the front, sinks as it leaves */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 0,
          width: "100%",
          height: 17,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color: "var(--fg-muted)",
            fontSize: 11,
            lineHeight: "13px",
            transition: "opacity 200ms, transform 200ms",
            opacity: activeCity ? 1 : 0,
            transform: activeCity ? "translateY(0)" : "translateY(4px)",
          }}
        >
          {lastShownCity.current}
        </div>
      </div>
    </div>
  );
}
