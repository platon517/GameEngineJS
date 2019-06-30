import {Scene} from "../../../Engine/Scene/Scene";
import {Camera} from "../../../Engine/Camera/Camera";

import { YarnGrid } from "../objects/Grid/Grid";
import { MainCursor } from "../objects/Cursor/Cursor";
import {BigYarnBallObj} from "../objects/BigYarnBall/BigYarnBall";

Camera.moveTo({x: 0, y: 0});
Camera.setFrames([[0, 0], [128, 128]]);

/*export const EyeWatcherLeft = new EvilEye(true, {x: 34 * gc.mult, y: 86 * gc.mult});
export const EyeWatcherRight = new EvilEye(false, {x: 79 * gc.mult, y: 86 * gc.mult});*/

export const CoreScene = new Scene(128, 128, [
  /*Walls,
  WallsTop,
  Floor,
  StairsTop,
  StairsBottom,
  StairsColumns,
  TorchLeft,
  TorchRight,
  ShadowMask,
  StatueLeft,
  StatueRight,
  CoffinOpened,
  EyeWatcherLeft,
  EyeWatcherRight,
  PlayerCharacter,
  HideCollider,
  BlackScreen,*/
  YarnGrid,
  BigYarnBallObj,
  MainCursor
], Camera);