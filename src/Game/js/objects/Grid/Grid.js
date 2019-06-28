import {GameObject} from "../../../../Engine/GameObject/GameObject";
import { BALL_SIZE, BLUE, GREEN, PINK, PURPLE, YarnBall, YELLOW } from "../YarnBall/YarnBall";
import { getRandom } from "../../utilities/random";

const getRandomColor = () => {
  const colorArray = [BLUE, GREEN, PINK, YELLOW, PURPLE];
  const randomNum = getRandom(0, colorArray.length);
  console.log(randomNum);
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
        this.balls.push(ball);
      }
  }

    this.setInit(() => {
      console.log(this.balls);
      this.balls.forEach(ball => ball.render());
    });

  }
  tick(){
    super.tick();
  }
}

export const YarnGrid = new Grid({x: 40, y: 400}, 5);