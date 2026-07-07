import React, { useCallback, useRef, useState } from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

type Props = {
  before: string;
  after: string;
  width: number;
  height: number;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
};

const BeforeAfter = ({
  before,
  after,
  width,
  height,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const percent = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(97, Math.max(3, percent)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setHasInteracted(true);
    updatePosition(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };
  const endDrag = () => setIsDragging(false);

  return (
    <div className="md:col-start-2 col-span-full mt-16">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl select-none cursor-ew-resize touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <NextImage
          src={before}
          width={width}
          height={height}
          alt={beforeLabel}
          className="w-full object-cover pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <NextImage
            src={after}
            width={width}
            height={height}
            alt={afterLabel}
            className="w-full object-cover"
          />
        </div>
        {/* divider */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 -translate-x-1/2 w-[2px] bg-white/90" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-black text-xs tracking-tight">
            ⇄
          </div>
        </div>
        {/* labels */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white pointer-events-none">
          {afterLabel}
        </div>
        {/* hint */}
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white pointer-events-none"
          animate={{ opacity: hasInteracted ? 0 : 1 }}
          transition={{
            duration: AnimationConfig.NORMAL,
            ease: AnimationConfig.EASING,
          }}
        >
          drag to compare
        </motion.div>
      </div>
      {caption && (
        <div className="text-sm opacity-60 mt-3 max-w-[50ch]">{caption}</div>
      )}
    </div>
  );
};

export default BeforeAfter;
