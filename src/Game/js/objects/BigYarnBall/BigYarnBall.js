import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {getRandom} from "../../utilities/random";
import {BLUE, getColorSrc} from "../YarnBall/YarnBall";
import {Collider} from "../../../../Engine/Collider/Collider";

const Z_INDEX = 11;

const GROW_ANIM_TIME = 400;

export const BALL_SIZE = 400;

export class BigYarnBall extends GameObject {
  constructor(coords, color){
    super();
    this.sprite = new Sprite(
      getColorSrc(color),
      { x: 0, y: 0 },
      { w: 370, h: 370 },
      { w: BALL_SIZE, h: BALL_SIZE },
    );

    this.moveTo(coords);

    this.color = color;

    this.sprite.setAlpha(0);
  }

  _clearAnimationPlan(){
    if (this._animationPlan) {
      clearTimeout(this._animationPlan);
      this._animationPlan = null;
    }
  }

  spawn(coords, color){


    this.sprite.setImageSrc(getColorSrc(color));

    this.color = color;

    this.render();
    this.setRenderIndex(Z_INDEX);

    this.moveTo({
      x: coords.x - BALL_SIZE / 2,
      y: coords.y - BALL_SIZE / 2,
    });

    this.sprite.resize(0.5);

    this._clearAnimationPlan();

    this.sprite.setAlpha(1, 200);

    this.sprite.rotate(getRandom(30, 80), GROW_ANIM_TIME);

    this.sprite.resize(1.2, GROW_ANIM_TIME * 0.6, coords);

    this._animationPlan = setTimeout(() => this.sprite.resize(1, GROW_ANIM_TIME * 0.4), GROW_ANIM_TIME * 0.6);
  }

  clear(){
    this.sprite.setAlpha(0, 200);
    this.sprite.resize(0.8, 200);
    setTimeout(() => this.renderClear(), 200);
  }

  tick(){
    super.tick();
  }
}

export const BigYarnBallObj = new BigYarnBall({x: 0, y: 0}, BLUE);