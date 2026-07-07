import { useMemo } from "react";

type CaptionProps = {
  label?: string;
  text?: string;
  title?: string;
  wideSpacing?: boolean;
  overlay?: boolean;
  topPadding?: boolean;
};

export const Caption = ({
  label,
  text,
  title,
  wideSpacing,
  overlay = true,
  topPadding = false,
}: CaptionProps) => {
  const labelSpacing = wideSpacing
    ? "w-[14vw] lg:w-[13vw] 2xl:w-[14vw] opacity-60"
    : "w-[14vw] lg:w-[7vw] 2xl:w-[7vw] opacity-60";

  const layout = useMemo(() => {
    if (overlay) {
      return "lg:absolute mt-3";
    }
    if (topPadding) {
      return "md:col-start-1 row-start-1 md:row-start-auto mt-4";
    }
    return "md:col-start-1 row-start-1 md:row-start-auto";
  }, [topPadding, overlay]);

  return (
    <figcaption
      className={`${layout} ${
        wideSpacing ? `flex flex-row xl:grid xl:grid-cols-6` : `flex flex-row`
      } gap-4 text-sm leading-5 tracking-normal top-0 mb-6 w-full`}
    >
      {/* one column around 7vw */}
      {label && (
        <div className={`${labelSpacing} ${overlay && "lg:ml-5"}`}>{label}</div>
      )}
      <div
        className={`w-full ${
          wideSpacing && "xl:col-span-2"
        } max-w-[70vw] sm:max-w-[49vw] lg:max-w-[40vw] 2xl:max-w-[21vw]`}
      >
        {title && <div className={`opacity-80 mb-1`}>{title}</div>}
        {text && <div className={`opacity-60`}>{text}</div>}
      </div>
    </figcaption>
  );
};
