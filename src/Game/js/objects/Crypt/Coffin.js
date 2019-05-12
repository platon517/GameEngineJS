import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";

class Coffin extends GameObject {
  constructor(coords, open = false){
    super();
    this.sprite = new Sprite(
      open ? "img/crypt/grob/grob-dark.png" : "img/crypt/grob/grob-closed.png",
      { x: 0, y: 0 },
      { w: 32, h: 32 },
      { w: 32 * gc.mult, h: 32 * gc.mult },
    );

    this.sprite.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(4);
    });
  }
}

export const CoffinClosedLeft = new Coffin({x: 16 * gc.mult, y: 96 * gc.mult});
export const CoffinClosedRight = new Coffin({x: 80 * gc.mult, y: 96 * gc.mult});
export const CoffinOpened = new Coffin({x: 48 * gc.mult, y: 96 * gc.mult}, true);