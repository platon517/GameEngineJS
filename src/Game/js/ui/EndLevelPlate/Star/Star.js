import { GameObject } from "../../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../../Engine/Sprite/Sprite";

const Z_INDEX = 100;

export class Star extends GameObject {
  constructor(coords = {x: 0, y: 0}, size = {w: 50, h: 50}) {
    super();
    this.sprite = new Sprite(
      "img/plate/s1.png",
      { x: 0, y: 0 },
      { w: 300, h: 300 },
      size
    );

    this.moveTo(coords);

    this.sprite.setAlpha(0);
    this.sprite.resize(1.5);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  spawn(gold = true){
    const time = 300;
    this.sprite.setImageSrc(gold ? 'img/plate/s1.png' : 'img/plate/s2.png');
    this.sprite.setAlpha(1, time);
    this.sprite.resize(1, time);
  }

  tick() {
    super.tick();
  }
}
