import {Collider} from "../../../Engine/Collider/Collider";
import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {engineVisual} from "../../../Engine/VisualRender/VisualRenderComponent";
import {GameObject} from "./GameObject";

export const POINTER = 'pointer';
export const DEFAULT = 'default';

const mousePos = {
  x: 0,
  y: 0
};

const getMousePos = evt => {
  let rect = engineVisual.gameWindow.getBoundingClientRect();
  mousePos.x = evt.clientX - rect.left;
  mousePos.y = evt.clientY - rect.top;

  CursorObject.moveTo({x: mousePos.x - 12, y: mousePos.y});
  if (CursorObject.collider.getInteractions().size !== 0) {
    CursorObject.setType(POINTER);
  } else {
    CursorObject.setType(DEFAULT);
  }
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
      { w: 12 * gc.mult, h: 12 * gc.mult },
      { x: 0, y: 0 }
    );

    engineVisual.gameWindow.onmousemove = getMousePos;
    engineVisual.gameWindow.onclick = () => {
      this.click();
    };
    engineVisual.gameWindow.onmousedown = () => {
      CursorObject.targetElement.onMouseDown();
    };
    engineVisual.gameWindow.onmouseup = () => {
      CursorObject.targetElement.onMouseUp();
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
    this.targetElement = null;
    this.click = () => {
      this.collider.getInteractions().forEach(item => console.log(item));
      if (this.targetElement !== null) {
        this.targetElement.click();
      }
    };
    this.setInit(() => {
      this.render();
      this.setRenderIndex(999);
    });
  }
};