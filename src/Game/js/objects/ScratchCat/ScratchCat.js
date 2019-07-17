import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { gc } from "../../game_config";
import { getRandom } from "../../utilities/random";
import { ScoreBar, YarnGrid } from "../../scenes/CoreScene";
import { BALL_SIZE } from "../YarnBall/YarnBall";

const Z_INDEX = 99;

const WIDTH = 200 * gc.modifer;
const HEIGH = 200 * gc.modifer;

export class ScratchCat extends GameObject {
  constructor(coords) {
    super();
    this.sprite = new Sprite(
      "img/catScratch/cat_scratch.png",
      { x: 0, y: 0 },
      { w: 800, h: 800 },
      { w: WIDTH, h: HEIGH }
    );

    this.moveTo(coords);

    this.setInit(() => {
      // this.attack(getRandom(1, 4));
    });
  }


  attack(column){

    const x = YarnGrid.coords.x + BALL_SIZE * (column + 1) - BALL_SIZE / 2 - WIDTH / 2;

    this.render();
    this.setRenderIndex(Z_INDEX);

    YarnGrid.disableBalls();

    const rotation = getRandom(-10, 10);

    this.sprite.resize(3);
    this.sprite.setAlpha(0);
    this.moveTo({x, y: YarnGrid.coords.y - 50});
    this.sprite.rotate(rotation);

    this.sprite.setAlpha(1, 300);
    this.sprite.resize(1, 300);
    this.moveTo({x, y: YarnGrid.coords.y - 200}, 150);

    setTimeout(() => {
      this.moveTo({x, y: YarnGrid.coords.y - 50}, 150);
    }, 150);

    setTimeout(() => {

      const speed = 1;
      const fallTime = (gc.srcSize.h - this.getCoords().y) / speed;

      this.sprite.rotate(rotation < 0 ? rotation + 10 : rotation - 10, 1000);
      this.moveTo({x, y: gc.srcSize.h}, fallTime);

      const fallenBallsRows = YarnGrid.balls
        .filter(ball => ball.x === column || ball.x === column -1 || ball.x === column + 1)
        .reduce((arr, ball) => {
          if (arr[ball.y]) {
            arr[ball.y].push(ball);
          } else {
            arr[ball.y] = [ball];
          }
          return arr;
        }, []);

      fallenBallsRows.forEach((row, index) => {
        setTimeout(() => {
          const time = 100;
          row.forEach(ball => ball.obj.sprite[1].setAlpha(0, time));
          row.forEach(ball =>{
            YarnGrid.addToSelection(ball.obj);
            ball.obj.moveTo({
              x: ball.obj.getCoords().x,
              y: ball.obj.getCoords().y + BALL_SIZE / 2
            }, 1000)
          });
        }, (index + 1) * (BALL_SIZE / speed));
      });

      setTimeout(() => {
        ScoreBar.addProgress(ScoreBar.getMaxScore() / 5);
      }, fallTime / 2);

      setTimeout(() => {
        this.renderClear();
        YarnGrid.clearSelection(false);
        setTimeout(() => YarnGrid.enableBalls(), 200);
      }, fallTime);

    }, 300);
  }

  tick() {
    super.tick();
  }
}
