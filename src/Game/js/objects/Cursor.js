import {Collider} from "../../../Engine/Collider/Collider";
import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {engineVisual} from "../../../Engine/VisualRender/VisualRenderComponent";
import {GameObject} from "../../../Engine/GameObject/GameObject";

export const POINTER = 'pointer';
export const DEFAULT = 'default';

export const CLICK = 'click';

const mousePos = {
  x: 0,
  y: 0
};

const getMousePos = evt => {
  let rect = engineVisual.gameWindow.getBoundingClientRect();
  mousePos.x = evt.clientX - rect.left;
  mousePos.y = evt.clientY - rect.top;

  CursorObject.moveTo({x: mousePos.x - 12, y: mousePos.y});
};

export const CursorObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/cursors/cursor-sprite.png',
      {x: 0, y: 0},
      {w: 12, h: 12},
      {w: 12 * gc.mult, h: 12 * gc.mult}
    );

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 3 * gc.mult, h: 3 * gc.mult },
      { x: 3 * gc.mult, y: 0 }
    );

    engineVisual.gameWindow.onmousemove = getMousePos;
    engineVisual.gameWindow.onclick = () => {
      this.click();
    };
    engineVisual.gameWindow.onmousedown = () => {
    };
    engineVisual.gameWindow.onmouseup = () => {
    };

    this.setType = (type) => {
      switch (type) {
        case POINTER:
          CursorObject.sprite.changeNowState({x: 12, y: 0});
          break;
        case DEFAULT:
          CursorObject.sprite.changeNowState({x: 0, y: 0});
      }
    };

    this.pos = {x: 0, y:0};
    this.size = {w: 12 * gc.mult, h: 12 * gc.mult};

    this.click = () => {
      this.collider.getInteractions().forEach(collider => {
        collider.callEvent(CLICK);
      });
    };

    this.setInit(() => {
      this.render();
      this.setRenderIndex(3);
    });
  }
  tick(){
    super.tick();
    if (this.collider.getInteractions().size !== 0) {
      CursorObject.setType(POINTER);
    } else {
      CursorObject.setType(DEFAULT);
    }
  }
};