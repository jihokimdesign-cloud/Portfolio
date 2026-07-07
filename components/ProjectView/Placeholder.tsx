import React from "react";

// An intentional stand-in for a visual that doesn't exist yet.
// Reads as scaffolding, not breakage — and doubles as a shot list:
// `label` names the figure, `note` describes exactly what to shoot/export.
type Props = {
  label: string; // e.g. "Fig 5 — WoZ session"
  note: string; // what the visual should show
  aspect?: string; // CSS aspect-ratio, e.g. "16/9", "4/3", "1/1"
  wide?: boolean; // span the full content grid like LayoutFull children
};

const Placeholder = ({ label, note, aspect = "16/9", wide }: Props) => {
  return (
    <div
      className={
        wide
          ? "col-span-full mt-16 mb-8"
          : "col-span-full md:col-start-2 md:col-span-4 mt-16 mb-8"
      }
    >
      <div
        className="relative rounded-xl border-2 border-dashed border-current flex flex-col items-center justify-center text-center px-8 opacity-60"
        style={{ aspectRatio: aspect }}
      >
        <div className="text-xs font-bold uppercase tracking-[.14em] opacity-60">
          Visual to come
        </div>
        <div className="mt-3 md:text-lg leading-snug max-w-[36ch]">{label}</div>
        <div className="mt-2 text-sm opacity-60 leading-snug max-w-[44ch]">
          {note}
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
