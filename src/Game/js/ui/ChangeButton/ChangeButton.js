import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { ARIAL_FONT, CENTER, Text } from "../../../../Engine/Text/Text";
import { gc } from "../../game_config";
import { Collider } from "../../../../Engine/Collider/Collider";
import {
  BrushButtonObj,
  GameStates,
  MainCursor
} from "../../scenes/CoreScene";

const Z_INDEX = 80;

export class ChangeButton extends GameObject {
  constructor(coords, size, value = 3) {
    super();
    this.sprite = [
      new Sprite(
        "img/change_button/change_button.png",
        { x: 0, y: 0 },
        { w: 405, h: 405 },
        size
      ),
      new Sprite(
        "img/brush_button/cancel.png",
        { x: 0, y: 0 },
        { w: 405, h: 405 },
        size
      ),
      new Sprite(
        "img/brush_button/button_counter.png",
        { x: 0, y: 0 },
        { w: 205, h: 205 },
        { w: size.w / 2, h: size.h / 2 },
        { x: size.w - size.w * 0.4, y: size.h - size.h * 0.4 }
      ),
    ];

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: size.w - 10 * gc.modifer, h: size.h - 20 * gc.modifer },
      { x: 5 * gc.modifer, y: 10 * gc.modifer }
    );

    this.collider.addInteractionObject(MainCursor);

    this.value = value;

    this.text = new Text(
      `${this.value}`,
      ARIAL_FONT,
      20 * gc.modifer,
      "#9123cd",
      "bold",
      { x: this.getCoords().x, y: this.getCoords().y },
      { x: 23 * gc.modifer, y: 60 * gc.modifer },
      { w: size.w, h: 28 * gc.modifer }
    );

    this.disabled = false;

    this._pushed = false;
    this._isAnimated = false;

    this.isChanging = false;

    this.text.textAllign(CENTER);

    this.ui = [this.text];

    this.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
      this.sprite[1].resize(0);
    });
  }

  push() {
    if (!this._isAnimated && !this.disabled && (this.value > 0 || this.isChanging ) && !BrushButtonObj.isPainting) {
      this._pushed = true;
      this.sprite[0].resize(0.95, 100);
      this.isChanging && this.sprite[1].resize(0.95, 100);
      this._isAnimated = true;
      setTimeout(() => (this._isAnimated = false), 100);
    }
  }

  disable(){
    this.sprite[0].setAlpha(0.7, 300);
    this.sprite[2].setAlpha(0.7, 300);
  }

  paint(){
    this.isChanging = false;
    this.sprite[1].resize(0, 100);
    if (this.value <= 0) {
      this.disable();
    }
  }

  activate(active = true) {
    if (active) {
      this.value -= 1;
    } else {
      this.value += 1;
    }

    this.text.text(this.value);

    this.sprite[1].resize(active ? 1 : 0, 100);
  }

  unpush(change = false) {
    if (!this._isAnimated) {
      this._isAnimated = true;

      this.sprite[0].resize(1, 100);

      if (change) {
        if (!this.isChanging) {
          this.isChanging = true;
          this.activate(true)
        }
        else {
          this.isChanging = false;
          this.activate(false)
        }
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
