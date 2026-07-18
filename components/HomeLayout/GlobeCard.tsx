// Cobe globe card — card (tokens) → edge-fade mask div → canvas + a label
// synced to rotation. Cities surface their name as they pass the front.
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

type City = { name: string; lat: number; lng: number; size?: number };

const CITIES: City[] = [
  { name: "Seattle", lat: 47.61, lng: -122.33, size: 0.1 },
  { name: "Seoul", lat: 37.57, lng: 126.98, size: 0.08 },
  { name: "Tokyo", lat: 35.68, lng: 139.69, size: 0.07 },
  { name: "New York", lat: 40.71, lng: -74.01, size: 0.07 },
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
  markerColor = [0, 0.44, 0.89], // DESIGN.md primary #0071e3
  rotateSpeed = 0.004,
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

    let width = 0;
    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    let currentFacing: string | null = null;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 1.2 : 3,
      mapSamples: 16000,
      mapBrightness: isDark ? 6 : 1.2,
      baseColor: isDark ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markerColor,
      glowColor: isDark ? [0.6, 0.6, 0.6] : [1, 1, 1],
      markers: CITIES.map((c) => ({
        location: [c.lat, c.lng],
        size: c.size ?? 0.07,
      })),
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

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
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
        borderRadius: 18,
        width: "100%",
        height: "100%",
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
          width: "85%",
          height: "100%",
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
          top: 14,
          left: 18,
          color: "var(--fg-muted)",
          fontSize: 13,
          lineHeight: "15px",
          whiteSpace: "pre",
        }}
      >
        {label}
      </div>

      {/* city name rises as it passes the front, sinks as it leaves */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 0,
          width: "100%",
          height: 17,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color: "var(--fg-muted)",
            fontSize: 12,
            lineHeight: "14px",
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
