import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { ARIAL_FONT, CENTER, Text } from "../../../../Engine/Text/Text";
import { gc } from "../../game_config";
import { GameStates } from "../../scenes/CoreScene";

const Z_INDEX = 10;

export class TurnsCounter extends GameObject {
  constructor(coords={x: 0, y: 0}, size={w: 0, h: 0}, turns = 0) {
    super();
    this.sprite = new Sprite(
      "img/turns_counter/counter.png",
      { x: 0, y: 0 },
      { w: 610, h: 310 },
      size
    );

    this.moveTo(coords);

    this._turns = turns;

    this.text = new Text
      (
        `${this._turns}`,
        ARIAL_FONT,
        27 * gc.modifer,
        'white',
        'bold',
        {x: this.getCoords().x, y: this.getCoords().y},
        { x: 40 * gc.modifer, y: 33 * gc.modifer },
        { w: 50 * gc.modifer, h: 30 * gc.modifer }
      );

    this.text.textAllign(CENTER);

    this.ui = [this.text];

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);

      this.spawn();
    });
  }

  incTurns(val = 1){
    this._turns = `${parseFloat(this._turns) + val}`;
    this.text.text(this._turns);
  }

  decTurns(val = 1){
    if (this._turns <= 0) return false;

    this._turns = `${parseFloat(this._turns) - val}`;
    this.text.text(this._turns);

    if (this._turns <= 0) {
      GameStates.gameOver = true;
    }
  }

  getTurns(){
    return this._turns;
  }

  spawn(){
    const time = 300;
    this.sprite.resize(0.9);
    this.sprite.setAlpha(0);

    this.sprite.setAlpha(1, time);
    this.sprite.resize(1.05, time * 0.75);
    setTimeout(() => {
      this.sprite.resize(1, time * 0.25);
    }, time * 0.75)
  }

  tick() {
    super.tick();
  }
}
