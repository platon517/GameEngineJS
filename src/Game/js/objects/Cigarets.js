import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {GameObject} from "./GameObject";

export const Cigarets = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/cigarets/cigarets.png',
      {x: 0, y: 0},
      {w: 19, h: 16},
      {w: 19 * gc.mult, h: 16 * gc.mult}
    );
    this.moveTo({x: 104 * gc.mult, y: 200 * gc.mult});
    this.setInit(() => {
      this.render();
    })
  }
};
