import {Scene} from "../../../Engine/Scene/Scene";
import {Camera} from "../../../Engine/Camera/Camera";

import { BORDER, Grid } from "../objects/Grid/Grid";
import {Cursor} from "../objects/Cursor/Cursor";
import {BigYarnBall} from "../objects/BigYarnBall/BigYarnBall";
import {PawCollector} from "../objects/PawCollector/PawCollector";
import {ScratchCat} from "../objects/ScratchCat/ScratchCat";
import {BALL_SIZE, BLUE} from "../objects/YarnBall/YarnBall";
import {GRID_SIZE} from "../objects/Grid/gridSize";
import {gc} from "../game_config";
import { Background } from "../objects/Background/Background";
import { ScratchCatButton } from "../ui/ScratchCatButton/ScratchCatButton";

Camera.moveTo({x: 0, y: 0});
Camera.setFrames([[0, 0], [128, 128]]);

const gridOffset = {
  x: (gc.srcSize.w - BALL_SIZE * GRID_SIZE ) / 2,
  y: (gc.srcSize.h - BALL_SIZE * GRID_SIZE ) - 100 * gc.modifer
};

export const YarnGrid = new Grid(gridOffset, GRID_SIZE);

export const MainCursor = new Cursor({x:0, y:0});

export const BigYarnBallObj = new BigYarnBall({x: 0, y: 0}, BLUE);

export const Paw = new PawCollector({ x: gc.srcSize.w, y: -375 });

export const ScratchCatObj = new ScratchCat({ x: 0, y: 0 });

const ScratchCatButtonParams = {
  w: 130 * gc.modifer,
  h: 76 * gc.modifer,
};

const gridLastY = gridOffset.y + BALL_SIZE * GRID_SIZE + BORDER;
export const ScratchCatButtonObj =
  new ScratchCatButton(
    {w: ScratchCatButtonParams.w, h: ScratchCatButtonParams.h},
    {
      x: gc.srcSize.w / 2 - ScratchCatButtonParams.w / 2,
      y: gridLastY + (gc.srcSize.h - gridLastY) / 2 - ScratchCatButtonParams.h / 2
    }
  );

export const MainBackground = new Background(
  "../../img/background/room2.png",
  { x: 0, y: 0 },
  { w: 2000, h: 2000 },
  { w: gc.srcSize.h, h: gc.srcSize.h },
  { x: 0, y: 0 },
  { x: (gc.srcSize.w - gc.srcSize.h) / 2, y: 0 }
);

export const CoreScene = new Scene(128, 128, [
  MainBackground,
  YarnGrid,
  BigYarnBallObj,
  MainCursor,
  Paw,
  ScratchCatObj,
  ScratchCatButtonObj
], Camera);