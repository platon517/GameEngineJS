const w = window.innerWidth * window.devicePixelRatio;
const h = window.innerHeight * window.devicePixelRatio;

export const gc = {
  originSize: {w: window.innerWidth, h: window.innerHeight},
  srcSize: {w, h},
  mult: 1,
  modifer: window.devicePixelRatio
};
