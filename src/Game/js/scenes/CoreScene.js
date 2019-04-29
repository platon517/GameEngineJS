import {BackGround} from "../objects/BackGround";
import {MenuButton} from "../objects/MenuButton";
import {PlayerPlate} from "../objects/PlayerPlate";
import {Folder} from "../objects/Folder";
import {IslandOne, IslandTwo, IslandThreeOne, IslandThreeTwo} from "../objects/Islands/Islands";
import {ReadyButton} from "../objects/ReadyButton";

export const CoreScene = () => {
  BackGround.init();
  MenuButton.init();
  PlayerPlate.init();
  Folder.init();
  IslandOne.init();
  IslandTwo.init();
  IslandThreeOne.init();
  IslandThreeTwo.init();
  ReadyButton.init();
};