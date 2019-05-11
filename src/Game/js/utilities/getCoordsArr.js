export const getCoordsArr = data => {
  const { coords, offset, size } = data;
  const x1y1 = [coords.x + offset.x, coords.y + offset.y];
  const x2y2 = [coords.x + offset.x + size.w, coords.y + offset.y + size.h];
  return [x1y1, x2y2];
};