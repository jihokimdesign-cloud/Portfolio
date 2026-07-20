import React, {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";

export interface CardBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface PageTransitionInfo {
  prevCardRef: MutableRefObject<HTMLDivElement | HTMLAnchorElement | undefined>;
}

const PageTransitionContext = createContext<PageTransitionInfo>({
  prevCardRef: { current: undefined },
});

type Props = {
  children: React.ReactNode;
};

export const PageTransitionProvider = ({ children }: Props) => {
  const prevCardRef = useRef() as MutableRefObject<HTMLDivElement>;

  return (
    <PageTransitionContext.Provider
      value={{
        prevCardRef,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => useContext(PageTransitionContext);
