import {EngineVisual} from "./js/objects/EngineVisual";
import * as objects from './js/objects_initializing';


function update() {
  //console.log(EngineVisual.renderList);
  EngineVisual.update();

  EngineVisual.renderList.get().map( item => {
    if (item.obj.collider !== undefined) {
      item.obj.collider.update(EngineVisual.ctx);
    }
  });

  requestAnimationFrame(update);
}
setTimeout(update, 0);
//setInterval(update, 10000);
