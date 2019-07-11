import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { Collider } from "../../../../Engine/Collider/Collider";
import { MainCursor, ScratchCatObj } from "../../scenes/CoreScene";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";

const Z_INDEX = 10;

export class ScratchCatButton extends GameObject {
  constructor(
    size = { w: 260, h: 152 },
    coords = { x: 0, y: 0 }
  ) {
    super();
    this.sprite = new Sprite(
      '../../../img/ui/cat_button_empty.png',
      {x: 0, y: 0},
      {w: 650, h: 380},
      size
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: size.w - 20 * gc.modifer, h: size.h - 20 * gc.modifer},
      { x: 10 * gc.modifer, y: 10 * gc.modifer },
    );

    this.collider.addInteractionObject(MainCursor);

    this.moveTo(coords);

    this.disabled = false;

    this._pushed = false;
    this._isAnimated = false;

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  push(){
    if (!this._isAnimated && !this.disabled) {
      this._pushed = true;
      this.sprite.resize(0.95, 100);
      this._isAnimated = true;
      setTimeout(() => this._isAnimated = false, 100);
    }
  }

  unpush(jump = false){
    if (!this._isAnimated) {
      this._isAnimated = true;

      this.sprite.resize(1, 100);

      jump && ScratchCatObj.attack(getRandom(1, 4));

      setTimeout(() => {
        this._pushed = false;
        this._isAnimated = false
        }, 100
      );
    }
  }

  tick() {
    super.tick();
    if (this.collider.getInteractions().has(MainCursor.collider) && !this.disabled && !MainCursor.hasMoved) {
      if (!this._pushed) {
        this.push();
      }
    }
    else {
      if (this._pushed){
        if (MainCursor.hold){
          this.unpush(false);
        } else {
          this.unpush(true);
        }
      }
    }
  }
}
