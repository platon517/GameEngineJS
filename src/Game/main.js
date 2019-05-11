import {engineVisual} from "../Engine/VisualRender/VisualRenderComponent";
import {CoreScene} from "./js/scenes/CoreScene";

CoreScene();

function update() {
  engineVisual.update();

  requestAnimationFrame(update);
}
setTimeout(update, 0);
