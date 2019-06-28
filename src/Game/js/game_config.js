export const modifer = 4;

const w = window.innerWidth * modifer;
const h = innerHeight * modifer;

export const gc = {
  originSize: {w: w / modifer, h: h / modifer},
  srcSize: {w, h},
  mult: window.innerWidth / (w / modifer),
};