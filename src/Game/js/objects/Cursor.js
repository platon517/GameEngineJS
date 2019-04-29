import {Collider} from "../../../Engine/Collider/Collider";
import {Sprite} from "../../../Engine/Sprite/Sprite";
import {gc} from "../game_config";
import {EngineVisual} from "./EngineVisual";
import {GameObject} from "./GameObject";

const mousePos = {
  x: 0,
  y: 0
};

const getMousePos = evt => {
  let rect = EngineVisual.gameWindow.getBoundingClientRect();
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

    EngineVisual.gameWindow.onmousemove = getMousePos.bind(this);
    EngineVisual.gameWindow.onclick = () => {
      CursorObject.targetElement.click();
    };
    EngineVisual.gameWindow.onmousedown = () => {
      CursorObject.targetElement.onMouseDown();
    };
    EngineVisual.gameWindow.onmouseup = () => {
      CursorObject.targetElement.onMouseUp();
    };

    this.setType = (type) => {
      switch (type) {
        case 'pointer':
          CursorObject.sprite.changeNowState({x: 12, y: 0});
          break;
        case 'default':
          CursorObject.sprite.changeNowState({x: 0, y: 0});
      }
    };

    EngineVisual.renderList.add(this);
    EngineVisual.renderList.setZIndex(this, 999);
    //this.collider = new Collider( {x: 0, y: 0}, { w: 12 * gc.mult, h: 12 * gc.mult });
    this.pos = {x: 0, y:0};
    this.size = {w: 12 * gc.mult, h: 12 * gc.mult};
    this.targetElement = null;
    this.click = () => {
      if (this.targetElement !== null) {
        this.targetElement.click();
      }
    };
  }
};