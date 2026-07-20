import { motion } from "framer-motion";
import React, { useState } from "react";

type FigureWrapperProps = {
  children: React.ReactNode;
  rowSpan: number;
};

export const Figure = ({ children, rowSpan }: FigureWrapperProps) => {
  return (
    <figure
      className={`relative lg:row-start-1 lg:row-[var(--row-span)]`}
      style={
        {
          "--row-span": `span ${rowSpan}/ span ${rowSpan}`,
        } as React.CSSProperties
      }
    >
      {children}
    </figure>
  );
};
