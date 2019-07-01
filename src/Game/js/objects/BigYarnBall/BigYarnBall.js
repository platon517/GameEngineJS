import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {getRandom} from "../../utilities/random";
import {BLUE, getColorSrc} from "../YarnBall/YarnBall";
import { Paw } from "../PawCollector/PawCollector";

const Z_INDEX = 40;

const GROW_ANIM_TIME = 400;

export const BALL_SIZE = 240;

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

  spawn(coords, color, size){


    this.sprite.setImageSrc(getColorSrc(color));

    this.color = color;

    this.render();
    this.setRenderIndex(Z_INDEX);

    this.moveTo({
      x: coords.x - BALL_SIZE / 2,
      y: coords.y - BALL_SIZE / 2,
    });

    const mult = Math.max(1.5, size / 3);

    this.sprite.resize(0.5 * mult);

    this._clearAnimationPlan();

    this.sprite.setAlpha(1, 200);

    this.sprite.rotate(getRandom(30, 80), GROW_ANIM_TIME);

    this.sprite.resize(1.2 * mult, GROW_ANIM_TIME * 0.6, coords);

    this._animationPlan = setTimeout(() => this.sprite.resize(mult, GROW_ANIM_TIME * 0.4), GROW_ANIM_TIME * 0.6);

    Paw.collectBall(coords, BALL_SIZE * mult);
  }

  clear(){
    this.renderClear();
  }

  tick(){
    super.tick();
  }
}

export const BigYarnBallObj = new BigYarnBall({x: 0, y: 0}, BLUE);