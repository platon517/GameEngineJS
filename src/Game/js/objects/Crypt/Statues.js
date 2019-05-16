import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../Engine/Collider/Collider";
import {BLOCK, PlayerCharacter} from "../../chars/lich/Lich";
import {zIndexManager} from "../../utilities/zIndexManager";

const Z_INDEX = 7;

class Statue extends GameObject {
  constructor(coords, destroyed = false){
    super();

    this.sprite = new Sprite(
      destroyed ? "img/crypt/statue/statue-1-destroyed.png" : "img/crypt/statue/statue-1.png",
      { x: 0, y: 0 },
      { w: 16, h: 32 },
      { w: 16 * gc.mult, h: 32 * gc.mult },
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 10 * gc.mult, h: 10 * gc.mult },
      { x: 3 * gc.mult, y: 19 * gc.mult },
    );
    this.collider.addInteractionObject(PlayerCharacter);

    this.collider.setType(BLOCK);

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

export const StatueLeft = new Statue({x: 16 * gc.mult, y: 59 * gc.mult});
export const StatueRight = new Statue({x: 96 * gc.mult, y: 59 * gc.mult}, true);