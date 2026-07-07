import React from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";

type Props = {
  src: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
};

const FullImage = ({ src, width, height, caption, priority }: Props) => {
  return (
    <div className="min-h-[70vh] col-start-1 col-span-full relative z-10">
      <motion.div
        className="absolute md:relative -left-6 -right-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
      >
        <NextImage
          className="block w-[100vw] min-h-[70vh] object-cover"
          priority={priority}
          src={src}
          width={width}
          height={height}
          alt={caption ? caption : ""}
        />
      </motion.div>
    </div>
  );
};

export default FullImage;
