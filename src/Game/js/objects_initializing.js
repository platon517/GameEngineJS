import {Sprite} from "../../Engine/Sprite/Sprite";
import {gc} from "./game_config";
import {animation_creator} from "./utilities/animation_creator";
import {Collider} from "../../Engine/Collider/Collider";
import {FLAG_Z, islandClick, selectedIsland} from "./scripts/islandClick";
import {readyPressFunction, readyState} from "./scripts/readyStage";
import {CENTER, LEFT, PIXEL_ENG_FONT, PIXEL_FONT, Text} from "../../Engine/Text/Text";
import {INTERACT, READY} from "../localization/localization";
import {local} from "../localization/localization";
import {ProgressBar} from "../../Engine/ProgressBar/ProgressBar";

import {GameObject} from "./objects/GameObject";
import {EngineVisual} from "./objects/EngineVisual";

export const menuButton = new class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      'img/ui-buttons/menu/menu-button.png',
      {x: 0, y: 0},
      {w: 16, h: 16},
      {w: 16 * gc.mult, h: 16 * gc.mult}
    );
    EngineVisual.renderList.add(this);
    EngineVisual.renderList.setZIndex(this, 998);
    this.collider = new Collider( {x: 0, y: 0}, { w: 12 * gc.mult, h: 12 * gc.mult }, {x: 2 * gc.mult, y: 2 * gc.mult});

    this.collider.setMouseDown(()=>{
      this.sprite.changeNowState({x: 16, y: 0});
    });

    this.collider.setMouseUp(()=>{
      this.sprite.changeNowState({x: 0, y: 0});
    });

    this.collider.setMouseLeave(() => {
      this.sprite.changeNowState({x: 0, y: 0});
    });

    this.moveTo({x: 1 * gc.mult, y: 1 * gc.mult});

  }
};

export const bgObject = new ( function() {
  this.sprite = new Sprite(
    'img/background/map.png',
    {x: 0, y: 0},
    {w: gc.originSize.w, h: gc.originSize.h},
    {w: gc.originSize.w * gc.mult, h: gc.originSize.h * gc.mult}
  );
  EngineVisual.renderList.add(this);
  EngineVisual.renderList.setZIndex(this, 0);
})();

export const playerPlate = new class extends GameObject {
  constructor() {
    super();
    this.sprite = new Sprite(
      'img/player-plate/player-plate.png',
      {x: 0, y: 0},
      {w: 45, h: 59},
      {w: 45 * gc.mult, h: 59 * gc.mult}
    );
    this.pic = new class extends GameObject {
      constructor(){
        super();
        this.sprite = new Sprite(
          'img/player-plate/player-picture/player-pic.png',
          {x: 0, y: 0},
          {w: 41, h: 21},
          {w: 41 * gc.mult, h: 21 * gc.mult}
        );
      }
    };
    EngineVisual.renderList.add(this);
    EngineVisual.renderList.add(this.pic);
    EngineVisual.renderList.setZIndex(this.pic, 2);

    const color = '#232323';

    const territoryIcon = new Text('T', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 4.5 * gc.mult, y: 34.5 * gc.mult});
    const territoryValue = new Text('107', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 28 * gc.mult, y: 34.5 * gc.mult});
    territoryValue.textAllign(CENTER);

    const moneyIcon = new Text('$', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 4.5 * gc.mult, y: 44.5 * gc.mult});
    const moneyValue = new Text('584', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 28 * gc.mult, y: 44.5 * gc.mult});
    moneyValue.textAllign(CENTER);

    const humanIcon = new Text('C', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 4.5 * gc.mult, y: 54.5 * gc.mult});
    const humanValue = new Text('7', PIXEL_ENG_FONT, 4 * gc.mult, color, {x: 28 * gc.mult, y: 54.5 * gc.mult});
    humanValue.textAllign(CENTER);

    const progressBar = new ProgressBar(41 * gc.mult, 3 * gc.mult, '#b4202a', '#285cc4', {x: 2 * gc.mult, y: 23 * gc.mult});

    progressBar.setValue(Math.random().toFixed(1), 300);

    this.ui.push(
      moneyIcon,
      moneyValue,
      territoryIcon,
      territoryValue,
      humanIcon,
      humanValue,
      progressBar
    );


    this.moveTo({x: 2 * gc.mult, y: 94 * gc.mult});
    this.pic.moveTo({x: 4 * gc.mult, y: 96 * gc.mult});
  }
};

class enemyPlate extends GameObject {
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

    EngineVisual.renderList.add(this);
    EngineVisual.renderList.add(this.pic);
    EngineVisual.renderList.setZIndex(this.pic, 2);

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

  }
}

export const enemyPlayer1 = new enemyPlate(1, 'Leha');
enemyPlayer1.moveTo({x: 50 * gc.mult, y: 200 * gc.mult});

export const enemyPlayer2 = new enemyPlate(2);
enemyPlayer2.moveTo({x: 50 * gc.mult, y: 220 * gc.mult});

export const enemyPlayer3 = new enemyPlate(3);
enemyPlayer3.moveTo({x: 50 * gc.mult, y: 240 * gc.mult});

export const folderObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite('img/folder/folder-fast.png', {x: 0, y: 0}, {w: 96, h: 80}, {w: 96 * gc.mult, h: 80 * gc.mult});
    this.sprite.addAnimation({
      title: 'nextPage',
      config: {
        frames: animation_creator(96, 0, 14),
        time: 1200
      }
    });

    EngineVisual.renderList.add(this);

    this.collider = new function () {
      this.colliderArr = [
        new Collider({x: 0, y: 0}, {w: 32 * gc.mult, h: 24 * gc.mult}, {x: 14 * gc.mult, y: 16 * gc.mult}),
        new Collider({x: 0, y: 0}, {w: 30 * gc.mult, h: 20 * gc.mult}, {x: 11 * gc.mult, y: 44 * gc.mult}),
        new Collider({x: 0, y: 0}, {w: 28 * gc.mult, h: 20 * gc.mult}, {x: 57 * gc.mult, y: 16 * gc.mult}),
        new Collider({x: 0, y: 0}, {w: 28 * gc.mult, h: 20 * gc.mult}, {x: 57 * gc.mult, y: 42 * gc.mult}),
      ];
      this.moveTo = (...args) => {
        for (let i in this.colliderArr) {
          this.colliderArr[i].moveTo(...args);
        }
      };
      this.update = (ctx) => {
        for (let i in this.colliderArr) {
          this.colliderArr[i].update(ctx);
        }
      }
    };

    this.moveTo({x: 96 * gc.mult, y: 154 * gc.mult});
    this.moveTo({x: 96 * gc.mult, y: 76 * gc.mult}, 300);
    setTimeout(()=>{
      this.moveTo({x: 96 * gc.mult, y: 82 * gc.mult}, 100)
    }, 300);
  }
};

class flagObjectCreator extends GameObject {
  constructor(type){
    super();
    const spritePath = `img/flags/${type}/flag-${type}.png`;
    this.sprite = new Sprite(spritePath, {x: 0, y: 0}, {w: 16, h: 16}, {w: 16 * gc.mult, h: 16 * gc.mult})
    this.sprite.addAnimation({
      title: 'idle',
      config: {
        frames: animation_creator(16, 0, 4),
        time: 600
      }
    });
    this.sprite.playAnimation('idle', true);
  }
}

export const flag_1 = new flagObjectCreator(1);

export const islandOneObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/islands/1/island-1.png',
      {x: 0, y: 0},
      {w: 96, h: 96},
      {w: 96 * gc.mult, h: 96 * gc.mult}
    );
    EngineVisual.renderList.add(this);

    this.collider = new Collider( {x: 0, y: 0}, { w: 40 * gc.mult, h: 60 * gc.mult }, {x: 26 * gc.mult, y: 18 * gc.mult});

    this.collider.setMouseEnter(()=>{
    });
    this.collider.setMouseLeave(()=>{
    });

    this.collider.setClick(()=>{
      islandClick(this);
    });

    this.name = 'left';

    this.moveTo({x: -6 * gc.mult, y: -13 * gc.mult});
  }
};

export const islandTwoObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/islands/2/island-2.png',
      {x: 0, y: 0},
      {w: 96, h: 96},
      {w: 96 * gc.mult, h: 96 * gc.mult}
    );
    EngineVisual.renderList.add(this);

    this.collider = new Collider( {x: 0, y: 0}, { w: 32 * gc.mult, h: 50 * gc.mult }, {x: 32 * gc.mult, y: 22 * gc.mult});

    this.collider.setClick(()=>{
      islandClick(this);
    });

    this.name = 'right';

    this.moveTo({x: 110 * gc.mult, y: -16 * gc.mult});
  }
};

export const islandThreeTwoObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/islands/3/1/island-3.png',
      {x: 0, y: 0},
      {w: 96, h: 96},
      {w: 96 * gc.mult, h: 96 * gc.mult}
    );
    EngineVisual.renderList.add(this);

    this.collider = new Collider( {x: 0, y: 0}, { w: 60 * gc.mult, h: 38 * gc.mult }, {x: 22 * gc.mult, y: 48 * gc.mult});

    this.collider.setClick(()=>{
      islandClick(this);
    });

    this.name = 'middle_bottom';

    this.moveTo({x: 50 * gc.mult, y: 0 * gc.mult});
  }
};

export const islandThreeOneObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/islands/3/2/island-3-2.png',
      {x: 0, y: 0},
      {w: 96, h: 96},
      {w: 96 * gc.mult, h: 96 * gc.mult}
    );
    EngineVisual.renderList.add(this);

    this.collider = new Collider( {x: 0, y: 0}, { w: 28 * gc.mult, h: 36 * gc.mult }, {x: 40 * gc.mult, y: 8 * gc.mult});

    this.collider.setClick(()=>{
      islandClick(this);
    });

    this.name = 'middle_top';

    this.moveTo({x: 50 * gc.mult, y: 0 * gc.mult});
  }
};

export const readyBlockObject = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/ready-block/ready-block.png',
      {x: 0, y: 0},
      {w: 45, h: 60},
      {w: 45 * gc.mult, h: 60 * gc.mult});
    EngineVisual.renderList.add(this);

    this.collider = new Collider( {x: 0, y: 0}, { w: 39 * gc.mult, h: 24 * gc.mult }, {x: 3 * gc.mult, y: 27 * gc.mult});

    const rightPadding = local === 'RU' ? 9 : 11;

    const readyText = new Text(
        READY[local],
        PIXEL_FONT,
        7 * gc.mult,
        'white',
        {x: rightPadding * gc.mult, y: 13 * gc.mult}
      );

    readyText.hide();

    this.ui.push(readyText);

    this.collider.setClick(()=>{
      if (selectedIsland !== null) {
        readyPressFunction([islandOneObject, islandTwoObject, islandThreeOneObject, islandThreeTwoObject]);
        readyState.isPlayerReady ? readyText.show() : readyText.hide();
        this.sprite.changeNowState({x: readyState.isPlayerReady ? 45 : 0, y: 0});
      } else {
        console.log('select island');
      }
    });

    this.moveTo({x: 50 * gc.mult, y: 94 * gc.mult});
  }
};

export const phoneManager = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/phone/phone.png',
      {x: 0, y: 0},
      {w: 48, h: 96},
      {w: 48 * gc.mult, h: 96 * gc.mult});
    EngineVisual.renderList.add(this);
    EngineVisual.renderList.setZIndex(this, 2);

    this.sprite.addAnimation({
      title: 'call',
      config: {
        frames: animation_creator(48, 0, 5),
        time: 800
      }
    });

    this.collider = new Collider( {x: 0, y: 0}, { w: 28 * gc.mult, h: 34 * gc.mult }, {x: 10 * gc.mult, y: 34 * gc.mult});

    this.moveTo({x: 93 * gc.mult, y: 200 * gc.mult});

  }
};

export const cigarets = new class extends GameObject {
  constructor(){
    super();
    this.sprite = new Sprite(
      'img/cigarets/cigarets.png',
      {x: 0, y: 0},
      {w: 19, h: 16},
      {w: 19 * gc.mult, h: 16 * gc.mult});
    EngineVisual.renderList.add(this);

    this.moveTo({x: 104 * gc.mult, y: 200 * gc.mult});

  }
};
