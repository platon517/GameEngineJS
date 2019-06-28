import {GameObject} from "../../../../Engine/GameObject/GameObject";
import { BALL_SIZE, BLUE, GREEN, PINK, PURPLE, YarnBall, YELLOW } from "../YarnBall/YarnBall";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";

const getRandomColor = () => {
  const colorArray = [BLUE, GREEN, PINK, YELLOW, PURPLE];
  const randomNum = getRandom(0, colorArray.length);
  return colorArray[randomNum];
};

export class Grid extends GameObject {
  constructor(coords, size){
    super();

    this.balls = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = getRandomColor();
        const ball = new YarnBall(
          {
            x: coords.x  + BALL_SIZE * x,
            y: coords.y + BALL_SIZE * y
          }, color);
        ball.sprite.rotate(getRandom(-90, 90));
        this.balls.push({obj: ball, color, x, y});
      }
  }

    this.setInit(() => {
      this.balls.forEach(ball => ball.obj.render());
    });

  }

  disableColliders(target){
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
    console.log(this.balls);
  }

  tick(){
    super.tick();
  }
}

const offset = {x: (gc.srcSize.w - BALL_SIZE * 5 ) / 2, y: (gc.srcSize.h - BALL_SIZE * 5 ) / 2};
export const YarnGrid = new Grid(offset, 5);