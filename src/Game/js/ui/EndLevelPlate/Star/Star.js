import { GameObject } from "../../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../../Engine/Sprite/Sprite";

const Z_INDEX = 99;

export class Star extends GameObject {
  constructor(coords = {x: 0, y: 0}, size = {w: 400, h: 292.5}) {
    super();

    const raysW = size.w * 4;
    this.sprite = new Sprite(
      "img/plate/s1.png",
      { x: 0, y: 0 },
      { w: 1000, h: 1000 },
      { w: raysW, h: raysW},
      { x: -(raysW / 2) + size.w / 2, y: -(raysW / 2) + size.h / 2}
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
