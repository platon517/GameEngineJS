import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Collider} from "../../../../Engine/Collider/Collider";
import { gc } from "../../game_config";
import {YarnGrid} from "../../scenes/CoreScene";

const Z_INDEX = 99;
const SIZE = 10 * gc.modifer;

export class Cursor extends GameObject {
  constructor(coords){
    super();

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: SIZE, h: SIZE },
      { x: 0, y: 0 },
    );

    this.moveTo(coords);

    this.followTouch = e => {
      const multW = gc.srcSize.w / window.innerWidth;
      const multH = gc.srcSize.h / window.innerHeight;
      const point = {
        x: e.touches[0].clientX * multW - SIZE / 2,
        y: e.touches[0].clientY * multH - SIZE / 2,
      };
      this.moveTo(point);
    };

    this.touches = [];

    this.hold = false;
    this.hasMoved = false;

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
      window.ontouchstart = e => {
        if (this.touches.length < 1) {
          this.touches.push(e.touches[0].identifier);
          this.hold = true;
          this.followTouch(e);
        }
      };
      window.ontouchmove = e => {
        if (this.touches.length === 1) {
          this.hasMoved = true;
          this.followTouch(e);
        }
      };
      window.ontouchend = e => {
        console.log(e);
        if (this.touches.length === 1 && this.touches[0] === e.changedTouches[0].identifier) {
          this.touches = [];
          this.hold = false;
          this.hasMoved = false;
          !YarnGrid.ballsDisabled && YarnGrid.clearSelection();
        }
      };
    });

  }
  tick(){
    super.tick();
  }
}