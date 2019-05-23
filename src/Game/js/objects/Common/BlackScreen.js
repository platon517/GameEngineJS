import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {SquareSprite} from "../../../../Engine/Sprite/Sprite";
import {gc} from "../../game_config";

export const BlackScreen = new (class extends GameObject {
  constructor(){
    super();
    this.sprite = new SquareSprite({w: 128 * gc.mult, h: 128 * gc.mult});
    this.sprite.setAlpha(0);
    this.setInit(() => {
      this.render();
      this.setRenderIndex(99);
    });
  }
});