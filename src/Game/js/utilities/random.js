import {gc} from "../game_config";

export const getRandom = (min, max) => {
  return (Math.floor(Math.random() * (max - min)) + min) * gc.mult;
};