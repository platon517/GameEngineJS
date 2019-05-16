import {gc} from "../../../game_config";
import {GameObject} from "../../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../../Engine/Sprite/Sprite";

export const StairsTop = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/crypt/stairs/stairs_top.png",
      { x: 0, y: 0 },
      { w: 128, h: 128 },
      { w: 128 * gc.mult, h: 128 * gc.mult },
    );

    this.setInit(() => {
      this.render();
      this.setRenderIndex(8);
    });
  }
})();