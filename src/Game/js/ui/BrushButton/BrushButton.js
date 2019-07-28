import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import {ARIAL_FONT, CENTER, Text} from "../../../../Engine/Text/Text";
import {gc} from "../../game_config";

const Z_INDEX = 80;

export class BrushButton extends GameObject {
  constructor(coords, size) {
    super();
    this.sprite = new Sprite(
      "img/brush_button/brush_button.png",
      { x: 0, y: 0 },
      { w: 450, h: 450 },
      size
    );

    this.text = new Text
    (
      `3`,
      ARIAL_FONT,
      20 * gc.modifer,
      '#9123cd',
      'bold',
      {x: this.getCoords().x, y: this.getCoords().y},
      { x: 20 * gc.modifer, y: 56 * gc.modifer },
      {w: size.w, h: 28 * gc.modifer}
    );

    this.text.textAllign(CENTER);

    this.ui = [this.text];

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
