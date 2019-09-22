import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { gc } from "../../game_config";
import { Collider } from "../../../../Engine/Collider/Collider";
import {
  GameStates,
  MainCursor
} from "../../scenes/CoreScene";

const Z_INDEX = 11;

export class AddTurnsButton extends GameObject {
  constructor(coords, size) {
    super();
    this.sprite = new Sprite(
      "img/addTurns/addTurns.png",
      { x: 0, y: 0 },
      { w: 410, h: 410 },
      size
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: size.w - 10 * gc.modifer, h: size.h - 20 * gc.modifer },
      { x: 5 * gc.modifer, y: 10 * gc.modifer }
    );

    this.collider.addInteractionObject(MainCursor);

    this.disabled = false;

    this._pushed = false;
    this._isAnimated = false;

    this.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  push() {
    if (!this._isAnimated && !this.disabled) {
      this._pushed = true;
      this.sprite.resize(0.95, 100);
      this._isAnimated = true;
      setTimeout(() => (this._isAnimated = false), 100);
    }
  }

  activate(active = true) {
    this.sprite.resize(active ? 1 : 0, 100);
  }

  unpush(active = false) {
    if (!this._isAnimated) {
      this._isAnimated = true;

      this.sprite.resize(1, 100);

      if (active) {
        this.activate(true)
      } else {
        this.activate(false)
      }

      setTimeout(() => {
        this._pushed = false;
        this._isAnimated = false;
      }, 100);
    }
  }

  tick() {
    super.tick();

    if (
      !GameStates.gameOver &&
      this.collider.getInteractions().has(MainCursor.collider) &&
      !this.disabled &&
      !MainCursor.hasMoved
    ) {
      if (!this._pushed) {
        this.push();
      }
    } else {
      if (this._pushed) {
        this.unpush(!MainCursor.hold);
      }
    }
  }
}
