// Day/Night pill toggle — pill container → circular thumb (overflow hidden)
// → sun/moon icon swap. CSS transitions (left) instead of Framer layout
// animation; same result, no dependency.
import React, { useState } from "react";

type Props = {
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled initial (true = dark)
  onChange?: (dark: boolean) => void;
  width?: number | string; // px 또는 "100%" — height는 항상 width/2 (2:1)
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

  // 라이트: 민무늬 오렌지 점(#F97030, 글로브 마커와 동일).
  // 다크: 배경 원 없이 달만 크게.
  const tokens = {
    bg: "var(--canvas)",
    border: "var(--hairline)",
    icon: "var(--fg)",
    thumbBg: isDark ? "transparent" : "#F97030",
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
          boxShadow: isDark ? "none" : "rgba(0,0,0,0.1) 0px 2px 4px",
          overflow: "hidden",
          transition:
            "left 350ms cubic-bezier(0.34, 1.3, 0.5, 1), background-color 300ms",
        }}
      >
        {/* moon — circle minus circle via mask; 라이트 모드에선 오렌지 점만 */}
        <IconLayer visible={isDark} rotate={isDark ? 0 : 90}>
          <svg viewBox="0 0 85 85" width="92%" height="92%">
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
