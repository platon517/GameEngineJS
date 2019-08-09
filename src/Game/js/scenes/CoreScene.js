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
import { ScoreProgressBar } from "../ui/ScoreProgressBar/ScoreProgressBar";
import { TurnsCounter } from "../ui/TurnsCounter/TurnsCounter";
import { EndLevelPlate } from "../ui/EndLevelPlate/EndLevelPlate";
import {BrushButton} from "../ui/BrushButton/BrushButton";
import {ChangeButton} from "../ui/ChangeButton/ChangeButton";

Camera.moveTo({x: 0, y: 0});

export const GameStates = {
  turns: 45,
  gameOver: false
};

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
  "img/background/room2.png",
  { x: 0, y: 0 },
  { w: 2000, h: 2000 },
  { w: gc.srcSize.h, h: gc.srcSize.h },
  { x: 0, y: 0 },
  { x: (gc.srcSize.w - gc.srcSize.h) / 2, y: 0 }
);

const SCORE_BAR_W = 310;
export const ScoreBar = new ScoreProgressBar(
  {
    w: SCORE_BAR_W * gc.modifer,
    h: SCORE_BAR_W / 6.8 * gc.modifer
  },
  {
    x: (gc.srcSize.w - SCORE_BAR_W * gc.modifer) / 2,
    y: gridOffset.y - SCORE_BAR_W / 6.8 * gc.modifer - 20 * gc.modifer
  }
);

export const Counter = new TurnsCounter(
  {
    x: ScoreBar.getCoords().x,
    y: ScoreBar.getCoords().y - 55 * gc.modifer
  },
  {
    w: 100 * gc.modifer,
    h: 50 * gc.modifer
  },
  GameStates.turns
);

export const EndPlate = new EndLevelPlate(
  {
    x: gc.srcSize.w / 2 - 250 * gc.modifer / 2,
    y: gc.srcSize.h / 2 - 180 * gc.modifer / 2
  },
  {
    w: 250 * gc.modifer,
    h: 180 * gc.modifer
  }
);

ScoreBar.setMaxScore(200);

export const BrushButtonObj = new BrushButton(
  {
    x: ScratchCatButtonObj.getCoords().x + ScratchCatButtonObj.sprite[0].getSize().w + 15 * gc.modifer,
    y: ScratchCatButtonObj.getCoords().y + (ScratchCatButtonObj.sprite[0].getSize().h - 65 * gc.modifer) / 2
  },
  {
    w: 65 * gc.modifer,
    h: 65 * gc.modifer
  }
);

export const ChangeButtonObj = new ChangeButton(
  {
    x: ScratchCatButtonObj.getCoords().x - 80 * gc.modifer,
    y: ScratchCatButtonObj.getCoords().y + (ScratchCatButtonObj.sprite[0].getSize().h - 65 * gc.modifer) / 2
  },
  {
    w: 65 * gc.modifer,
    h: 65 * gc.modifer
  },
  3
);

export const CoreScene = new Scene(128, 128, [
  MainBackground,
  YarnGrid,
  BigYarnBallObj,
  MainCursor,
  Paw,
  ScratchCatObj,
  ScratchCatButtonObj,
  ScoreBar,
  Counter,
  EndPlate,
  BrushButtonObj,
  ChangeButtonObj
], Camera);