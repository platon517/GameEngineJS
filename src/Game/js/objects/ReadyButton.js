import { readyPressFunction, readyState } from "../scripts/readyStage";
import { selectedIsland } from "../scripts/islandClick";
import { gc } from "../game_config";
import { local, READY } from "../../localization/localization";
import {
  IslandOne,
  IslandTwo,
  IslandThreeOne,
  IslandThreeTwo
} from "./Islands/Islands";
import { GameObject } from "./GameObject";
import { PIXEL_FONT, Text } from "../../../Engine/Text/Text";
import { Sprite } from "../../../Engine/Sprite/Sprite";
import { Collider } from "../../../Engine/Collider/Collider";

export const ReadyButton = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/ready-block/ready-block.png",
      { x: 0, y: 0 },
      { w: 45, h: 60 },
      { w: 45 * gc.mult, h: 60 * gc.mult }
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 39 * gc.mult, h: 24 * gc.mult },
      { x: 3 * gc.mult, y: 27 * gc.mult }
    );

    const rightPadding = local === "RU" ? 9 : 11;

    const readyText = new Text(READY[local], PIXEL_FONT, 7 * gc.mult, "white", {
      x: rightPadding * gc.mult,
      y: 13 * gc.mult
    });

    readyText.hide();

    this.ui.push(readyText);

    this.collider.setClick(() => {
      if (selectedIsland !== null) {
        readyPressFunction([
          IslandOne,
          IslandTwo,
          IslandThreeOne,
          IslandThreeTwo
        ]);
        readyState.isPlayerReady ? readyText.show() : readyText.hide();
        this.sprite.changeNowState({
          x: readyState.isPlayerReady ? 45 : 0,
          y: 0
        });
      } else {
        console.log("select island");
      }
    });

    this.moveTo({ x: 50 * gc.mult, y: 94 * gc.mult });
    this.setInit(() => this.render());
  }
})();
