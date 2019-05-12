import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {animation_creator} from "../../utilities/animation_creator";

class Lich extends GameObject{
  constructor(){
    super();
    this.sprite = new Sprite(
      "img/chars/lich/lich-map.png",
      { x: 0, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );

    this.sprite.addAnimation({
      title: 'walk',
      config: {
        frames: animation_creator(16, 0, 2),
        time: 200
      }
    });

    this.sprite.addAnimation({
      title: 'confused',
      config: {
        frames: animation_creator(16, 16, 2),
        time: 300
      }
    });

    this.sprite.addAnimation({
      title: 'attack',
      config: {
        frames: animation_creator(16, 32, 15),
        time: 1500
      }
    });

    this.sprite.addAnimation({
      title: 'ult',
      config: {
        frames: animation_creator(16, 48, 34),
        time: 3500
      }
    });

    this.sprite.moveTo({x: 64 * gc.mult, y: 86 * gc.mult});

    this.setInit(() => {
      this.render();
      this.setRenderIndex(3);
    });
  }
}

export const PlayerCharacter = new Lich();