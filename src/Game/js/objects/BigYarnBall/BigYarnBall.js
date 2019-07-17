import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {getRandom} from "../../utilities/random";
import { BLUE, getColorSrc } from "../YarnBall/YarnBall";
import {Paw, ScoreBar} from "../../scenes/CoreScene";
import { gc } from "../../game_config";
import {StarParticle} from "../StarParticle/StarParticle";
import {engineVisual} from "../../../../Engine/VisualRender/VisualRenderComponent";

const Z_INDEX = 40;

const GROW_ANIM_TIME = 400;

export const BALL_SIZE = 60 * gc.modifer;
export const SHADOW_SIZE = 72 * gc.modifer;

export class BigYarnBall extends GameObject {
  constructor(coords, color){
    super();
    this.sprite = [
      new Sprite(
        'img/YarnBalls/png/yarn_shadow.png',
        { x: 0, y: 0 },
        { w: 500, h: 500 },
        { w: SHADOW_SIZE, h: SHADOW_SIZE },
        { x: (BALL_SIZE - SHADOW_SIZE) / 2, y: (BALL_SIZE - SHADOW_SIZE) / 2 },
      ),
      new Sprite(
        getColorSrc(color),
        { x: 0, y: 0 },
        { w: 370, h: 370 },
        { w: BALL_SIZE, h: BALL_SIZE },
      )
    ];

    this.sprite[0].resize(0.5);
    this.sprite[0].setAlpha(0);

    this.moveTo(coords);

    this.startParticles = [];

    this.color = color;

    this.sprite[1].setAlpha(0);
  }

  _clearAnimationPlan(){
    if (this._animationPlan) {
      clearTimeout(this._animationPlan);
      this._animationPlan = null;
    }
  }

  spawn(coords, color, size){

    this.sprite[1].setImageSrc(getColorSrc(color));

    this.color = color;

    this.render();
    this.setRenderIndex(Z_INDEX);

    const center = {
      x: coords.x - BALL_SIZE / 2,
      y: coords.y - BALL_SIZE / 2,
    };

    this.moveTo(center);

    const mult = Math.min(Math.max(1.5, size / 3), 2.5);

    this.sprite[0].resize(0.5);
    this.sprite[1].resize(0.5 * mult);

    this.sprite[0].setAlpha(0);

    this._clearAnimationPlan();

    this.sprite[1].setAlpha(1, 200);

    this.sprite[1].rotate(getRandom(30, 80), GROW_ANIM_TIME);

    this.sprite[0].setAlpha(0.2, GROW_ANIM_TIME * 0.6);

    this.sprite[0].resize(1.2 * mult, GROW_ANIM_TIME * 0.6);
    this.sprite[1].resize(1.2 * mult, GROW_ANIM_TIME * 0.6);

    this.moveTo({x: center.x, y: center.y + 150}, 100);
    setTimeout(() => this.moveTo(center, 100), 100);

    this._animationPlan = setTimeout(() => {
      this.sprite[0].resize(mult, GROW_ANIM_TIME * 0.4);
      this.sprite[1].resize(mult, GROW_ANIM_TIME * 0.4);
    }, GROW_ANIM_TIME * 0.6);

    Paw.collectBall(coords, BALL_SIZE * mult);

    for (let i = 0; i < size; i++) {
      this.startParticles.push(new StarParticle());
    }

    this.startParticles.forEach(star => {

      const TIME = 800;

      star.init();

      const range = 20 * size * gc.modifer;
      star.moveTo({
        x: coords.x + getRandom(-range, range),
        y: coords.y + getRandom(-range, range),
      });
      star.sprite.resize(0.5);
      star.sprite.setAlpha(0);

      star.sprite.resize(1.5, TIME / 4);
      star.sprite.setAlpha(1, TIME / 4);

      star.moveTo({
        x:
        ScoreBar.getCoords().x +
        ScoreBar.getProgress() / 100 * ScoreBar.sprite[0].getSize().w -
        star.sprite.getSize().w,
        y: ScoreBar.getCoords().y + (ScoreBar.sprite[0].getSize().h - star.sprite.getSize().h) / 2
      }, TIME);
      star.sprite.rotate(360, TIME, true);

      setTimeout(() => {
        star.sprite.resize(0.5, TIME / 4);
        star.sprite.setAlpha(0, TIME / 4);
      }, TIME * 0.75);

      setTimeout(() => {
        star.renderClear();
      }, TIME);

    });

    setTimeout(() => {
      ScoreBar.addProgress(size);
      this.startParticles = [];
    }, 700);

  }

  clear(){
    this.renderClear();
  }

  tick(){
    super.tick();
  }
}
