import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Collider} from "../../../../Engine/Collider/Collider";
import { gc } from "../../game_config";
import {YarnGrid} from "../Grid/Grid";

const Z_INDEX = 99;
const SIZE = 40;

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

    this.hold = false;

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
      window.ontouchstart = e => {
        this.hold = true;
        this.followTouch(e);
      };
      window.ontouchmove = e => {
        this.followTouch(e);
      };
      window.ontouchend = e => {
        this.hold = false;
        YarnGrid.clearSelection();
      };
    });

  }
  tick(){
    super.tick();
  }
}

export const MainCursor = new Cursor({x:0, y:0});