import {gc} from "../../game_config";
import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";

export const Walls = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/crypt/walls/wall.png",
      { x: 0, y: 0 },
      { w: 128, h: 128 },
      { w: 128 * gc.mult, h: 128 * gc.mult },
    );

    this.setInit(() => {
      this.render();
      this.setRenderIndex(1);
    });
  }
})();

export const WallsTop = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/crypt/walls/top_wall.png",
      { x: 0, y: 0 },
      { w: 128, h: 128 },
      { w: 128 * gc.mult, h: 128 * gc.mult },
    );

    this.setInit(() => {
      this.render();
      this.setRenderIndex(5);
    });
  }
})();