import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { ARIAL_FONT, CENTER, Text } from "../../../../Engine/Text/Text";
import { gc } from "../../game_config";
import { Collider } from "../../../../Engine/Collider/Collider";
import {
  GameStates,
  MainCursor,
  ScratchCatObj,
  YarnGrid
} from "../../scenes/CoreScene";

const Z_INDEX = 80;

export class BrushButton extends GameObject {
  constructor(coords, size) {
    super();
    this.sprite = [
      new Sprite(
        "img/brush_button/brush_button.png",
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
      )
    ];

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: size.w - 10 * gc.modifer, h: size.h - 20 * gc.modifer },
      { x: 5 * gc.modifer, y: 10 * gc.modifer }
    );

    this.collider.addInteractionObject(MainCursor);

    this.text = new Text(
      `9`,
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

    this.text.textAllign(CENTER);

    this.ui = [this.text];

    this.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  push() {
    if (!this._isAnimated && !this.disabled) {
      this._pushed = true;
      this.sprite[0].resize(0.95, 100);
      this._isAnimated = true;
      setTimeout(() => (this._isAnimated = false), 100);
    }
  }

  unpush(paint = false) {
    if (!this._isAnimated) {
      this._isAnimated = true;

      this.sprite[0].resize(1, 100);

      if (paint) {
        YarnGrid.balls[1].obj.sprite[1].resize(0, 200);
        setTimeout(() => {
          YarnGrid.balls[1].obj.sprite[1].setImageSrc(
            "img/YarnBalls/png/yarn_all.png"
          );
          YarnGrid.balls[1].obj.sprite[1].resize(1, 200);
        }, 200);
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
        if (MainCursor.hold) {
          this.unpush(false);
        } else {
          this.unpush(true);
        }
      }
    }
  }
}