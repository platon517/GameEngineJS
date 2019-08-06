import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { Collider } from "../../../../Engine/Collider/Collider";
import {BrushButtonObj, ChangeButtonObj, GameStates, MainCursor, ScoreBar, ScratchCatObj} from "../../scenes/CoreScene";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";
import { BLUE, GREEN, MULT, PINK, PURPLE, YELLOW } from "../../objects/YarnBall/YarnBall";

const Z_INDEX = 10;

export const PURPLE_SPRITE = '../../../img/cat_button/cat_button_purple.png';
export const YELLOW_SPRITE = '../../../img/cat_button/cat_button_yellow.png';
export const PINK_SPRITE = '../../../img/cat_button/cat_button_pink.png';
export const GREEN_SPRITE = '../../../img/cat_button/cat_button_green.png';
export const BLUE_SPRITE = '../../../img/cat_button/cat_button_blue.png';

export class ScratchCatButton extends GameObject {
  constructor(
    size = { w: 260, h: 152 },
    coords = { x: 0, y: 0 }
  ) {
    super();

    this._maxProgressOffset = 380;

    this.sprite = [
      new Sprite(
        '../../../img/cat_button/cat_button_empty.png',
        {x: 0, y: 0},
        {w: 650, h: 380},
        size
      ),
      new Sprite(
        PURPLE_SPRITE,
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
      this.spawn();
    });
  }

  spawn(){
    const time = 300;
    this.sprite.forEach(sprite => {
      sprite.setAlpha(0);
      sprite.resize(0.8);
      sprite.setAlpha(1, time * 0.75);
      sprite.resize(1.025, time * 0.75);
      setTimeout(() => {
        sprite.setAlpha(1, time * 0.25);
        sprite.resize(1, time * 0.25);
      }, time);
    });
  }

  getSrcByColor(color){
    switch (color) {
      case PURPLE:
        return PURPLE_SPRITE;
      case GREEN:
        return GREEN_SPRITE;
      case PINK:
        return PINK_SPRITE;
      case BLUE:
        return BLUE_SPRITE;
      case YELLOW:
        return YELLOW_SPRITE;
    }
  }

  addProgress(val, color = PURPLE){

    if (color === MULT) {
      return false;
    }

    if (!this._nowColor) {
      this._nowColor = {
        src: this.getSrcByColor(color),
        color: color
      };
      this.sprite[1].setImageSrc(this._nowColor.src);
    }

    if (this._progress < 100 && color === this._nowColor.color) {

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
    if (!this._isAnimated && !this.disabled && !ChangeButtonObj.isChanging && !BrushButtonObj.isPainting) {
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
        this._nowColor = null;
      }

      setTimeout(() => {
        this._pushed = false;
        this._isAnimated = false;
        }, 100
      );
    }
  }

  tick() {
    super.tick();
    if (!GameStates.gameOver && this.collider.getInteractions().has(MainCursor.collider) && !this.disabled && !MainCursor.hasMoved && this._progress >= 100) {
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
