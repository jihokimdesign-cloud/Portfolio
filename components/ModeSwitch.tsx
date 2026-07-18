// Day/Night pill toggle — pill container → circular thumb (overflow hidden)
// → sun/moon icon swap. CSS transitions (left) instead of Framer layout
// animation; same result, no dependency.
import React, { useState } from "react";

type Props = {
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled initial (true = dark)
  onChange?: (dark: boolean) => void;
  width?: number; // px; height is width/2
};

export default function ModeSwitch({
  checked,
  defaultChecked = false,
  onChange,
  width = 64,
}: Props) {
  const [internal, setInternal] = useState(defaultChecked);
  const isDark = checked ?? internal;

  const toggle = () => {
    const next = !isDark;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  };

  const tokens = {
    bg: "var(--canvas)",
    border: "var(--hairline)",
    icon: "var(--fg)",
    thumbBg: isDark ? "rgb(40, 40, 40)" : "rgb(255, 255, 255)",
  };

  // container 2:1, 4% padding → thumb 92% tall; left transitions 4% ↔ 50%
  return (
    <div
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      style={{
        width,
        aspectRatio: "2 / 1",
        backgroundColor: tokens.bg,
        border: `1px solid ${tokens.border}`,
        borderRadius: 999,
        boxShadow: isDark
          ? "rgba(0,0,0,0.35) 0px 0.36px 1.23px -1px, rgba(0,0,0,0.35) 0px 1.37px 4.67px -2px, rgba(0,0,0,0.25) 0px 6px 20.4px -3px"
          : "rgba(0,0,0,0.07) 0px 0.36px 1.23px -1px, rgba(0,0,0,0.07) 0px 1.37px 4.67px -2px, rgba(0,0,0,0.05) 0px 6px 20.4px -3px",
        position: "relative",
        cursor: "pointer",
        boxSizing: "border-box",
        transition:
          "background-color 300ms, border-color 300ms, box-shadow 300ms",
        outline: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "4%",
          left: isDark ? "50%" : "4%",
          height: "92%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          backgroundColor: tokens.thumbBg,
          boxShadow: "rgba(0,0,0,0.1) 0px 2px 4px",
          overflow: "hidden",
          transition:
            "left 350ms cubic-bezier(0.34, 1.3, 0.5, 1), background-color 300ms",
        }}
      >
        {/* sun — light mode */}
        <IconLayer visible={!isDark} rotate={isDark ? -90 : 0}>
          <svg viewBox="0 0 24 24" width="60%" height="60%" fill="none">
            <circle cx="12" cy="12" r="4.6" fill={tokens.icon} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              const x1 = 12 + Math.cos(a) * 7.4;
              const y1 = 12 + Math.sin(a) * 7.4;
              const x2 = 12 + Math.cos(a) * 10;
              const y2 = 12 + Math.sin(a) * 10;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tokens.icon}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </IconLayer>

        {/* moon — circle minus circle via mask */}
        <IconLayer visible={isDark} rotate={isDark ? 0 : 90}>
          <svg viewBox="0 0 85 85" width="62%" height="62%">
            <defs>
              <mask id="mode-switch-moon-mask">
                <rect width="85" height="85" fill="white" />
                <circle cx="85" cy="0" r="42.5" fill="black" />
              </mask>
            </defs>
            <circle
              cx="42.5"
              cy="42.5"
              r="42.5"
              fill={tokens.icon}
              mask="url(#mode-switch-moon-mask)"
            />
          </svg>
        </IconLayer>
      </div>
    </div>
  );
}

function IconLayer({
  visible,
  rotate,
  children,
}: {
  visible: boolean;
  rotate: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: `rotate(${rotate}deg)`,
        transition:
          "opacity 250ms, transform 350ms cubic-bezier(0.34, 1.3, 0.5, 1)",
      }}
    >
      {children}
    </div>
  );
}
