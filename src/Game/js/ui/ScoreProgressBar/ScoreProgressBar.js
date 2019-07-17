import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { StarParticle } from "../../objects/StarParticle/StarParticle";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";

const Z_INDEX = 10;

export class ScoreProgressBar extends GameObject {
  constructor(
    size = { w: 260, h: 152 },
    coords = { x: 0, y: 0 }
  ) {
    super();

    this._maxProgressOffset = 1360;

    this.sprite = [
      new Sprite(
        '../../../img/ProgressBar/bar_1.png',
        {x: 0, y: 0},
        {w: 1360, h: 200},
        size
      ),
      new Sprite(
        '../../../img/ProgressBar/bar_2.png',
        {x: 0, y: 0},
        {w: 1360, h: 200},
        size,
        {x: 0, y: 0}
      ),
      new Sprite(
        '../../../img/ProgressBar/bar_1.png',
        {x: 0, y: 0},
        {w: 1360, h: 200},
        size,
        {x: 0, y: 0}
      ),
    ];

    this.moveTo(coords);

    this._progress = 0;
    this._maxScore = 100;

    this._particles = [];

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);

      for (let i = 0; i < 10; i++) {
        this._particles.push(new StarParticle())
      }

      this.spawn();
    });
  }

  spawn(){
    const time = 300;
    this.sprite.forEach((sprite, index) => {
      sprite.setAlpha(0);
      sprite.resize(0.8);
      index !== 1 && sprite.setAlpha(1, time * 0.75);
      index !== 1 && sprite.resize(1.025, time * 0.75);
      setTimeout(() => {
        index !== 1 && sprite.setAlpha(1, time * 0.25);
        index !== 1 && sprite.resize(1, time * 0.25);
      }, time);
    });
    setTimeout(() => {
      this.sprite[1].setAlpha(1);
      this.sprite[1].resize(1);
    }, time);
  }

  getProgress(){
    return this._progress;
  }

  setMaxScore(val){
    this._maxScore = val;
  }

  getMaxScore(){
    return this._maxScore;
  }

  addProgress(value, animated = false){
    const val = value / this._maxScore * 100;
    if (this._progress < 100) {

      const animationTime = 650;

      if (animated) {
        const animationRange = 200;

        this._particles.forEach(particle => {
          particle.init();
          particle.moveTo({
            x:
              this.sprite[0].getCoords().x +
              this.sprite[0].getSize().w / 2 -
              particle.sprite.getSize().w / 2 +
              getRandom(-animationRange * gc.modifer, animationRange * gc.modifer),
            y:
              this.sprite[0].getCoords().y +
              this.sprite[0].getSize().h / 2 -
              particle.sprite.getSize().h / 2 +
              getRandom(-animationRange * gc.modifer, animationRange * gc.modifer),
          });

          particle.sprite.setAlpha(0);
          particle.sprite.resize(1.5);

          particle.sprite.rotate(360, animationTime, true);
          particle.sprite.setAlpha(1, animationTime / 4);
          particle.sprite.resize(0.5, animationTime);

          setTimeout(() => {
            particle.sprite.setAlpha(0, animationTime / 4);
          }, animationTime * 0.75);

          particle.moveTo({
            x:
              this.sprite[0].getCoords().x +
              this.sprite[0].getSize().w / 2 -
              particle.sprite.getSize().w / 2,
            y:
              this.sprite[0].getCoords().y +
              this.sprite[0].getSize().h / 2 -
              particle.sprite.getSize().h / 2
          }, animationTime);
        });
      }

      setTimeout(() => {
        const time = 400;
        const delta = this._progress + val > 100 ? 100 - this._progress : val;

        this._progress = Math.min(this._progress + val, 100);

        this.sprite[2].setInnerOffset(
          {
            x: this._maxProgressOffset * this._progress / 100,
            y: 0
          }, time
        );
        this.sprite[2].setOffset(
          {
            x: this.sprite[2].getOffset().x + this.sprite[2].getSize().w * delta / 100,
            y: 0
          }, time
        );
      }, animated ? animationTime * 0.8 : 0)
    }
    console.log(this._progress);
  }

  resetProgress() {
    this._progress  = 0;

    this.sprite[2].setInnerOffset(
      {
        x: 0,
        y: 0
      }, 500
    );
    this.sprite[2].setOffset(
      {
        x: 0,
        y: 0
      }, 500
    );
  }

  tick() {
    super.tick();
  }
}
