import {Walls, WallsTop} from "../objects/Crypt/Walls";
import {Floor} from "../objects/Crypt/Floor";
import {StairsTop} from "../objects/Crypt/Stairs/StairsTop";
import {StairsBottom} from "../objects/Crypt/Stairs/StairsBottom";
import {TorchLeft, TorchRight} from "../objects/Crypt/Torch";
import {ShadowMask} from "../objects/Crypt/ShadowMask";
import {StatueLeft, StatueRight} from "../objects/Crypt/Statues";
import {CoffinClosedLeft, CoffinClosedRight, CoffinOpened} from "../objects/Crypt/Coffin";
import {PlayerCharacter} from "../chars/lich/Lich";
import {Scene} from "../../../Engine/Scene/Scene";
import {Camera} from "../../../Engine/Camera/Camera";
import {StairsColumns} from "../objects/Crypt/Stairs/Columns";

Camera.moveTo({x: 0, y: 0});
Camera.setFrames([[0, 0], [128, 128]]);

export const CoreScene = new Scene(128, 128, [
  Walls,
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
  CoffinClosedLeft,
  CoffinClosedRight,
  CoffinOpened,
  PlayerCharacter,
], Camera);