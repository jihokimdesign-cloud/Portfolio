export default function fluidFont(
  minWidth: number = 360,
  maxWidth: number = 1260,
  minFontSize: number,
  maxFontSize: number
) {
  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minFontSize;

  const clampFunc = `clamp(${minFontSize}rem,${yAxisIntersection.toFixed(
    4
  )}rem+${(slope * 100).toFixed(4)}vw,${maxFontSize}rem);`;
  return clampFunc;
}
