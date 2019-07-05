import {Scene} from "../../../Engine/Scene/Scene";
import {Camera} from "../../../Engine/Camera/Camera";

import { YarnGrid } from "../objects/Grid/Grid";
import { MainCursor } from "../objects/Cursor/Cursor";
import {BigYarnBallObj} from "../objects/BigYarnBall/BigYarnBall";
import { Paw } from "../objects/PawCollector/PawCollector";

Camera.moveTo({x: 0, y: 0});
Camera.setFrames([[0, 0], [128, 128]]);


export const CoreScene = new Scene(128, 128, [
  YarnGrid,
  BigYarnBallObj,
  MainCursor,
  Paw
], Camera);