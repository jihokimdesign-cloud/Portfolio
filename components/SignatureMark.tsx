import { useCallback, useEffect, useRef } from "react";

// Jiho's handwritten signature (j → i → h → o, one stroke + two dots),
// draw-on animated. currentColor throughout, so it follows the parent's
// text color. Plays on mount; hover replays.
const CONFIG = {
  speedPxPerMs: 1 / 3.0, // stroke speed (higher = faster)
  startDelay: 150,
  dotDelay: 150, // stroke end -> first dot
  dotStagger: 180, // between dots
  dotPop: 260, // dot scale-in duration
};

export default function SignatureMark({ height = 24 }: { height?: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dot1Ref = useRef<SVGCircleElement>(null);
  const dot2Ref = useRef<SVGCircleElement>(null);
  const playing = useRef(false);

  const play = useCallback(() => {
    const main = pathRef.current;
    const dots = [dot1Ref.current, dot2Ref.current].filter(
      Boolean
    ) as SVGCircleElement[];
    if (!main || playing.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    playing.current = true;

    const len = main.getTotalLength();
    main.style.transition = "none";
    main.style.strokeDasharray = `${len}`;
    main.style.strokeDashoffset = `${len}`;
    dots.forEach((d) => {
      d.style.transition = "none";
      d.style.transform = "scale(0)";
    });
    main.getBoundingClientRect(); // force reflow

    const dur = len / CONFIG.speedPxPerMs;
    setTimeout(() => {
      main.style.transition = `stroke-dashoffset ${dur}ms ease-in-out`;
      main.style.strokeDashoffset = "0";
    }, CONFIG.startDelay);
    dots.forEach((d, i) => {
      setTimeout(() => {
        d.style.transition = `transform ${CONFIG.dotPop}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        d.style.transform = "scale(1)";
        if (i === dots.length - 1) {
          setTimeout(() => {
            playing.current = false;
          }, CONFIG.dotPop);
        }
      }, CONFIG.startDelay + dur + CONFIG.dotDelay + i * CONFIG.dotStagger);
    });
  }, []);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <svg
      viewBox="150 40 400 210"
      style={{ height, width: "auto", display: "block" }}
      aria-hidden
      onMouseEnter={play}
    >
      {/* 14° slant; translate compensates for the skew shift */}
      <g
        transform="translate(37 0) skewX(-14)"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          ref={pathRef}
          d="M 230 150 C 242 138, 256 128, 268 124 C 272 122, 276 124, 275 132 C 273 148, 271 162, 270 176 C 268 202, 264 222, 246 226 C 230 229, 224 214, 234 202 C 244 190, 264 176, 284 166 C 294 160, 302 150, 306 142 C 308 148, 306 158, 307 170 C 308 174, 310 174, 312 170 C 320 148, 332 108, 340 82 C 344 68, 352 62, 354 72 C 357 88, 346 134, 342 160 C 341 166, 341 172, 343 172 C 349 158, 361 144, 372 145 C 382 146, 383 158, 380 170 C 379 174, 381 176, 384 172 C 390 160, 402 148, 414 148 C 428 149, 432 160, 426 168 C 419 177, 403 176, 400 166 C 398 158, 406 150, 416 149 C 426 149, 436 156, 446 162"
        />
        <circle
          ref={dot1Ref}
          cx="282"
          cy="100"
          r="9"
          fill="currentColor"
          stroke="none"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <circle
          ref={dot2Ref}
          cx="314"
          cy="118"
          r="9"
          fill="currentColor"
          stroke="none"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </g>
    </svg>
  );
}
