import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Collider} from "../../../../Engine/Collider/Collider";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {BLOCK, PlayerCharacter} from "../lich/Lich";
import {zIndexManager} from "../../utilities/zIndexManager";
import {animation_creator} from "../../utilities/animation_creator";

const Z_INDEX = 7;

export class EvilEye extends GameObject {
  constructor(isRed = true, spawnCoords = {x: 34 * gc.mult, y: 86 * gc.mult}){
    super();

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 8 * gc.mult, h: 1 * gc.mult },
      { x: 3 * gc.mult, y: 12 * gc.mult },
    );

    this.collider.setType(BLOCK);

    this.sprite = new Sprite(
      `img/chars/evil_eye/${isRed ? 'eye_map' : 'eye_2_map'}.png`,
      isRed ? { x: 16, y: 0 } : { x: 208, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );

    this.sprite.addAnimation({
      title: 'idle',
      config: {
        frames: isRed ? animation_creator(16, 0, 4) : animation_creator(16, 0, 4, '-x', 208),
        time: 600
      }
    });

    this.sprite.addAnimation({
      title: 'close',
      config: {
        frames: isRed ? animation_creator(16, 0, 4, 'x', 64) : animation_creator(16, 0, 4, '-x', 144),
        time: 500
      }
    });

    this.sprite.addAnimation({
      title: 'open',
      config: {
        frames: isRed ? animation_creator(16, 0, 4, 'x', 128) : animation_creator(16, 0, 4, '-x', 80),
        time: 500
      }
    });

    this.sprite.addAnimation({
      title: 'attack',
      config: {
        frames: isRed ? animation_creator(16, 32, 14) : animation_creator(16, 32, 14, '-x', 208),
        time: 1500
      }
    });

    this.sprite.addAnimation({
      title: 'die',
      config: {
        frames: isRed ? animation_creator(16, 16, 5) : animation_creator(16, 16, 5, '-x', 208),
        time: 600
      }
    });

    this.moveTo(spawnCoords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
      this.sprite.playAnimation('idle', true);
    });
  }
  die(){
    this.sprite.playAnimation('die');
    this.collider.setDisabled(true);
  }
  close(){
    this.sprite.playAnimation('close', false, true);
  }
  open(){
    this.sprite.playAnimation('open');
    const delay = this.sprite.getAnimationInfo('open').time;
    setTimeout(() => {
      this.sprite.playAnimation('idle', true);
    }, delay);
  }
  tick(){
    super.tick();
    zIndexManager(Z_INDEX, this, PlayerCharacter)
  }
}