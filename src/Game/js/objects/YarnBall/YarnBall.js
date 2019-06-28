import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../Engine/Collider/Collider";
import { MainCursor } from "../Cursor/Cursor";
import { YarnGrid } from "../Grid/Grid";

export const BLUE = 'BLUE';
export const GREEN = 'GREEN';
export const PINK = 'PINK';
export const PURPLE = 'PURPLE';
export const YELLOW = 'YELLOW';
const Z_INDEX = 10;

export const BALL_SIZE = 120 * 2;

const getColorSrc = color => {
  switch (color) {
    case BLUE:
      return 'img/YarnBalls/png/yarn_blue.png';
    case GREEN:
      return 'img/YarnBalls/png/yarn_green.png';
    case PINK:
      return 'img/YarnBalls/png/yarn_pink.png';
    case PURPLE:
      return 'img/YarnBalls/png/yarn_purple.png';
    case YELLOW:
      return 'img/YarnBalls/png/yarn_yellow.png';
  }
};

export class YarnBall extends GameObject {
  constructor(coords, color){
    super();
    this.sprite = new Sprite(
      getColorSrc(color),
      { x: 0, y: 0 },
      { w: 370, h: 370 },
      { w: BALL_SIZE, h: BALL_SIZE },
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: BALL_SIZE, h: BALL_SIZE },
      { x: 0, y: 0 },
    );

    this.collider.addInteractionObject(MainCursor);

    this.moveTo(coords);

    this.selected = false;

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });

  }
  tick(){
    super.tick();
    if (this.collider.getInteractions().has(MainCursor.collider)) {
      if (!this.selected) {
        YarnGrid.disableColliders(this);
        this.sprite.rotate(15);
        this.selected = true;
      }
    }
  }
}