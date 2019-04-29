import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {GameObject} from "./GameObject";
import {Collider} from "../../../Engine/Collider/Collider";

export const MenuButton = new class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      'img/ui-buttons/menu/menu-button.png',
      {x: 0, y: 0},
      {w: 16, h: 16},
      {w: 16 * gc.mult, h: 16 * gc.mult}
    );

    this.collider = new Collider( {x: 0, y: 0}, { w: 12 * gc.mult, h: 12 * gc.mult }, {x: 2 * gc.mult, y: 2 * gc.mult});

    this.collider.setMouseDown(()=>{
      this.sprite.changeNowState({x: 16, y: 0});
    });

    this.collider.setMouseUp(()=>{
      this.sprite.changeNowState({x: 0, y: 0});
    });

    this.collider.setMouseLeave(() => {
      this.sprite.changeNowState({x: 0, y: 0});
    });

    this.moveTo({x: 1 * gc.mult, y: 1 * gc.mult});

    this.setInit(() => {
      this.render();
      this.setRenderIndex(998);
    });
  }
};