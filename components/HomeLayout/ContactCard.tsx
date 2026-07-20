// 컨택트 카드 — 텍스트(이메일 포함)는 항상 보이고,
// hover 시 하단의 흐릿한 사진이 떠오르며(translateY) 초점이 맞는(blur→0) 구조.
// GlobeCard·ModeSwitch와 같은 토큰/섀도 체계 — 테마는 CSS 변수가 알아서 따라감.
import * as React from "react";
import { useState } from "react";
import { SITE } from "../../lib/constants";

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';

type Props = {
  image?: string;
  label?: string;
  heading?: string;
  email?: string; // 항상 표시. 클릭 시 mailto
  location?: string; // 보조 정보 한 줄. 비우면 숨김
  blurAmount?: number; // 사진 기본 블러(px)
  hoverBlur?: number; // hover 시에도 남기는 블러(px) — 완전히 선명해지지 않는다
  photoLift?: number; // hover 시 사진이 떠오르는 거리(px)
  style?: React.CSSProperties;
};

export default function ContactCard({
  image = "/contact-card-photo.jpg",
  label = "Contact",
  heading = "Let’s talk",
  email = SITE.email,
  location = "Seattle, WA · PST",
  blurAmount = 8,
  hoverBlur = 3,
  photoLift = 24,
  style,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`mailto:${email}`}
      aria-label={`Email ${email}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 18,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        textDecoration: "none",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* 좌상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 18,
          zIndex: 1,
          color: "var(--fg-muted)",
          fontSize: 13,
          lineHeight: "15px",
          whiteSpace: "pre",
        }}
      >
        {label}
      </div>

      {/* 텍스트 블록 — 항상 표시 */}
      <div
        style={{
          padding: "48px 18px 0",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: TITLE_FONT,
            color: "var(--title)",
            fontSize: 20,
            lineHeight: "26px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </div>
        {/* 이메일 — 항상 보임. hover 시 밑줄만 */}
        <div
          style={{
            color: "var(--fg-secondary)",
            fontSize: 13,
            lineHeight: "18px",
            textDecoration: hovered ? "underline" : "none",
            textUnderlineOffset: 3,
          }}
        >
          {email}
        </div>
        {location ? (
          <div
            style={{
              color: "var(--fg-muted)",
              fontSize: 11,
              lineHeight: "14px",
            }}
          >
            {location}
          </div>
        ) : null}
      </div>

      {/* 우상단 화살표 — HUGE. hover 시 대각선으로 살짝 이동 */}
      <svg
        viewBox="0 0 48 48"
        width="72"
        height="72"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          color: "var(--fg-muted)",
          transform: hovered ? "translate(4px, -4px)" : "translate(0, 0)",
          transition: "transform 200ms ease",
        }}
      >
        <path
          d="M38.9127 6.09229H17.2853C16.733 6.09229 16.2853 6.54 16.2853 7.09229V11.076C16.2853 11.6346 16.7429 12.0849 17.3014 12.0759L31.9248 11.84L7.09298 36.6694C6.70242 37.06 6.7024 37.6932 7.09294 38.0837L9.9213 40.9121C10.3118 41.3026 10.945 41.3026 11.3356 40.912L36.1648 16.08L35.9291 30.7036C35.9201 31.2621 36.3704 31.7197 36.929 31.7197H40.9127C41.465 31.7197 41.9127 31.272 41.9127 30.7197V9.09229C41.9127 7.43543 40.5696 6.09229 38.9127 6.09229Z"
          fill="currentColor"
        />
      </svg>

      {/* 사진 — 카드 전체 배경. 기본 블러, hover 시 살짝 초점 */}
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              filter: hovered
                ? `blur(${hoverBlur}px)`
                : `blur(${blurAmount}px)`,
              transform: hovered ? "scale(1.06)" : "scale(1.1)",
              transition: "filter 300ms ease, transform 500ms ease",
              userSelect: "none",
            }}
          />
          {/* 텍스트 가독용 스크림 — 상단은 서피스색, 하단으로 투명 */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background:
                "linear-gradient(180deg, var(--surface) 0%, color-mix(in srgb, var(--surface) 78%, transparent) 28%, color-mix(in srgb, var(--surface) 30%, transparent) 60%, transparent 100%)",
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            bottom: 0,
            height: "58%",
            borderRadius: "10px 10px 0 0",
            border: "1px dashed var(--hairline)",
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--fg-muted)",
            fontSize: 12,
          }}
        >
          Photo coming soon
        </div>
      )}
    </a>
  );
}
