import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { StarParticle } from "../../objects/StarParticle/StarParticle";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";
import {Counter, EndPlate, GameStates, YarnGrid} from "../../scenes/CoreScene";
import {localStorageRead, localStorageSave} from "../../utilities/localStorageSave";

const Z_INDEX = 10;

export class ScoreProgressBar extends GameObject {
  constructor(
    size = { w: 260, h: 152 },
    coords = { x: 0, y: 0 }
  ) {
    super();

    this._maxProgressWidth = 1360;
    this._maxProgressHeight = 200;
    this._startWidth = size.w;
    this._fillStartX = 21;

    this.sprite = [
      new Sprite(
        'img/ProgressBar/bar_1.png',
        {x: 0, y: 0},
        {w: this._maxProgressWidth, h: this._maxProgressHeight},
        size
      ),
      new Sprite(
        'img/ProgressBar/bar_2.png',
        {x: 0, y: 0},
        {w: this._maxProgressWidth, h: this._maxProgressHeight},
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

  saveProgress = () => localStorageSave('scoreBar', this._progress);

  spawn(){
    this.setStartPoint();

    const time = 300;
    this.sprite[0].setAlpha(0);
    this.sprite[0].resize(0.8);

    this.sprite[0].setAlpha(1, time * 0.75);
    this.sprite[0].resize(1.05, time * 0.75);

    setTimeout(() => {
      this.sprite[0].resize(1, time * 0.25);
    }, time * 0.75);
  }

  setStartPoint(){
    this.sprite[1].setInnerSize({w: this._fillStartX, h: this._maxProgressHeight});
    this.sprite[1].setSize({w: this._fillStartX / gc.modifer, h: this.sprite[1].getSize().h});
    this.addProgress(localStorageRead('scoreBar'), false, true);
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

  addProgress(value, animated = false, init = false){
    const val = value / this._maxScore * 100;
    !init && localStorageSave('scoreBar', localStorageRead('scoreBar') + value);
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
        const delta = (this._progress + val) > 100 ? (100 - this._progress) : val;

        this._progress = Math.min(this._progress + val, 100);

        this.sprite[1].setInnerSize(
          {
            w: this._fillStartX + (this._maxProgressWidth - this._fillStartX) * this._progress / 100,
            h: this._maxProgressHeight
          }, time
        );
        this.sprite[1].setSize(
          {
            w: this.sprite[1].getSize().w + (this._startWidth - this._fillStartX / gc.modifer) * delta / 100,
            h: this.sprite[1].getSize().h
          }, time
        );
        if (this._progress >= 100) {
          let stars = 0;

          const freeTurns = Counter.getTurns() / GameStates.turns;
          if (freeTurns > 0.1) {
            stars += 1;
          }
          if (freeTurns > 0.25) {
            stars += 1;
          }
          if (freeTurns > 0.5) {
            stars += 1;
          }
          GameStates.gameOver = true;
          EndPlate.spawn(true, stars)
        }
      }, animated ? animationTime * 0.8 : 0);

    }
  }

  resetProgress() {
    this._progress  = 0;

    this.setStartPoint();
  }

  tick() {
    super.tick();
  }
}
