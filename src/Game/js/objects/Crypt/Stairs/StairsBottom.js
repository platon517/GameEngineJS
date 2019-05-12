import {gc} from "../../../game_config";
import {GameObject} from "../../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../../Engine/Sprite/Sprite";

export const StairsBottom = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/crypt/stairs/stairs_bottom.png",
      { x: 0, y: 0 },
      { w: 64, h: 64 },
      { w: 64 * gc.mult, h: 64 * gc.mult },
    );
    this.sprite.moveTo({x: 32 * gc.mult, y: 32 * gc.mult});

    this.setInit(() => {
      this.render();
      this.setRenderIndex(2);
    });
  }
})();