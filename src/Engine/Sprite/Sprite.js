import {Camera} from "../Camera/Camera";

export class Sprite {
  constructor(
    url = "img/engine-defaults/no-image.png",
    inner_coords = { x: 0, y: 0 },
    inner_size = { w: 300, h: 300 },
    size = { w: 40, h: 40 },
    offset = { x: 0, y: 0 }
  ) {
    this._canvasObject = new Image();
    this._idle = url;
    this._canvasObject.src = this._idle;
    this._idleCoords = inner_coords;
    this._nowMoving = null;
    this._nowAnimation = null;
    this._animations = {
      example: {
        frames: [
          { x: -5, y: 0 },
          { x: -10, y: 0 },
          { x: -15, y: 0 },
          { x: -20, y: 0 },
          { x: -25, y: 0 },
          { x: -30, y: 0 }
        ],
        time: 3000
      }
    };

    this._innerSize = inner_size;
    this._size = size;
    this._coords = {
      x: 0,
      y: 0
    };
    this._offset = offset;

    this._nowState = this._idleCoords;
  }

  changeNowState(newState = { x: 0, y: 0 }) {
    this._nowState = newState;
  }

  moveTo(pos = { x: 0, y: 0 }, time = null) {
    if (time) {
      const startTime = new Date().getTime();
      const path = {
        start_x: this._coords.x,
        start_y: this._coords.y,
        end_x: pos.x - this._coords.x,
        end_y: pos.y - this._coords.y
      };
      this._nowMoving = { path, pos, time, startTime };
    } else {
      this._coords = pos;
    }
  }

  addAnimation(prop) {
    this._animations[prop.title] = prop.config;
  }

  playAnimation(name, loop = false) {
    const startTime = new Date().getTime();
    this._nowAnimation = { name, startTime, loop };
  }

  stopAnimation() {
    this._nowState = this._idleCoords;
    this._nowAnimation = null;
  }

  setIdleCoords(coords = {x: 0, y: 0}){
    this._idleCoords = coords;
  }

  getAnimationInfo(name) {
    return this._animations[name];
  }

  draw(ctx) {
    let {
      _canvasObject,
      _nowState,
      _innerSize,
      _coords,
      _size,
      _nowAnimation,
      _animations,
      _nowMoving,
      _idleCoords
    } = this;

    if (_nowAnimation) {
      const animation = _animations[_nowAnimation.name];
      const startTime = _nowAnimation.startTime;
      const delta = animation.time / animation.frames.length;

      const nowTime = new Date().getTime();
      const pastTime = nowTime - startTime;
      const nowFrame = Math.floor(pastTime / delta);

      if (nowFrame < animation.frames.length) {
        _nowState = animation.frames[nowFrame];
      } else {
        if (_nowAnimation.loop) {
          this.playAnimation(_nowAnimation.name, true);
          _nowState = animation.frames[0];
        } else {
          _nowState = _idleCoords;
          this._nowAnimation = null;
        }
      }
    }


    if (_nowMoving) {
      const nowTime = new Date().getTime();
      const startTime = _nowMoving.startTime;
      const pastTime = nowTime - startTime;
      const time = _nowMoving.time;
      const path = _nowMoving.path;
      this._coords = {
        x: path.start_x + (path.end_x / time) * pastTime,
        y: path.start_y + (path.end_y / time) * pastTime
      };
      if (pastTime >= time) {
        const pos = _nowMoving.pos;
        this._nowMoving = null;
        this._coords = pos;
      }
    }

    const camCoords = Camera.getCoords();

    ctx.drawImage(
      _canvasObject,
      _nowState.x,
      _nowState.y,
      _innerSize.w,
      _innerSize.h,
      _coords.x + this._offset.x + camCoords.x,
      _coords.y + this._offset.y + camCoords.y,
      _size.w,
      _size.h
    );
  }
}