import React, { createContext, useContext, useState } from "react";

type Props = { children: React.ReactNode };

const HomeScrollPositionContext = createContext({
  scrollY: 0,
  setScrollY: (amount: number) => {},
});

export const HomeScrollPositionContextProvider = (props: Props) => {
  const [scrollPos, setScrollPos] = useState(0);

  return (
    <HomeScrollPositionContext.Provider
      value={{ scrollY: scrollPos, setScrollY: setScrollPos }}
    >
      {props.children}
    </HomeScrollPositionContext.Provider>
  );
};

export const useHomeScrollPosition = () =>
  useContext(HomeScrollPositionContext);
