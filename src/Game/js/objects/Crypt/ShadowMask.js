import {gc} from "../../game_config";
import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";

export const ShadowMask = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/crypt/shadow/shadow.png",
      { x: 0, y: 0 },
      { w: 128, h: 128 },
      { w: 128 * gc.mult, h: 128 * gc.mult },
    );

    this.setInit(() => {
      this.render();
      this.setRenderIndex(10);
    });
  }
})();