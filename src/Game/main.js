import {engineVisual} from "../Engine/VisualRender/VisualRenderComponent";
import {CoreScene} from "./js/scenes/CoreScene";

CoreScene();

function update() {
  engineVisual.update();

  engineVisual.renderList.get().map( item => {
    if (item.obj.collider !== undefined) {
      item.obj.collider.update(engineVisual.ctx);
    }
  });

  requestAnimationFrame(update);
}
setTimeout(update, 0);
