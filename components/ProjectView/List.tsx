import React from "react";
import { paragraphLayout } from "./Typography";

type ListProps = {
  children: React.ReactNode;
};

export const List = ({ children }: ListProps) => {
  return <ul className={paragraphLayout + " opacity-60"}>{children}</ul>;
};

type ListItemProps = {
  children: any;
  label: string;
};

export const ListItem = ({ children, label }: ListItemProps) => {
  return (
    <li className="flex flex-row mt-[1.1em] leading-[1.16em]">
      <div className="block w-[21vw] md:w-[7vw]">{label}</div>
      <div className="block w-full">
        {typeof children === "string" ? children : children.props.children}
      </div>
    </li>
  );
};
