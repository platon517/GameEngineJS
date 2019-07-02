import {GameObject} from "../../../../Engine/GameObject/GameObject";
import { BALL_SIZE, BLUE, getColorSrc, GREEN, PINK, PURPLE, YarnBall, YELLOW } from "../YarnBall/YarnBall";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";
import {MainCursor} from "../Cursor/Cursor";
import {BigYarnBallObj} from "../BigYarnBall/BigYarnBall";

const getRandomColor = () => {
  const colorArray = [BLUE, GREEN, PINK, YELLOW, PURPLE];
  const randomNum = getRandom(0, colorArray.length);
  return colorArray[randomNum];
};

export class Grid extends GameObject {
  constructor(coords, size){
    super();

    this.balls = [];

    this.selection = new Set();

    this.size = size;
    this.coords = coords;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = getRandomColor();
        const ball = new YarnBall(
          {
            x: coords.x  + BALL_SIZE * x,
            y: coords.y + BALL_SIZE * y
          }, color);
        ball.sprite.rotate(getRandom(-90, 90));
        ball.setGridPos({x, y});
        this.balls.push({obj: ball, color, x, y});
      }
    }

    this.setInit(() => {
      this.balls.forEach(ball => ball.obj.render());
    });

  }

  disableColliders(target = null){
    if (!target) {
      this.balls.forEach(ball => ball.obj.collider.disabled = true);
      return false;
    }
    this.balls
      .filter(ball => ball.obj !== target)
      .forEach(ball => ball.obj.collider.disabled = true);
    const targetBall = this.balls.find(ball => ball.obj === target);
    const nearBalls = this.balls.filter(
      ball =>
        ((ball.x === targetBall.x - 1) && (ball.y === targetBall.y) && ball.color === targetBall.color) ||
        ((ball.x === targetBall.x + 1) && (ball.y === targetBall.y) && ball.color === targetBall.color) ||
        ((ball.x === targetBall.x) && (ball.y === targetBall.y + 1) && ball.color === targetBall.color) ||
        ((ball.x === targetBall.x) && (ball.y === targetBall.y - 1) && ball.color === targetBall.color)
    );
    nearBalls.forEach(ball => ball.obj.collider.disabled = false);
  }

  enableColliders(){
    this.balls.forEach(ball => ball.obj.collider.disabled = false);
  }

  addToSelection = ball => {
    this.selection.add(ball);
    ball.setRenderIndex(10 + this.selection.size);
  };

  deleteFromSelection = ball => this.selection.delete(ball);

  getBallByPos(x, y){
    return this.balls.find(ball => ball.x === x && ball.y === y);
  }

  spawnExtraBalls(clearedBalls){
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (!this.balls.find(ball => ball.x === x && ball.y === y)) {
          const color = getRandomColor();
          const spawnBall = clearedBalls.pop();
          spawnBall.render();
          spawnBall.sprite.setImageSrc(getColorSrc(color));

          spawnBall.sprite.setAlpha(0);
          spawnBall.sprite.resize(1);

          spawnBall.color = color;
          spawnBall.selected = false;

          const startY = this.coords.y - BALL_SIZE * (this.size - y) - getRandom(0, BALL_SIZE / 2);
          spawnBall.moveTo({
            x: this.coords.x  + BALL_SIZE * x,
            y: startY
          });

          spawnBall.sprite.setAlpha(1, 200);
          const endY = this.coords.y + BALL_SIZE * y;
          spawnBall.moveTo({
            x: this.coords.x  + BALL_SIZE * x,
            y: endY
          }, (endY - startY) / 5);

          spawnBall.sprite.rotate(getRandom(-90, 90));
          spawnBall.setGridPos({x, y});

          this.balls.push({obj: spawnBall, color, x, y});
        }
      }
    }
  }

  clearSelection = () => {
    MainCursor.moveTo({x: 0, y: 0});
    if (this.selection.size < 2) {
      this.selection.forEach(ball => ball.reset());
      this.selection = new Set();
      this.enableColliders();
    } else {

      const xArr = [];
      const yArr = [];

      this.selection.forEach(ball => {
        const coords = ball.getCoords();
        xArr.push(coords.x);
        yArr.push(coords.y);
      });

      const center = {
        x: parseFloat((Math.min(...xArr) + ((Math.max(...xArr) + BALL_SIZE - Math.min(...xArr)) / 2)).toFixed(0)),
        y: parseFloat((Math.min(...yArr) + ((Math.max(...yArr) + BALL_SIZE - Math.min(...yArr)) / 2)).toFixed(0)),
      };

      let color = null;

      this.balls = this.balls.filter(ball => !this.selection.has(ball.obj));
      [...this.selection].sort((a, b) => b.gridY - a.gridY).forEach(ball => {
        if (!color) {
          color = ball.color;
        }
        ball.clear(center)
      });

      this.disableColliders();
      BigYarnBallObj.spawn(center, color, this.selection.size);

      //console.log(this.selection.size);

      const clearedBalls = [...this.selection];
      this.selection = new Set();

      setTimeout(() => this.spawnExtraBalls(clearedBalls), 200);
    }
  };

  tick(){
    super.tick();
  }
}

const offset = {x: (gc.srcSize.w - BALL_SIZE * 5 ) / 2, y: (gc.srcSize.h - BALL_SIZE * 5 ) / 2};
export const YarnGrid = new Grid(offset, 5);