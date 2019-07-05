import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { gc } from "../../game_config";
import { getRandom } from "../../utilities/random";
import { YarnGrid } from "../Grid/Grid";
import { BALL_SIZE } from "../YarnBall/YarnBall";

const Z_INDEX = 30;

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
      this.attack(getRandom(1, 4));
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
      this.sprite.rotate(rotation < 0 ? rotation + 10 : rotation - 10, 1000);
      this.moveTo({x, y: gc.srcSize.h}, 1000);

      const fallenBalls =
        YarnGrid.balls.filter(ball => ball.x === column || ball.x === column -1 || ball.x === column + 1);

      fallenBalls.forEach(ball => {
        YarnGrid.selection.add(ball.obj);
      });
      setTimeout(YarnGrid.clearSelection, 500);

      setTimeout(() => {
        this.renderClear();
        YarnGrid.enableBalls();
      }, 1000);

    }, 300);
  }

  tick() {
    super.tick();
  }
}

export const ScratchCatObj = new ScratchCat({ x: 0, y: 0 });
