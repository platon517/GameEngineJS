import {
  cigarets,
  enemyPlayer1, enemyPlayer2, enemyPlayer3, folderObject, phoneManager,
  readyBlockObject
} from "../objects_initializing";
import {gc} from "../game_config";
import {EngineVisual} from "../objects/EngineVisual";

export const startGameAnimation = () => {
  folderObject.moveTo({x: 142 * gc.mult, y: 82 * gc.mult}, 240);
  setTimeout(() => {
    folderObject.moveTo({x: 138 * gc.mult, y: 82 * gc.mult}, 100)
  }, 300);
  readyBlockObject.moveTo({x: 50 * gc.mult, y: 90 * gc.mult}, 100);
  setTimeout(() => {
    readyBlockObject.moveTo({x: 50 * gc.mult, y: 160 * gc.mult}, 240);
    setTimeout(() => {
      EngineVisual.renderList.delete(readyBlockObject);
    }, 250)
  }, 140);


  setTimeout(() => {
    enemyPlayer1.moveTo({x: 50 * gc.mult, y: 90 * gc.mult}, 200);
    setTimeout(() => {
      enemyPlayer1.moveTo({x: 50 * gc.mult, y: 94 * gc.mult}, 60);
    }, 200)
  }, 400);
  setTimeout(() => {
    enemyPlayer2.moveTo({x: 50 * gc.mult, y: 110 * gc.mult}, 200);
    setTimeout(() => {
      enemyPlayer2.moveTo({x: 50 * gc.mult, y: 114 * gc.mult}, 60);
    }, 200)
  }, 450);
  setTimeout(() => {
    enemyPlayer3.moveTo({x: 50 * gc.mult, y: 130 * gc.mult}, 200);
    setTimeout(() => {
      enemyPlayer3.moveTo({x: 50 * gc.mult, y: 134 * gc.mult}, 60);
    }, 200)
  }, 500);

  setTimeout(() => {
    phoneManager.moveTo({x: 93 * gc.mult, y: 60 * gc.mult}, 200);
    cigarets.moveTo({x: 104 * gc.mult, y: 134 * gc.mult}, 200);
    setTimeout(() => {
      phoneManager.moveTo({x: 93 * gc.mult, y: 64 * gc.mult}, 60);
      cigarets.moveTo({x: 104 * gc.mult, y: 138 * gc.mult}, 60);
    }, 200);

    setTimeout(() => {
      phoneManager.sprite.playAnimation('call', true);
    }, 2000)

  }, 450);

};

