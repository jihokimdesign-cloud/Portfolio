import { motion } from "framer-motion";
import React, { createContext, useContext, useEffect, useState } from "react";

const ColorContext = createContext({
  currentColor: "#000",
  currentBackground: "#FFF",
  pushColor: (str: string) => {},
  popColor: () => {},
  pushBackground: (str: string) => {},
  popBackground: () => {},
});

const useColorStack = (initialColor: string) => {
  const [colorStack, setColorStack] = useState([initialColor]);

  const pushColor = (color: string) => {
    setColorStack([...colorStack, color]);
  };
  const popColor = () => {
    if (colorStack.length === 1) return;
    setColorStack(colorStack.slice(0, -1));
  };

  const currentColor = colorStack[colorStack.length - 1];

  return { popColor, pushColor, currentColor };
};

export const ColorShifterContextProvider = ({
  children,
  initialColor,
  initalBackground,
}: any) => {
  const font = useColorStack(initialColor);
  const background = useColorStack(initalBackground);

  return (
    <ColorContext.Provider
      value={{
        currentColor: font.currentColor,
        currentBackground: background.currentColor,
        pushColor: font.pushColor,
        popColor: font.popColor,
        pushBackground: background.pushColor,
        popBackground: background.popColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  return useContext(ColorContext);
};

type Props = {
  color: string;
  background: string;
};
export const ColorShifter = (props: Props) => {
  const {
    pushColor,
    popColor,
    pushBackground,
    popBackground,
    currentBackground,
    currentColor,
  } = useContext(ColorContext);
  const [isOverThreshold, setIsOverThreshold] = useState(false);

  useEffect(() => {
    if (isOverThreshold) {
      pushColor(props.color);
      pushBackground(props.background);
      return;
    }
    popColor();
    popBackground();
  }, [isOverThreshold]);

  const handleViewportEnter = (e: IntersectionObserverEntry | null) => {
    if (!e) return;
    if (e?.boundingClientRect.y > 0) {
      setIsOverThreshold(true);
    }
  };
  const handleViewportLeave = (e: IntersectionObserverEntry | null) => {
    if (!e) return;
    // console.log(e?.boundingClientRect);
    if (e?.boundingClientRect.y > 0) {
      setIsOverThreshold(false);
    }
  };

  return (
    <motion.div
      onViewportEnter={handleViewportEnter}
      onViewportLeave={handleViewportLeave}
    />
  );
};
