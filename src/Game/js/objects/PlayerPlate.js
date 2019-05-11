import {Sprite} from "../../../Engine/Sprite/Sprite";
import {CENTER, PIXEL_ENG_FONT, Text} from "../../../Engine/Text/Text";
import {gc} from "../game_config";
import {GameObject} from "../../../Engine/GameObject/GameObject";
import {ProgressBar} from "../../../Engine/ProgressBar/ProgressBar";

const Picture = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/player-plate/player-picture/player-pic.png',
      {x: 0, y: 0},
      {w: 41, h: 21},
      {w: 41 * gc.mult, h: 21 * gc.mult}
    );
  }
};

export const PlayerPlate = new class extends GameObject {
  constructor() {
    super();
    this.pic = Picture;
    this.sprite = new Sprite(
      'img/player-plate/player-plate.png',
      {x: 0, y: 0},
      {w: 45, h: 59},
      {w: 45 * gc.mult, h: 59 * gc.mult}
    );

    const color = '#232323';

    const territoryIcon = new Text('T', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 4.5 * gc.mult, y: 34.5 * gc.mult});
    const territoryValue = new Text('107', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 28 * gc.mult, y: 34.5 * gc.mult});
    territoryValue.textAllign(CENTER);

    const moneyIcon = new Text('$', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 4.5 * gc.mult, y: 44.5 * gc.mult});
    const moneyValue = new Text('584', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 28 * gc.mult, y: 44.5 * gc.mult});
    moneyValue.textAllign(CENTER);

    const humanIcon = new Text('C', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 4.5 * gc.mult, y: 54.5 * gc.mult});
    const humanValue = new Text('7', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 28 * gc.mult, y: 54.5 * gc.mult});
    humanValue.textAllign(CENTER);

    const progressBar = new ProgressBar(41 * gc.mult, 3 * gc.mult, '#b4202a', '#285cc4', {x: 2 * gc.mult, y: 23 * gc.mult});

    progressBar.setValue(Math.random().toFixed(1), 300);

    this.ui.push(
      moneyIcon,
      moneyValue,
      territoryIcon,
      territoryValue,
      humanIcon,
      humanValue,
      progressBar
    );


    this.moveTo({x: 2 * gc.mult, y: 94 * gc.mult});
    this.pic.moveTo({x: 4 * gc.mult, y: 96 * gc.mult});

    this.setInit(() => {
      this.render();
      this.pic.render();
      this.pic.setRenderIndex(2);
    });
  }
};