import {GameObject} from "../../../../Engine/GameObject/GameObject";
import {gc} from "../../game_config";
import {Sprite} from "../../../../Engine/Sprite/Sprite";
import {animation_creator} from "../../utilities/animation_creator";
import {engineVisual} from "../../../../Engine/VisualRender/VisualRenderComponent";
import {Collider} from "../../../../Engine/Collider/Collider";
import {Camera} from "../../../../Engine/Camera/Camera";

const IDLE_RIGHT = {x: 528, y: 64};
const IDLE_LEFT = {x: 0, y: 0};

export const BLOCK = 'BLOCK';
const Z_INDEX = 6;

class Lich extends GameObject{
  constructor(){
    super();

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: 10 * gc.mult, h: 1 * gc.mult },
      { x: 3 * gc.mult, y: 15 * gc.mult },
    );

    this.sprite = new Sprite(
      "img/chars/lich/lich-map.png",
      { x: 0, y: 0 },
      { w: 16, h: 16 },
      { w: 16 * gc.mult, h: 16 * gc.mult },
    );

    this.moveTo({x: 64 * gc.mult, y: 86 * gc.mult});

    this.sprite.addAnimation({
      title: 'walkLeft',
      config: {
        frames: animation_creator(16, 0, 2),
        time: 200
      }
    });

    this.sprite.addAnimation({
      title: 'walkRight',
      config: {
        frames: animation_creator(16, 64, 2, '-x', 528),
        time: 200
      }
    });

    this.sprite.addAnimation({
      title: 'confused',
      config: {
        frames: animation_creator(16, 16, 2),
        time: 300
      }
    });

    this.sprite.addAnimation({
      title: 'attack',
      config: {
        frames: animation_creator(16, 32, 15),
        time: 1500
      }
    });

    this.sprite.addAnimation({
      title: 'ult',
      config: {
        frames: animation_creator(16, 48, 34),
        time: 3500
      }
    });

    this._isLeft = true;
    this._walkDirection = null;
    this._walkSpeed = 0;
    this._blockedDirections = [];
    this._blockedInput = false;

    engineVisual.addKeysEvent(37, () => this.walk('x', -1));

    engineVisual.addKeysEvent(39, () => this.walk('x', 1));

    engineVisual.addKeysEvent(38, () => this.walk('y', -1));

    engineVisual.addKeysEvent(40, () => this.walk('y', 1));

    engineVisual.addKeysReleaseEvent([37, 38, 39, 40], () => this.stopWalk());

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  blockInput(val){
    this._blockedInput = val;
  }

  walk(axisValue = 'x', speed = 1){

    if (this._blockedInput) return false;

    const directionIsPositive = speed > 0;

    const isBlocked = this._blockedDirections.reduce((isBlocked, item) => {
      return isBlocked || (
        axisValue === item.axisValue
        &&
        directionIsPositive === item.directionIsPositive
      )
    }, false);

    if (isBlocked) return false;

    if (!this._walkDirection) {
      if (axisValue === 'x') {
        this._isLeft = !directionIsPositive;
      }
      this.sprite.playAnimation(this._isLeft ? 'walkLeft' : 'walkRight', true);
      this._walkDirection = axisValue;
      this._walkSpeed = speed;
    }
    if (this._walkDirection && this._walkDirection !== axisValue) return false;
    this.moveTo({
      x: this.sprite._coords.x + (axisValue === 'x' ? speed * gc.mult : 0),
      y: this.sprite._coords.y + (axisValue === 'y' ? speed * gc.mult : 0)
    })
  }
  stopWalk(){
    if (this._walkDirection && !this._blockedInput) {
      if (this._walkDirection === 'x') {
        this.sprite.setIdleCoords(this._walkSpeed < 0 ? IDLE_LEFT : IDLE_RIGHT);
      }
      this.sprite.stopAnimation(this._isLeft ? 'walkLeft' : 'walkRight');
      this._walkDirection = null;
    }
  }

  _checkBlock(interactions){
    this._blockedDirections.forEach(block => {
      if (![...interactions].some(item => item === block.item)) {
        const index = this._blockedDirections.indexOf(block);
        this._blockedDirections.splice(index, 1);
      }
    });
    interactions.forEach(item => {
      if (
        item.getType() === BLOCK
        &&
        !this._blockedDirections.find(block => block.item === item)
      ) {
        this._blockedDirections.push(
          {
            item: item,
            axisValue: this._walkDirection,
            directionIsPositive:
              this._walkDirection === 'x' ?
                item.getInfo().center.x > this.collider.getInfo().center.x
                :
                item.getInfo().center.y > this.collider.getInfo().center.y
          }
        );
        /*
        this.moveTo({
          x: this.sprite._coords.x + (this._walkDirection === 'x' ? this._walkSpeed * -1 : 0),
          y: this.sprite._coords.y + (this._walkDirection === 'y' ? this._walkSpeed * -1 : 0),
        })
        */
      }
    });
  }

  moveTo(...args){
    super.moveTo(...args);
    Camera.moveTo({
      x: 56 * gc.mult - args[0].x,
      y: 56 * gc.mult - args[0].y,
    });
  }

  walkTo(...args){
    this.moveTo(...args);
    this.blockInput(true);
    this.sprite.playAnimation(this._isLeft ? 'walkLeft' : 'walkRight', true);
    const time = args[1];
    setTimeout(() => {
      this.sprite.stopAnimation(this._isLeft ? 'walkLeft' : 'walkRight');
      this.blockInput(false);
    }, time)
  }

  tick(){
    super.tick();
    if (this._walkDirection) {
      this._checkBlock(
        this.collider.getInteractions()
      );
    }
  }

}

export const PlayerCharacter = new Lich();