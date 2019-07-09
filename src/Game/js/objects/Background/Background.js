import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";

const Z_INDEX = 0;

export class Background extends GameObject {
  constructor(
    sprite,
    inner_coords = { x: 0, y: 0 },
    inner_size = { w: 300, h: 300 },
    size = { w: 40, h: 40 },
    offset = { x: 0, y: 0 },
    coords
  ) {
    super();
    this.sprite = new Sprite(
      sprite,
      inner_coords,
      inner_size,
      size,
      offset
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
