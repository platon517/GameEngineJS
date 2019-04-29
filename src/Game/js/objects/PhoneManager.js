import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {animation_creator} from "../utilities/animation_creator";
import {GameObject} from "./GameObject";
import {Collider} from "../../../Engine/Collider/Collider";

export const PhoneManager = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/phone/phone.png',
      {x: 0, y: 0},
      {w: 48, h: 96},
      {w: 48 * gc.mult, h: 96 * gc.mult});

    this.sprite.addAnimation({
      title: 'call',
      config: {
        frames: animation_creator(48, 0, 5),
        time: 800
      }
    });

    this.collider = new Collider( {x: 0, y: 0}, { w: 28 * gc.mult, h: 34 * gc.mult }, {x: 10 * gc.mult, y: 34 * gc.mult});

    this.moveTo({x: 93 * gc.mult, y: 200 * gc.mult});

    this.setInit(() => {
      this.render();
      this.setRenderIndex(2);
    })
  }
};