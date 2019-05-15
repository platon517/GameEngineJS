import {engineVisual} from "../Engine/VisualRender/VisualRenderComponent";
import {CoreScene} from "./js/scenes/CoreScene";

CoreScene.init();

function update() {
  engineVisual.update();

  requestAnimationFrame(update);
  //setTimeout(update, 100);
}
setTimeout(update, 0);
