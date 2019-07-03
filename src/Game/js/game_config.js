const w = window.screen.width * window.devicePixelRatio;
const h = window.screen.height * window.devicePixelRatio;

export const gc = {
  originSize: {w: window.screen.width, h: window.screen.height},
  srcSize: {w, h},
  mult: 1,
  modifer: window.devicePixelRatio
};

console.log(window.screen.width);