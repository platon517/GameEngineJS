import {EngineVisual} from "./js/objects/EngineVisual";
import {CoreScene} from "./js/scenes/CoreScene";

CoreScene();

function update() {
  EngineVisual.update();

  EngineVisual.renderList.get().map( item => {
    if (item.obj.collider !== undefined) {
      item.obj.collider.update(EngineVisual.ctx);
    }
  });

  requestAnimationFrame(update);
}
setTimeout(update, 0);
