import {gc} from "../../game_config";
import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {animation_creator} from "../../utilities/animation_creator";

class TorchArc extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      "img/crypt/torch/arc-torch.png",
      { x: 0, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );
  }
}

class TorchLight extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      "img/crypt/torch/fire-light.png",
      { x: 0, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );
  }
}

class Torch extends GameObject {
  constructor(coords) {
    super();
    this.sprite = new Sprite(
      "img/crypt/torch/torch.png",
      { x: 0, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );

    this.sprite.addAnimation({
      title: 'burn',
      config: {
        frames: animation_creator(16, 0, 4),
        time: 600
      }
    });

    this.arc = new TorchArc();
    this.arc.sprite.moveTo({x: coords.x, y: coords.y + 2 * gc.mult});

    this.light = new TorchLight();
    this.light.sprite.moveTo({x: coords.x, y: coords.y - 5 * gc.mult});

    this.sprite.moveTo(coords);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(3);
      this.sprite.playAnimation('burn', true);

      this.arc.render();
      this.arc.setRenderIndex(4);

      this.light.render();
      this.light.setRenderIndex(3);
    });
  }
}

export const TorchLeft = new Torch({x: 24 * gc.mult, y: 46 * gc.mult});
export const TorchRight = new Torch({x: 88 * gc.mult, y: 46 * gc.mult});