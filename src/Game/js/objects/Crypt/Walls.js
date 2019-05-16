import {gc} from "../../game_config";
import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {ColliderGroup} from "../../../../Engine/Collider/Collider";
import {BLOCK, PlayerCharacter} from "../../chars/lich/Lich";

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
    this.collider = new ColliderGroup([
      [{x: 0, y: 0}, {w: 48 * gc.mult, h: 78 * gc.mult}, {x: 0, y: 0}],
      [{x: 0, y: 0}, {w: 48 * gc.mult, h: 78 * gc.mult}, {x: 80 * gc.mult, y: 0}],
      [{x: 0, y: 0}, {w: 2 * gc.mult, h: 50 * gc.mult}, {x: 0, y: 78 * gc.mult}],
      [{x: 0, y: 0}, {w: 2 * gc.mult, h: 50 * gc.mult}, {x: 126 * gc.mult, y: 78 * gc.mult}],
      [{x: 0, y: 0}, {w: 128 * gc.mult, h: 2 * gc.mult}, {x: 0, y: 126 * gc.mult}],
    ]);
    this.collider.addInteractionObject(PlayerCharacter);
    this.collider.setType(BLOCK);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(8);
    });
  }
})();