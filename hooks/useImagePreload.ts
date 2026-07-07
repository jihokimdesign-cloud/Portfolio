import { useEffect, useState } from "react";

export function useImagePreload(sources: string[]) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!sources || sources.length === 0) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    let loadedCount = 0;
    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === sources.length) setIsLoaded(true);
    };

    sources.forEach((src) => {
      const elm = document.createElement("img") as HTMLImageElement;
      elm.src = src;
      elm.addEventListener("load", handleLoad);
    });
  }, [sources]);

  return isLoaded;
}
