import {GameObject} from "../../../../Engine/GameObject/GameObject";
import { BALL_SIZE, BLUE, getColorSrc, GREEN, PINK, PURPLE, YarnBall, YELLOW } from "../YarnBall/YarnBall";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";
import {MainCursor} from "../Cursor/Cursor";
import {BigYarnBallObj} from "../BigYarnBall/BigYarnBall";
import { GRID_SIZE } from "./gridSize";

const getRandomColor = () => {
  const colorArray = [BLUE, GREEN, PINK, YELLOW, PURPLE];
  const randomNum = getRandom(0, colorArray.length);
  return colorArray[randomNum];
};

export class Grid extends GameObject {
  constructor(coords, size = 5){
    super();

    this.balls = [];

    this.selection = new Set();

    this.size = size;
    this.coords = coords;

    this.helpSpawns = 10;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = getRandomColor();
        const ball = new YarnBall(
          {
            x: coords.x  + BALL_SIZE * x,
            y: coords.y + BALL_SIZE * y
          }, color);
        ball.sprite[1].rotate(getRandom(-90, 90));
        ball.setGridPos({x, y});
        this.balls.push({obj: ball, color, x, y});
      }
    }

    this.setInit(() => {
      this.balls.forEach(ball => ball.obj.render());
      this.checkCombos();
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
    const nearBalls = this.getBallNeighbours(targetBall);
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

  getBallNeighbours(targetBall){
    return this.balls.filter(
      ball =>
        ((ball.x === targetBall.x - 1) && (ball.y === targetBall.y) && ball.color === targetBall.color) ||
        ((ball.x === targetBall.x + 1) && (ball.y === targetBall.y) && ball.color === targetBall.color) ||
        ((ball.x === targetBall.x) && (ball.y === targetBall.y + 1) && ball.color === targetBall.color) ||
        ((ball.x === targetBall.x) && (ball.y === targetBall.y - 1) && ball.color === targetBall.color)
    );
  }

  findPath(ball, balls, dirtyBalls){
    balls.push(ball);
    dirtyBalls.push(ball);

    const neighbours = this.getBallNeighbours(ball);

    const comboBalls =
      neighbours
        .filter(
          neighbour => (
            neighbour &&
            !dirtyBalls.find(ball => ball === neighbour)
          )
        );

    if (comboBalls.length === 0) {
      //console.log(balls);
      return balls;
    } else {
      //console.log(comboBalls.map(ball => this.findPath(ball, bufferBalls, bufferDirtyBalls)));
      const values = comboBalls.map(ball => {
        const bufferBalls = [...balls];
        const bufferDirtyBalls = [...bufferBalls];
        return this.findPath(ball, bufferBalls, bufferDirtyBalls)
      });
      return values.sort((a, b) => b.length - a.length)[0];
    }
  }

  checkCombos(balls = this.balls){

    const test = [];

    const maxCombosAll = [];

    balls.forEach(ball => {

      if (~test.indexOf(ball)) return false;

      const dirtyBalls = [];
      const balls = [];

      const path = this.findPath(
        ball,
        balls,
        dirtyBalls
      );

      test.push(...path);

      const size = path.length;

      maxCombosAll.push({
        color: ball.color,
        size
      });
    });

    const maxCombosColor =
      maxCombosAll.reduce((result, combo) => {
        if (combo.size > 1) {
          if (result[combo.color]) {
            result[combo.color] = Math.max(result[combo.color], combo.size);
          } else {
            result[combo.color] = combo.size;
          }
        }
        return result;
      }, {});

    return maxCombosColor;
  }

  spawnExtraBalls(clearedBalls){

    const unusedCoords = [];

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        unusedCoords.push({x, y});
      }
    }

    this.balls.forEach(ball => {
      const coord = unusedCoords.find(item => item.x === ball.x && item.y === ball.y);
      if(coord) {
        unusedCoords.splice(unusedCoords.indexOf(coord), 1);
      }
    });

    clearedBalls.forEach(ball => {

      const newCoords = unusedCoords.pop();

      const {x, y} = newCoords;

      let color = getRandomColor();

      const spawnBall = ball;
      spawnBall.setGridPos({x, y});
      spawnBall.color = color;

      if (clearedBalls.length === 0) {
        let isCombo = Object.keys(this.checkCombos([...this.balls, {obj: spawnBall, color, x, y}])).length > 0;

        if (!isCombo) {
          if (this.helpSpawns > 0) {
            while (!isCombo) {
              color = getRandomColor();
              spawnBall.color = color;
              isCombo = Object.keys(this.checkCombos([...this.balls, {obj: spawnBall, color, x, y}])).length > 0;
            }
            this.helpSpawns -= 1;
            console.log(this.helpSpawns);
          } else {
            alert('Донать сука!');
          }
        }
      }

      spawnBall.render();
      spawnBall.sprite[1].setImageSrc(getColorSrc(color));

      spawnBall.sprite[0].setAlpha(0);
      spawnBall.sprite[0].resize(0.5);
      spawnBall.sprite[1].setAlpha(0);
      spawnBall.sprite[1].resize(1);

      spawnBall.selected = false;

      const startY = this.coords.y - BALL_SIZE * (this.size - y) - getRandom(0, BALL_SIZE / 2);
      spawnBall.moveTo({
        x: this.coords.x  + BALL_SIZE * x,
        y: startY
      });

      spawnBall.sprite[1].setAlpha(1, 200);
      const endY = this.coords.y + BALL_SIZE * y;

      spawnBall.moveTo({
        x: this.coords.x  + BALL_SIZE * x,
        y: endY
      }, (endY - startY) / 5);

      spawnBall.sprite[1].rotate(getRandom(-90, 90));

      this.balls.push({obj: spawnBall, color, x, y});
    });
    console.log(this.checkCombos());
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

const offset = {
  x: (gc.srcSize.w - BALL_SIZE * GRID_SIZE ) / 2,
  y: (gc.srcSize.h - BALL_SIZE * GRID_SIZE ) - 200
};

export const YarnGrid = new Grid(offset, GRID_SIZE);