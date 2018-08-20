import {
  cursorObject, folderObject, islandOneObject, islandThreeOneObject,
  islandTwoObject, islandThreeTwoObject, flag_1, readyBlockObject, menuButton, EngineVisual, enemyPlate
} from "./js/objects_initializing";

export const mousePos = {
  x: 0,
  y: 0
};

EngineVisual.gameWindow.onmousemove = getMousePos.bind(this);
EngineVisual.gameWindow.onclick = () => {
  cursorObject.targetElement.click();
};
EngineVisual.gameWindow.onmousedown = () => {
  cursorObject.targetElement.onMouseDown();
};
EngineVisual.gameWindow.onmouseup = () => {
  cursorObject.targetElement.onMouseUp();
};

function getMousePos(evt) {
  let rect = EngineVisual.gameWindow.getBoundingClientRect();
  mousePos.x = evt.clientX - rect.left;
  mousePos.y = evt.clientY - rect.top;

  cursorObject.moveTo({x: mousePos.x - 12, y: mousePos.y});
};

function update() {
  EngineVisual.update();

  EngineVisual.renderList.get().map( item => {
    if (item.obj.collider !== undefined) {
      item.obj.collider.update(EngineVisual.ctx);
    }
  });

  requestAnimationFrame(update);
}
update();
