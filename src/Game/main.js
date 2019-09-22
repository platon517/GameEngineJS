import {engineVisual} from "../Engine/VisualRender/VisualRenderComponent";
import {CoreScene} from "./js/scenes/CoreScene";

/*let lastUpdate = new Date().getTime();*/

function update() {
  engineVisual.update();

  requestAnimationFrame(update);

  /*const nowTime = new Date().getTime();
  document.getElementById('fps').innerText = `${(1000 / (nowTime - lastUpdate)).toFixed(0)}`;
  lastUpdate = nowTime;*/

  //setTimeout(update, 100);
}
setTimeout(update, 0);


CoreScene.init();