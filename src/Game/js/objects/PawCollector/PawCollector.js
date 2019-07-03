import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { gc } from "../../game_config";
import { getRandom } from "../../utilities/random";
import { BigYarnBallObj } from "../BigYarnBall/BigYarnBall";
import { YarnGrid } from "../Grid/Grid";

const Z_INDEX = 41;

const WIDTH = 375 * gc.modifer;
const HEIGH = 94 * gc.modifer;

export class PawCollector extends GameObject {
  constructor(coords) {
    super();
    this.sprite = new Sprite(
      "img/Paws/paw.png",
      { x: 0, y: 0 },
      { w: 2000, h: 500 },
      { w: WIDTH, h: HEIGH }
    );

    this.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  collectBall(coords, ballSize) {

    let startPosIsRight;

    if (coords.x > gc.srcSize.w / 2) {
      startPosIsRight = true;
    } else if (coords.x === gc.srcSize.w / 2) {
      startPosIsRight = getRandom(0, 2) === 0;
    } else {
      startPosIsRight = false;
    }

    const randomRotation = getRandom(-15, 15);
    const randomRotationRad = randomRotation * Math.PI / 180.0;

    const deltaMult = startPosIsRight ? -1 : 1;
    const deltaW = deltaMult * WIDTH / 2 * (1 - Math.cos(randomRotationRad));
    const deltaH = deltaMult * WIDTH / 2 * (Math.sin(randomRotationRad));

    this.sprite.rotate(
      startPosIsRight ? 0 - randomRotation : 180 - randomRotation
    );

    const startX = startPosIsRight
      ? gc.srcSize.w + ballSize
      : 0 - WIDTH - ballSize;

    const center = {
      x: coords.x + deltaW,
      y: coords.y - HEIGH / 2 + deltaH
    };

    const randomDelta = getRandom(10, 60);

    if (startPosIsRight){
      center.x = center.x - ballSize / 2 + randomDelta;
    } else {
      center.x = center.x - WIDTH + ballSize / 2 - randomDelta;
    }

    const speed = 2.5;
    const time = Math.abs(startX - center.x) / speed;

    this.moveTo({ x: startX, y: center.y + deltaH });
    this.moveTo(center, time);

    setTimeout(() => {
      this.moveTo(
        {
          x: startX,
          y: center.y + deltaH
        },
        time
      );

      const ballEndX = startPosIsRight ? startX : startX + WIDTH;
      BigYarnBallObj.moveTo(
        {
          x: ballEndX,
          y: BigYarnBallObj.getCoords().y + deltaH
        },
        Math.abs(ballEndX - BigYarnBallObj.getCoords().x) / speed
      );
    }, time);
    setTimeout(() => {
      BigYarnBallObj.clear();
      YarnGrid.enableColliders();
    }, time * 2);
  }

  tick() {
    super.tick();
  }
}

export const Paw = new PawCollector({ x: gc.srcSize.w, y: -375 });
