import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { gc } from "../../game_config";
import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Collider } from "../../../../Engine/Collider/Collider";
import { islandClick } from "../../scripts/islandClick";
import { CursorObject } from "../Cursor";

import {CLICK} from "../Cursor";

export const IslandOne = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/islands/1/island-1.png",
      { x: 0, y: 0 },
      { w: 96, h: 96 },
      { w: 96 * gc.mult, h: 96 * gc.mult }
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 40 * gc.mult, h: 60 * gc.mult },
      { x: 26 * gc.mult, y: 18 * gc.mult }
    );

    this.collider.addInteractionObject(CursorObject);

    this.collider.setEvent(CLICK, () => {
      islandClick(this);
    });

    this.name = "left";

    this.moveTo({ x: -6 * gc.mult, y: -13 * gc.mult });

    this.setInit(() => {
      this.render();
    });
  }
})();

export const IslandTwo = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/islands/2/island-2.png",
      { x: 0, y: 0 },
      { w: 96, h: 96 },
      { w: 96 * gc.mult, h: 96 * gc.mult }
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 32 * gc.mult, h: 50 * gc.mult },
      { x: 32 * gc.mult, y: 22 * gc.mult }
    );

    this.collider.addInteractionObject(CursorObject);

    this.collider.setEvent(CLICK, () => {
      islandClick(this);
    });

    this.name = "right";

    this.moveTo({ x: 110 * gc.mult, y: -16 * gc.mult });

    this.setInit(() => {
      this.render();
    });
  }
})();

export const IslandThreeTwo = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/islands/3/1/island-3.png",
      { x: 0, y: 0 },
      { w: 96, h: 96 },
      { w: 96 * gc.mult, h: 96 * gc.mult }
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 60 * gc.mult, h: 38 * gc.mult },
      { x: 22 * gc.mult, y: 48 * gc.mult }
    );

    this.collider.addInteractionObject(CursorObject);

    this.collider.setEvent(CLICK, () => {
      islandClick(this);
    });

    this.name = "middle_bottom";

    this.moveTo({ x: 50 * gc.mult, y: 0 * gc.mult });

    this.setInit(() => {
      this.render();
    });
  }
})();

export const IslandThreeOne = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/islands/3/2/island-3-2.png",
      { x: 0, y: 0 },
      { w: 96, h: 96 },
      { w: 96 * gc.mult, h: 96 * gc.mult }
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 28 * gc.mult, h: 36 * gc.mult },
      { x: 40 * gc.mult, y: 8 * gc.mult }
    );

    this.collider.addInteractionObject(CursorObject);

    this.collider.setEvent(CLICK, () => {
      islandClick(this);
    });

    this.name = "middle_top";

    this.moveTo({ x: 50 * gc.mult, y: 0 * gc.mult });

    this.setInit(() => {
      this.render();
    });
  }
})();
