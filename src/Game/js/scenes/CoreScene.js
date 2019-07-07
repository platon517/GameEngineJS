import {Scene} from "../../../Engine/Scene/Scene";
import {Camera} from "../../../Engine/Camera/Camera";

import {Grid} from "../objects/Grid/Grid";
import {Cursor} from "../objects/Cursor/Cursor";
import {BigYarnBall} from "../objects/BigYarnBall/BigYarnBall";
import {PawCollector} from "../objects/PawCollector/PawCollector";
import {ScratchCat} from "../objects/ScratchCat/ScratchCat";
import {BALL_SIZE, BLUE} from "../objects/YarnBall/YarnBall";
import {GRID_SIZE} from "../objects/Grid/gridSize";
import {gc} from "../game_config";

Camera.moveTo({x: 0, y: 0});
Camera.setFrames([[0, 0], [128, 128]]);

const gridOffset = {
  x: (gc.srcSize.w - BALL_SIZE * GRID_SIZE ) / 2,
  y: (gc.srcSize.h - BALL_SIZE * GRID_SIZE ) - 200
};

export const YarnGrid = new Grid(gridOffset, GRID_SIZE);

export const MainCursor = new Cursor({x:0, y:0});

export const BigYarnBallObj = new BigYarnBall({x: 0, y: 0}, BLUE);

export const Paw = new PawCollector({ x: gc.srcSize.w, y: -375 });

export const ScratchCatObj = new ScratchCat({ x: 0, y: 0 });

export const CoreScene = new Scene(128, 128, [
  YarnGrid,
  BigYarnBallObj,
  MainCursor,
  Paw,
  ScratchCatObj
], Camera);