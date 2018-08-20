export const animation_creator = (x, y, num, dir = 'x') => {
  const frames = [];
  for (let i = 0; i < num; i++) {
    frames.push(
      dir === 'x' ?
        {x: x * i, y: y} : {x: x, y: y * i}
    )
  }
  return frames;
};