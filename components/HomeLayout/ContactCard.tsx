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

      {/* 우상단 화살표 — hover 시 대각선으로 살짝 이동 */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
          transition: "transform 200ms ease",
        }}
      >
        <path
          d="M7 17 17 7 M9 7h8v8"
          stroke="var(--fg-muted)"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 사진 — 카드 하단에서 떠오름. 기본: 살짝 가라앉은 채 블러,
          hover: photoLift만큼 상승하며 초점이 맞음 */}
      {image ? (
        <div
          style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            bottom: 0,
            height: "58%",
            borderRadius: "10px 10px 0 0",
            overflow: "hidden",
            transform: hovered ? "translateY(0)" : `translateY(${photoLift}px)`,
            transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: "rgba(0,0,0,0.12) 0px -4px 16px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
              filter: hovered ? "blur(0px)" : `blur(${blurAmount}px)`,
              transform: hovered ? "scale(1)" : "scale(1.05)",
              transition: "filter 300ms ease, transform 400ms ease",
              userSelect: "none",
            }}
          />
        </div>
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
