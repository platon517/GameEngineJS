export const animation_creator = (x, y, num, dir = 'x', startFrame = 0) => {
  const frames = [];
  for (let i = 0; i < num; i++) {
    frames.push(

      dir === 'x' || dir === '-x' ?
        dir === 'x' ? {x: startFrame + x * i, y: y} : {x: startFrame - x * i, y: y}
        :
        dir === 'y' ?  {x: x, y: startFrame + y * i} : {x: x, y: startFrame - y * i}
    )
  }
  return frames;
};