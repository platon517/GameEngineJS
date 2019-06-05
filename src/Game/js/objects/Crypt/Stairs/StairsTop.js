import {gc} from "../../../game_config";
import {GameObject} from "../../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../../Engine/Collider/Collider";
import {PlayerCharacter} from "../../../chars/lich/Lich";
import {BlackScreen} from "../../Common/BlackScreen";
import {TextAreaBottom} from "../../../ui/TextArea";
import {GO_AWAY, local, TEST} from "../../../../localization/localization";

export const StairsTop = new (class extends GameObject {
  constructor() {
    super();

    this.wentAway = false;

    this.sprite = new Sprite(
      "img/crypt/stairs/stairs_top.png",
      { x: 0, y: 0 },
      { w: 128, h: 128 },
      { w: 128 * gc.mult, h: 128 * gc.mult },
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 32 * gc.mult, h: 30 * gc.mult },
      { x: 48 * gc.mult, y: 44 * gc.mult },
    );
    this.collider.addInteractionObject(PlayerCharacter);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(8);
    });
  }
  goAway(){
    console.log('went away');
    BlackScreen.sprite.setAlpha(1, 1000);
    setTimeout(() => {
      TextAreaBottom.init();
      TextAreaBottom.ui[0].text(TEST[local], 40);
    }, 1500);


    TextAreaBottom.addEndEvent(() => {
      setTimeout(() => {
        TextAreaBottom.init();
        TextAreaBottom.ui[0].text('НАСТЯ, ПАШЛА НАХУЙ', 40);

        TextAreaBottom.addEndEvent(() => {
          setTimeout(() => {
            TextAreaBottom.init();
            TextAreaBottom.ui[0].text('КЕК ЛОЛ МЕМ', 40);
          }, 500);
        });

      }, 500);
    });

    this.wentAway = true;
    PlayerCharacter.walkTo({
      x: PlayerCharacter.getCoords().x,
      y: 0
    }, 2100);
  }
  tick(){
    super.tick();
    if (!this.wentAway && this.collider.getInteractions().has(PlayerCharacter.collider)) {
      this.goAway();
    }
  }
})();