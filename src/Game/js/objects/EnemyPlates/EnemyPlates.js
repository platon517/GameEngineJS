import {gc} from "../../game_config";
import {GameObject} from "../GameObject";
import {CENTER, PIXEL_ENG_FONT, PIXEL_FONT, Text} from "../../../../Engine/Text/Text";
import {ProgressBar} from "../../../../Engine/ProgressBar/ProgressBar";
import {INTERACT, local} from "../../../localization/localization";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {Collider} from "../../../../Engine/Collider/Collider";

class EnemyPlate extends GameObject {
  constructor(num, nickname = `enemy ${num}`) {
    super();
    this.sprite = new Sprite(
      'img/enemy-plate/enemy-plate.png',
      {x: 0, y: 0},
      {w: 45, h: 19},
      {w: 45 * gc.mult, h: 19 * gc.mult}
    );
    this.pic = new class extends GameObject {
      constructor(){
        super();
        this.sprite = new Sprite(
          `img/player-avatars/${num}/other-player-pic-${num}.png`,
          {x: 0, y: 0},
          {w: 41, h: 21},
          {w: 41 * gc.mult, h: 21 * gc.mult},
          {x: 2 * gc.mult, y: 2 * gc.mult}
        );
      };
    };
    this.collider = new Collider( {x: 0, y: 0}, { w: 25 * gc.mult, h: 7 * gc.mult }, {x: 18 * gc.mult, y: 9 * gc.mult});

    const nicknameText = new Text(nickname, PIXEL_ENG_FONT, 3 * gc.mult, '#232323', {x: 31 * gc.mult, y: 6.5 * gc.mult});
    nicknameText.textAllign(CENTER);

    const buttonText =
      new Text(
        INTERACT[local],
        local === 'EN' ? PIXEL_ENG_FONT : PIXEL_FONT,
        (local === 'EN' ? 3 : 3.5) * gc.mult,
        '#434c70',
        {x: 31 * gc.mult, y: 13.5 * gc.mult}
      );
    buttonText.textAllign(CENTER);

    const progressBar = new ProgressBar(14 * gc.mult, 2 * gc.mult, '#b4202a', '#285cc4', {x: 2 * gc.mult, y: 14 * gc.mult});

    progressBar.setValue(Math.random().toFixed(1), 300);

    this.ui.push(nicknameText, buttonText, progressBar);

    this.moveTo = (...args) => {
      super.moveTo(...args);
      this.pic.moveTo(...args);
    };

    this._buttonPushed = false;

    const pushButton = () => {
      this.sprite.changeNowState({x: 45, y: 0});
      const textPos = buttonText.getPos();
      buttonText.moveTo({x: textPos.x, y: textPos.y + 1 * gc.mult })
      this._buttonPushed = true;
    };

    const pushBackButton = () => {
      if (this._buttonPushed) {
        this.sprite.changeNowState({x: 0, y: 0});
        const textPos = buttonText.getPos();
        buttonText.moveTo({x: textPos.x, y: textPos.y - 1 * gc.mult })
        this._buttonPushed = false;
      }
    };

    this.collider.setMouseDown(() => {
      pushButton();
    });

    this.collider.setMouseUp(() => {
      pushBackButton();
    });

    this.collider.setMouseLeave(() => {
      pushBackButton();
    });
    this.setInit(() => {
      this.render();
      this.pic.render();
      this.pic.setRenderIndex(2);
    });
  }
}

export const EnemyPlayer1 = new EnemyPlate(1, 'Leha');
EnemyPlayer1.moveTo({x: 50 * gc.mult, y: 200 * gc.mult});

export const EnemyPlayer2 = new EnemyPlate(2);
EnemyPlayer2.moveTo({x: 50 * gc.mult, y: 220 * gc.mult});

export const EnemyPlayer3 = new EnemyPlate(3);
EnemyPlayer3.moveTo({x: 50 * gc.mult, y: 240 * gc.mult});