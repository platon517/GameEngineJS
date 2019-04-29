import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {animation_creator} from "../utilities/animation_creator";
import {GameObject} from "./GameObject";
import {Collider} from "../../../Engine/Collider/Collider";

export const Folder = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite('img/folder/folder-fast.png', {x: 0, y: 0}, {w: 96, h: 80}, {w: 96 * gc.mult, h: 80 * gc.mult});
    this.sprite.addAnimation({
      title: 'nextPage',
      config: {
        frames: animation_creator(96, 0, 14),
        time: 1200
      }
    });

    this.collider = new function () {
      this.colliderArr = [
        new Collider({x: 0, y: 0}, {w: 32 * gc.mult, h: 24 * gc.mult}, {x: 14 * gc.mult, y: 16 * gc.mult}),
        new Collider({x: 0, y: 0}, {w: 30 * gc.mult, h: 20 * gc.mult}, {x: 11 * gc.mult, y: 44 * gc.mult}),
        new Collider({x: 0, y: 0}, {w: 28 * gc.mult, h: 20 * gc.mult}, {x: 57 * gc.mult, y: 16 * gc.mult}),
        new Collider({x: 0, y: 0}, {w: 28 * gc.mult, h: 20 * gc.mult}, {x: 57 * gc.mult, y: 42 * gc.mult}),
      ];
      this.moveTo = (...args) => {
        for (let i in this.colliderArr) {
          this.colliderArr[i].moveTo(...args);
        }
      };
      this.update = (ctx) => {
        for (let i in this.colliderArr) {
          this.colliderArr[i].update(ctx);
        }
      }
    };

    this.moveTo({x: 96 * gc.mult, y: 154 * gc.mult});
    this.moveTo({x: 96 * gc.mult, y: 76 * gc.mult}, 300);

    this.setInit(() => {
      this.render();
      setTimeout(()=>{
        this.moveTo({x: 96 * gc.mult, y: 82 * gc.mult}, 100)
      }, 300);
    })
  }
};