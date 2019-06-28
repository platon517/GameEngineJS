const w = 1280;
const h = 2000;

const modifer = 4;

export const gc = {
  originSize: {w: w / modifer, h: h / modifer},
  srcSize: {w, h},
  mult: window.innerWidth / (w / modifer),
};