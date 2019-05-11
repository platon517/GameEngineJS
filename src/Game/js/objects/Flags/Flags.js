import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {gc} from "../../game_config";
import {animation_creator} from "../../utilities/animation_creator";
import {GameObject} from "../../../../Engine/GameObject/GameObject";

class FlagCreator extends GameObject {
  constructor(type){
    super();
    const spritePath = `img/flags/${type}/flag-${type}.png`;
    this.sprite = new Sprite(spritePath, {x: 0, y: 0}, {w: 16, h: 16}, {w: 16 * gc.mult, h: 16 * gc.mult})
    this.sprite.addAnimation({
      title: 'idle',
      config: {
        frames: animation_creator(16, 0, 4),
        time: 600
      }
    });
    this.sprite.playAnimation('idle', true);
    this.setInit(() => {
      this.render();
    })
  }
}

export const Flag_1 = new FlagCreator(1);