import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {animation_creator} from "../../utilities/animation_creator";
import {engineVisual} from "../../../../Engine/VisualRender/VisualRenderComponent";
import {Collider} from "../../../../Engine/Collider/Collider";

class Lich extends GameObject{
  constructor(){
    super();

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 10 * gc.mult, h: 1 * gc.mult },
      { x: 3 * gc.mult, y: 15 * gc.mult },
    );

    this.sprite = new Sprite(
      "img/chars/lich/lich-map.png",
      { x: 0, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );

    this.moveTo({x: 64 * gc.mult, y: 86 * gc.mult});

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

    engineVisual.addKeysEvent(37, () => {
      this.moveTo({
        x: this.sprite._coords.x - 1 * gc.mult, y: this.sprite._coords.y
      })
    });

    engineVisual.addKeysEvent(39, () => {
      this.moveTo({
        x: this.sprite._coords.x + 1 * gc.mult, y: this.sprite._coords.y
      })
    });

    engineVisual.addKeysEvent(38, () => {
      this.moveTo({
        x: this.sprite._coords.x, y: this.sprite._coords.y - 1 * gc.mult
      })
    });

    engineVisual.addKeysEvent(40, () => {
      this.moveTo({
        x: this.sprite._coords.x, y: this.sprite._coords.y + 1 * gc.mult
      })
    });

    this.setInit(() => {
      this.render();
      this.setRenderIndex(3);
    });
  }
}

export const PlayerCharacter = new Lich();