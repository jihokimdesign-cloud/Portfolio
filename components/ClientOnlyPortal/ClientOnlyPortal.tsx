import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  selector: string;
};

export default function ClientOnlyPortal({ children, selector }: Props) {
  const ref = useRef() as MutableRefObject<HTMLElement>;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector) as HTMLElement;
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current) : null;
}
