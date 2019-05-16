import {gc} from "../game_config";

export const isCollides = (selfCoordinates, alienCoordinates) => {

  const left = Math.max(selfCoordinates[0][0], alienCoordinates[0][0]);
  const right = Math.min(selfCoordinates[1][0], alienCoordinates[1][0]);
  const top = Math.max(selfCoordinates[0][1], alienCoordinates[0][1]);
  const bottom = Math.min(selfCoordinates[1][1], alienCoordinates[1][1]);

  const width = right + gc.mult - left;
  const height = bottom + gc.mult - top;

  return !((width < 0) || (height < 0));
};