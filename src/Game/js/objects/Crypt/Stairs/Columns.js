import {gc} from "../../../game_config";
import {GameObject} from "../../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../../Engine/Collider/Collider";
import {PlayerCharacter} from "../../../chars/lich/Lich";
import {zIndexManager} from "../../../utilities/zIndexManager";

const Z_INDEX = 7;

export const StairsColumns = new (class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      "img/crypt/stairs/stairs_bottom_columns.png",
      { x: 0, y: 0 },
      { w: 128, h: 128 },
      { w: 128 * gc.mult, h: 128 * gc.mult },
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 2 * gc.mult, h: 1 * gc.mult },
      { x: 64 * gc.mult, y: 80 * gc.mult },
    );
    this.collider.addInteractionObject(PlayerCharacter);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }
  tick(){
    super.tick();
    zIndexManager(Z_INDEX, this, PlayerCharacter)
  }
})();