import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { BALL_SIZE } from "../YarnBall/YarnBall";

const Z_INDEX = 99;

export class StarParticle extends GameObject {
  constructor(
    size = { w: BALL_SIZE / 2, h: BALL_SIZE / 2 },
    coords = { x: 0, y: 0 }
  ) {
    super();

    this.sprite = new Sprite(
      'img/star/star_yellow.png',
      {x: 0, y: 0},
      {w: 350, h: 350},
      size
    );

    this.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  tick() {
    super.tick();
  }
}
