import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../Engine/Collider/Collider";
import { MainCursor } from "../Cursor/Cursor";
import { YarnGrid } from "../Grid/Grid";
import {getRandom} from "../../utilities/random";

export const BLUE = 'BLUE';
export const GREEN = 'GREEN';
export const PINK = 'PINK';
export const PURPLE = 'PURPLE';
export const YELLOW = 'YELLOW';
const Z_INDEX = 10;
const GROW_ANIM_TIME = 200;

export const BALL_SIZE = 240;

export const getColorSrc = color => {
  switch (color) {
    case BLUE:
      return 'img/YarnBalls/png/yarn_blue.png';
    case GREEN:
      return 'img/YarnBalls/png/yarn_green.png';
    case PINK:
      return 'img/YarnBalls/png/yarn_pink.png';
    case PURPLE:
      return 'img/YarnBalls/png/yarn_purple.png';
    case YELLOW:
      return 'img/YarnBalls/png/yarn_yellow.png';
  }
};

export class YarnBall extends GameObject {
  constructor(coords, color){
    super();
    this.sprite = new Sprite(
      getColorSrc(color),
      { x: 0, y: 0 },
      { w: 370, h: 370 },
      { w: BALL_SIZE, h: BALL_SIZE },
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: BALL_SIZE, h: BALL_SIZE },
      { x: 0, y: 0 },
    );

    this.collider.addInteractionObject(MainCursor);

    this.moveTo(coords);

    this.selected = false;

    this.color = color;

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });

  }

  _clearAnimationPlan(){
    if (this._animationPlan) {
      clearTimeout(this._animationPlan);
      this._animationPlan = null;
    }
  }

  grow(){
    this._clearAnimationPlan();
    this.sprite.rotate(this.sprite._rotation + getRandom(15, 45), GROW_ANIM_TIME * 0.6);
    this.sprite.resize(1.3, GROW_ANIM_TIME * 0.6);
    this._animationPlan = setTimeout(() => this.sprite.resize(1.2, GROW_ANIM_TIME * 0.4), GROW_ANIM_TIME * 0.6);
  }

  reset(){
    this._clearAnimationPlan();
    this.sprite.rotate(this.sprite._rotation + getRandom(-45, 15), GROW_ANIM_TIME * 0.6);
    this.sprite.resize(0.9, GROW_ANIM_TIME * 0.6);
    this._animationPlan = setTimeout(() => this.sprite.resize(1, GROW_ANIM_TIME * 0.4), GROW_ANIM_TIME * 0.6);
    this.selected = false;
  }

  clear(center){
    this.sprite.setAlpha(0, 200);
    this.sprite.resize(0.8, 200);
    this.moveTo({
      x: center.x - BALL_SIZE / 2,
      y: center.y - BALL_SIZE / 2
    }, 200);
    setTimeout(() => this.renderClear(), 200);
  }

  tick(){
    super.tick();
    if (this.collider.getInteractions().has(MainCursor.collider)) {
      if (YarnGrid.selection.size > 0 && [...YarnGrid.selection].pop().color !== this.color) {
        return false
      }
      if (MainCursor.hold) {
        if (!this.selected) {
          YarnGrid.disableColliders(this);
          YarnGrid.addToSelection(this);

          this.grow();

          this.selected = true;
        } else {
          const selectionArr = [...YarnGrid.selection];
          if (
            selectionArr[selectionArr.length - 2] === this &&
            !selectionArr[selectionArr.length - 1].collider.getInteractions().has(MainCursor.collider)
          ) {
            const lastBall = selectionArr.pop();
            lastBall.reset();
            YarnGrid.deleteFromSelection(lastBall);
            YarnGrid.disableColliders([...YarnGrid.selection].pop());
            console.log('back')
          }
        }
      }
    }
  }
}