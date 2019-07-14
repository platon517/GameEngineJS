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

    this._maxProgressOffset = 380;

    this.sprite = [
      new Sprite(
        '../../../img/ui/cat_button_empty.png',
        {x: 0, y: 0},
        {w: 650, h: 380},
        size
      ),
      new Sprite(
        '../../../img/ui/cat_button.png',
        {x: 0, y: 0},
        {w: 650, h: 380},
        size,
        {x: 0, y: 0}
      )
    ];

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: size.w - 20 * gc.modifer, h: size.h - 20 * gc.modifer},
      { x: 10 * gc.modifer, y: 10 * gc.modifer },
    );

    this.collider.addInteractionObject(MainCursor);

    this.moveTo(coords);

    this.disabled = true;

    this._pushed = false;
    this._isAnimated = false;

    this._progress = 0;

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);

      this.sprite[1].setInnerOffset(
        {
          x: 0,
          y: this._maxProgressOffset
        }
      );
      this.sprite[1].setOffset(
        {
          x: 0,
          y: this.sprite[1].getSize().h
        }
      );
    });
  }

  addProgress(val){

    if (this._progress < 100) {

      const time = 400;
      const delta = this._progress + val > 100 ? 100 - this._progress : val;

      this._progress = Math.min(this._progress + val, 100);

      this.sprite[1].setInnerOffset(
        {
          x: 0,
          y: this._maxProgressOffset - this._maxProgressOffset * this._progress / 100
        }, time
      );
      this.sprite[1].setOffset(
        {
          x: 0,
          y: this.sprite[1].getOffset().y - this.sprite[1].getSize().h * delta / 100
        }, time
      );

      if ( this._progress >= 100 ) {
        setTimeout(() => {
          this.sprite[1].resize(1.2, 300);
          setTimeout(() => this.sprite[1].resize(1, 100), 100);
          setTimeout(() => this.disabled = false, 300)
        }, time);
      }

    }
  }

  resetProgress() {
    this._progress  = 0;
    this.disabled = true;

    this.sprite[1].setInnerOffset(
      {
        x: 0,
        y: this._maxProgressOffset
      }, 500
    );
    this.sprite[1].setOffset(
      {
        x: 0,
        y: this.sprite[1].getSize().h
      }, 500
    );
  }

  push(){
    if (!this._isAnimated && !this.disabled) {
      this._pushed = true;
      this.sprite[0].resize(0.95, 100);
      this.sprite[1].resize(0.95, 100);
      this._isAnimated = true;
      setTimeout(() => this._isAnimated = false, 100);
    }
  }

  unpush(jump = false){
    if (!this._isAnimated) {
      this._isAnimated = true;

      this.sprite[0].resize(1, 100);
      this.sprite[1].resize(1, 100);

      if (jump) {
        setTimeout(() => {
          this.resetProgress();
        }, 100);
        ScratchCatObj.attack(getRandom(1, 4));
      }

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
