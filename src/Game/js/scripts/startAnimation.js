import {ReadyButton} from "../objects/ReadyButton";
import {gc} from "../game_config";
import {EngineVisual} from "../objects/EngineVisual";
import {EnemyPlayer1, EnemyPlayer2, EnemyPlayer3} from "../objects/EnemyPlates/EnemyPlates";
import {Folder} from "../objects/Folder";
import {PhoneManager} from "../objects/PhoneManager";
import {Cigarets} from "../objects/Cigarets";

export const startGameAnimation = () => {

  EnemyPlayer1.init();
  EnemyPlayer2.init();
  EnemyPlayer3.init();
  PhoneManager.init();
  Cigarets.init();

  Folder.moveTo({x: 142 * gc.mult, y: 82 * gc.mult}, 240);
  setTimeout(() => {
    Folder.moveTo({x: 138 * gc.mult, y: 82 * gc.mult}, 100)
  }, 300);
  ReadyButton.moveTo({x: 50 * gc.mult, y: 90 * gc.mult}, 100);
  setTimeout(() => {
    ReadyButton.moveTo({x: 50 * gc.mult, y: 160 * gc.mult}, 240);
    setTimeout(() => {
      EngineVisual.renderList.delete(ReadyButton);
    }, 250)
  }, 140);


  setTimeout(() => {
    EnemyPlayer1.moveTo({x: 50 * gc.mult, y: 90 * gc.mult}, 200);
    setTimeout(() => {
      EnemyPlayer1.moveTo({x: 50 * gc.mult, y: 94 * gc.mult}, 60);
    }, 200)
  }, 400);
  setTimeout(() => {
    EnemyPlayer2.moveTo({x: 50 * gc.mult, y: 110 * gc.mult}, 200);
    setTimeout(() => {
      EnemyPlayer2.moveTo({x: 50 * gc.mult, y: 114 * gc.mult}, 60);
    }, 200)
  }, 450);
  setTimeout(() => {
    EnemyPlayer3.moveTo({x: 50 * gc.mult, y: 130 * gc.mult}, 200);
    setTimeout(() => {
      EnemyPlayer3.moveTo({x: 50 * gc.mult, y: 134 * gc.mult}, 60);
    }, 200)
  }, 500);

  setTimeout(() => {
    PhoneManager.moveTo({x: 93 * gc.mult, y: 60 * gc.mult}, 200);
    Cigarets.moveTo({x: 104 * gc.mult, y: 134 * gc.mult}, 200);
    setTimeout(() => {
      PhoneManager.moveTo({x: 93 * gc.mult, y: 64 * gc.mult}, 60);
      Cigarets.moveTo({x: 104 * gc.mult, y: 138 * gc.mult}, 60);
    }, 200);

    setTimeout(() => {
      PhoneManager.sprite.playAnimation('call', true);
    }, 2000)

  }, 450);

};

