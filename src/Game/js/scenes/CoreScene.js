import {Walls, WallsTop} from "../objects/Crypt/Walls";
import {Floor} from "../objects/Crypt/Floor";
import {StairsTop} from "../objects/Crypt/Stairs/StairsTop";
import {StairsBottom} from "../objects/Crypt/Stairs/StairsBottom";
import {TorchLeft, TorchRight} from "../objects/Crypt/Torch";
import {ShadowMask} from "../objects/Crypt/ShadowMask";
import {StatueLeft, StatueRight} from "../objects/Crypt/Statues";
import {CoffinClosedLeft, CoffinClosedRight, CoffinOpened} from "../objects/Crypt/Coffin";
import {PlayerCharacter} from "../chars/lich/Lich";

export const CoreScene = () => {
  const objects = [
    Walls,
    WallsTop,
    Floor,
    StairsTop,
    StairsBottom,
    TorchLeft,
    TorchRight,
    ShadowMask,
    StatueLeft,
    StatueRight,
    CoffinClosedLeft,
    CoffinClosedRight,
    CoffinOpened,
    PlayerCharacter
  ];
  objects.forEach(object => object.init());
};