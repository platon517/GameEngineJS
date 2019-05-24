import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {ColliderGroup} from "../../../../Engine/Collider/Collider";
import {gc} from "../../game_config";
import {PlayerCharacter} from "../../chars/lich/Lich";
import {EyeWatcherLeft, EyeWatcherRight} from "../../scenes/CoreScene";

export const HideCollider = new (class extends GameObject{
  constructor(){
    super();

    this._isHide = false;

    this.collider = new ColliderGroup([
      [{ x: 9 * gc.mult, y: 78 * gc.mult }, { w: 10 * gc.mult, h: 8 * gc.mult }],
      [{ x: 60 * gc.mult, y: 118 * gc.mult }, { w: 8 * gc.mult, h: 8 * gc.mult }],
      [{ x: 109 * gc.mult, y: 78 * gc.mult }, { w: 10 * gc.mult, h: 8 * gc.mult }],
    ]);
    this.collider.addInteractionObject(PlayerCharacter);

    this.setInit(() => {
      this.render();
    });
  }

  hide(){
    EyeWatcherLeft.close();
    EyeWatcherRight.close();
  }

  unHide(){
    EyeWatcherLeft.open();
    EyeWatcherRight.open();
  }

  tick(){
    super.tick();
    if (this.collider.getInteractions().has(PlayerCharacter.collider)) {
      if (!this._isHide) {
        this.hide();
        this._isHide = true;
      }
    } else {
      if (this._isHide) {
        this.unHide();
        this._isHide = false;
      }
    }
  }
});