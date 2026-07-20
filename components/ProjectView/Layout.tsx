import React from "react";

type Props = {
  children: React.ReactNode;
  grid?: string;
  extraMargin?: boolean;
};

export const LayoutFull = ({ children, grid, extraMargin }: Props) => {
  const gridTemplateStringArr =
    grid && grid.split("/").map((str) => str.trim() + "fr");

  const gridTemplateString = gridTemplateStringArr
    ? gridTemplateStringArr.join(" ")
    : "1fr";

  return (
    <div
      className={`col-start-1 col-span-full grid gap-2 lg:grid-cols-[var(--gridColumnSetup)]  ${
        extraMargin ? "mt-16" : "mt-2"
      }`}
      style={
        {
          "--gridColumnSetup": gridTemplateString,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

// grid = 1/2
export const LayoutMainContent = ({ children, grid, extraMargin }: Props) => {
  const gridTemplateStringArr =
    grid && grid.split("/").map((str) => str.trim() + "fr");

  const gridTemplateString = gridTemplateStringArr
    ? gridTemplateStringArr.join(" ")
    : "1fr";

  return (
    <div
      className={`md:col-start-2 col-span-full grid gap-2 lg:grid-cols-[var(--gridColumnSetup)] ${
        extraMargin ? "mt-16" : "mt-2"
      }`}
      style={
        {
          "--gridColumnSetup": gridTemplateString,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export const Spacer = () => <div className="h-64 col-span-full" />;
