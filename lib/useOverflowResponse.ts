import {
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { clamp } from "./clamp";

type ResponseMotionValue = MotionValue<number>;
type ClampedMotionValue = MotionValue<number>;

export default function useOverflowResponse(
  range: {
    begin: number;
    end: number;
  },
  overflowMargin = 50
) {
  const control = useMotionValue(0);
  const responseValue = useSpring(0, { stiffness: 1500, damping: 200 });
  const clamped = useTransform(control, (v) =>
    clamp(v, range.begin, range.end)
  );

  useEffect(() => {
    const cleanup = control.onChange((v) => {
      responseValue.set(v);
    });

    return () => cleanup();
  }, [control]);

  // 0 being no offset
  // - being it is overscall in the negative direction
  // + begin it is overscall in the positive direction
  const overflowOffset = useTransform(responseValue, (v) => {
    if (v < range.begin) {
      return v - range.begin;
    }
    if (v > range.end) {
      return v - range.end;
    }
    return 0;
  });

  const response = useTransform(
    overflowOffset,
    [-overflowMargin, overflowMargin],
    [-1, 1]
  );
  // const response = useTransform(overflowOffset, (v) => console.log(v));

  const snap = () => {
    if (responseValue.get() > control) {
      responseValue.set(range.end);
      return;
    }

    if (responseValue.get() < control) {
      responseValue.set(range.begin);
      return;
    }
  };

  return { control, response, clamped, snap };
}
