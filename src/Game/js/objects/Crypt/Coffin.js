import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../Engine/Collider/Collider";
import {BLOCK, PlayerCharacter} from "../../chars/lich/Lich";
import {zIndexManager} from "../../utilities/zIndexManager";

const Z_INDEX = 7;

class Coffin extends GameObject {
  constructor(coords, open = false){
    super();
    this.sprite = new Sprite(
      open ? "img/crypt/grob/grob-dark.png" : "img/crypt/grob/grob-closed.png",
      { x: 0, y: 0 },
      { w: 32, h: 32 },
      { w: 32 * gc.mult, h: 32 * gc.mult },
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 20 * gc.mult, h: 9 * gc.mult },
      { x: 6 * gc.mult, y: 13 * gc.mult },
    );
    this.collider.addInteractionObject(PlayerCharacter);

    this.collider.type = BLOCK;

    this.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }
  tick(){
    super.tick();
    zIndexManager(Z_INDEX, this, PlayerCharacter)
  }
}

export const CoffinClosedLeft = new Coffin({x: 10 * gc.mult, y: 96 * gc.mult});
export const CoffinClosedRight = new Coffin({x: 86 * gc.mult, y: 96 * gc.mult});
export const CoffinOpened = new Coffin({x: 48 * gc.mult, y: 96 * gc.mult}, true);