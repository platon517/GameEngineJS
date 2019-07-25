import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite, SquareSprite } from "../../../../Engine/Sprite/Sprite";
import { gc } from "../../game_config";
import { ARIAL_FONT, CENTER, Text } from "../../../../Engine/Text/Text";

const Z_INDEX = 99;

export class EndLevelPlate extends GameObject {
  constructor(coords = {x: 0, y: 0}, size = {w: 400, h: 292.5}) {
    super();

    const raysW = size.w * 4;
    this.sprite = [
      new SquareSprite(gc.srcSize, 'white', {x: -coords.x, y: -coords.y}),
      new Sprite(
        "img/rays/rays.png",
        { x: 0, y: 0 },
        { w: 1000, h: 1000 },
        { w: raysW, h: raysW},
        { x: -(raysW / 2) + size.w / 2, y: -(raysW / 2) + size.h / 2}
      ),
      new Sprite(
        "img/plate/plate.png",
        { x: 0, y: 0 },
        { w: 1600, h: 1170 },
        size
      ),
    ];

    this.sprite[0].setAlpha(0);
    this.sprite[1].setAlpha(0);
    this.sprite[2].setAlpha(0);

    this.sprite[1].resize(0);
    this.sprite[2].resize(0.8);

    this.text = new Text
    (
      ``,
      ARIAL_FONT,
      23 * gc.modifer,
      '#9f91cc',
      'bold',
      {x: this.getCoords().x, y: this.getCoords().y},
      { x: 0, y: 50 * gc.modifer },
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

  spawn(win = true){
    const time = 200;

    const rays = 1;
    const plate = 2;

    this.sprite[0].setColor(win ? 'white' : 'black');

    this.sprite[0].setAlpha(0.9, time);

    setTimeout(() => {
      this.sprite[plate].setAlpha(1, time / 2);

      if (win) {
        this.sprite[rays].resize(1, time * 2);
        this.sprite[rays].setAlpha(0.25, time * 2);
        this.sprite[rays].rotate(360, 15000, true);
      }

      this.sprite[plate].resize(1.05, time * 0.75);
      setTimeout(() => {
        this.sprite[plate].resize(1, time * 0.25);
      }, time * 0.75);
      this.text.text(win ? 'Level Completed': 'Level Failed', 50);
    }, time);
  }

  tick() {
    super.tick();
  }
}
