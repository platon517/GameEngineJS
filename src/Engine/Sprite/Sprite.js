import {Camera} from "../Camera/Camera";
import { gc } from "../../Game/js/game_config";

function drawRotatedImage(ctx, degrees, image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, pivot = null) {
  ctx.save();
  let deltaX, deltaY;
  if (pivot) {
    deltaX = dx + pivot.x;
    deltaY = dy + pivot.y;
  } else {
    deltaX = dx + dWidth / 2;
    deltaY = dy + dHeight / 2;
  }
  ctx.translate(deltaX, deltaY);
  ctx.rotate(degrees*Math.PI / 180);
  ctx.translate(-deltaX, -deltaY);
  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  ctx.restore();
  ctx.globalAlpha = 1;
}

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
    this._nowOffset = null;
    this._nowAnimation = null;
    this._rotation = 0;
    this._alpha = 1;
    this._rotationPivot = null;
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
    this._size = {
      w: size.w * gc.mult,
      h: size.h * gc.mult
    };
    this._coords = {
      x: 0,
      y: 0
    };
    this._offset = {
      x: offset.x * gc.mult,
      y: offset.y * gc.mult
    };
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
      this._nowMoving = null;
      this._coords = pos;
    }
  }

  addAnimation(prop) {
    this._animations[prop.title] = prop.config;
  }

  playAnimation(name, loop = false, freeze = false) {
    const startTime = new Date().getTime();
    this._nowAnimation = { name, startTime, loop, freeze };
  }

  getCurrentAnimation(){
    return this._nowAnimation;
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

  getCoords(){
    return this._coords;
  }
  getSize(){
    return this._size;
  }

  setImageSrc(src){
    this._idle = src;
    this._canvasObject.src = this._idle;
  }

  rotate(val, time = null, loop = false){
    if (time) {
      const startTime = new Date().getTime();
      const path = {
        start: this._rotation,
        end: val - this._rotation,
      };
      this._nowRotating = { path, val, time, startTime, loop };
    } else {
      this._rotation = val;
    }
  }

  getRotation(){
    return this._rotation;
  }

  resize = (() =>{
    let initW, initH, initX, initY;
    return (val, time = null) => {
      if (!initW || !initH) {
        initW = this._size.w;
        initH = this._size.h;
      }

      if (this._size.w === initW && this._size.h === initH) {
        initX = this._offset.x;
        initY = this._offset.y;
      }

      const w = initW * val;
      const h = initH * val;

      const offset = {
        x: initX - ((w - initW) / 2),
        y: initY - ((h - initH) / 2)
      };

      if (time) {
        const startTime = new Date().getTime();

        const startOffset = {
          x: this._offset.x,
          y: this._offset.y
        };

        const endOffset = {
          x: (w - this._size.w) / -2,
          y: (h - this._size.h) / -2
        };

        const path = {
          start_w: this._size.w,
          start_h: this._size.h,
          end_w: w - this._size.w,
          end_h: h - this._size.h,
        };
        const size = {
          w,
          h
        };
        this._nowResizing = { path, size, time, startTime, offset, startOffset, endOffset };
      } else {
        this._nowResizing = null;
        this._offset = offset;
        this._size = {
          w,
          h
        };
      }
    }
  })();

  setRotationPivot(pivot){
    this._rotationPivot = pivot;
  }

  setAlpha(val, time = null) {
    if (time) {
      const startTime = new Date().getTime();
      this._newAlpha = { deltaVal: val - this._alpha, endVal: val, startVal: this._alpha, time, startTime };
    } else {
      this._newAlpha = null;
      this._alpha = val;
    }
  }

  setInnerOffset(innerVal, time = null) {
    if (time) {
      const startTime = new Date().getTime();

      const startInnerVal = {x: this._nowState.x, y: this._nowState.y};
      const endInnerVal = innerVal;

      this._newInnerOffset = { startInnerVal, endInnerVal, time, startTime };

    } else {
      this._newInnerOffset = null;
      this._nowState = innerVal;
    }
  }

  setInnerSize(innerVal, time = null) {
    if (time) {
      const startTime = new Date().getTime();

      const startInnerVal = {w: this._innerSize.w, h: this._innerSize.h};
      const endInnerVal = innerVal;

      this._newInnerSize = { startInnerVal, endInnerVal, time, startTime };

    } else {
      this._newInnerSize = null;
      this._innerSize = innerVal;
    }
  }

  getOffset() {
    return this._offset;
  }

  setOffset(pos = { x: 0, y: 0 }, time = null) {
    if (time) {
      const startTime = new Date().getTime();
      const path = {
        start_x: this._offset.x,
        start_y: this._offset.y,
        end_x: pos.x - this._offset.x,
        end_y: pos.y - this._offset.y
      };
      this._nowOffset = { path, pos, time, startTime };
    } else {
      this._nowOffset = null;
      this._offset = pos;
    }
  }

  setSize(val = { w: 0, h: 0 }, time = null) {
    if (time) {
      const startTime = new Date().getTime();
      const path = {
        start_w: this._size.w,
        start_h: this._size.h,
        end_w: val.w - this._size.w,
        end_h: val.h - this._size.h,
      };
      this._nowSize = { path, val, time, startTime };
    } else {
      this._nowSize = null;
      this._size = val;
    }
  }

  draw(ctx, isImage = true) {
    let {
      _canvasObject,
      _nowState,
      _innerSize,
      _coords,
      _size,
      _nowAnimation,
      _animations,
      _nowMoving,
      _idleCoords,
      _rotation,
      _nowResizing,
      _nowRotating,
      _newAlpha,
      _rotationPivot,
      _newInnerOffset,
      _nowOffset,
      _offset,
      _newInnerSize,
      _nowSize
    } = this;

    const nowTime = new Date().getTime();

    if (_nowAnimation) {
      const animation = _animations[_nowAnimation.name];
      const startTime = _nowAnimation.startTime;
      const delta = animation.time / animation.frames.length;

      const pastTime = nowTime - startTime;
      const nowFrame = Math.floor(pastTime / delta);

      if (nowFrame < animation.frames.length) {
        _nowState = animation.frames[nowFrame];
      } else {
        if (_nowAnimation.loop) {
          this.playAnimation(_nowAnimation.name, true);
          _nowState = animation.frames[0];
        } else if (_nowAnimation.freeze) {
          _nowState = animation.frames[animation.frames.length - 1];
        } else {
          _nowState = _idleCoords;
          this._nowAnimation = null;
        }
      }
    }


    if (_nowMoving) {
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

    if (_nowResizing) {
      const startTime = _nowResizing.startTime;
      const pastTime = nowTime - startTime;
      const time = _nowResizing.time;
      const path = _nowResizing.path;
      this._size = {
        w: path.start_w + (path.end_w / time) * pastTime,
        h: path.start_h + (path.end_h / time) * pastTime
      };
      this._offset = {
        x: _nowResizing.startOffset.x + (_nowResizing.endOffset.x / time) * pastTime,
        y: _nowResizing.startOffset.y + (_nowResizing.endOffset.y / time) * pastTime,
      };
      if (pastTime >= time) {
        const size = _nowResizing.size;
        this._nowResizing = null;
        this._size = size;
        this._offset = _nowResizing.offset;
      }
    }

    if (_nowRotating) {
      const startTime = _nowRotating.startTime;
      const pastTime = nowTime - startTime;
      const time = _nowRotating.time;
      const path = _nowRotating.path;

      this._rotation = path.start + (path.end / time) * pastTime;

      if (pastTime >= time) {
        this._rotation = _nowRotating.val;
        if (_nowRotating.loop) {
          this._rotation = 0;
          const startTime = new Date().getTime();
          const path = {
            start: this._rotation,
            end: _nowRotating.val - this._rotation,
          };
          this._nowRotating = {
            path,
            val: _nowRotating.val,
            time,
            startTime,
            loop: _nowRotating.loop
          };
        } else {
          this._nowRotating = null;
        }
      }
    }

    if (_newAlpha) {
      const startVal = _newAlpha.startVal;
      const startTime = _newAlpha.startTime;
      const pastTime = nowTime - startTime;
      const time = _newAlpha.time;
      const val = startVal + (_newAlpha.deltaVal / time) * pastTime;
      this._alpha = val;
      if (pastTime >= time) {
        this._alpha = _newAlpha.endVal;
        this._newAlpha = null;
      }
    }

    if (_newInnerOffset) {
      const startTime = _newInnerOffset.startTime;
      const pastTime = nowTime - startTime;
      const time = _newInnerOffset.time;

      this._nowState = {
        x: _newInnerOffset.startInnerVal.x +
          ((_newInnerOffset.endInnerVal.x - _newInnerOffset.startInnerVal.x) / time) *
          pastTime,
        y: _newInnerOffset.startInnerVal.y +
          ((_newInnerOffset.endInnerVal.y - _newInnerOffset.startInnerVal.y) / time) *
          pastTime,
      };

      if (pastTime >= time) {
        this._nowState = _newInnerOffset.endInnerVal;
        this._newInnerOffset = null;
      }
    }

    if (_newInnerSize) {
      const startTime = _newInnerSize.startTime;
      const pastTime = nowTime - startTime;
      const time = _newInnerSize.time;

      this._innerSize = {
        w: _newInnerSize.startInnerVal.w +
          ((_newInnerSize.endInnerVal.w - _newInnerSize.startInnerVal.w) / time) *
          pastTime,
        h: _newInnerSize.startInnerVal.h +
          ((_newInnerSize.endInnerVal.h - _newInnerSize.startInnerVal.h) / time) *
          pastTime,
      };

      if (pastTime >= time) {
        this._innerSize = _newInnerSize.endInnerVal;
        this._newInnerSize = null;
      }
    }

    if (_nowOffset) {
      const startTime = _nowOffset.startTime;
      const pastTime = nowTime - startTime;
      const time = _nowOffset.time;
      const path = _nowOffset.path;
      this._offset = {
        x: path.start_x + (path.end_x / time) * pastTime,
        y: path.start_y + (path.end_y / time) * pastTime
      };
      if (pastTime >= time) {
        const pos = _nowOffset.pos;
        this._nowOffset = null;
        this._offset = pos;
      }
    }

    if (_nowSize) {
      const startTime = _nowSize.startTime;
      const pastTime = nowTime - startTime;
      const time = _nowSize.time;
      const path = _nowSize.path;
      this._size = {
        w: path.start_w + (path.end_w / time) * pastTime,
        h: path.start_h + (path.end_h / time) * pastTime
      };
      if (pastTime >= time) {
        const val = _nowSize.val;
        this._nowSize = null;
        this._size = val;
      }
    }

    ctx.globalAlpha = this._alpha;

    const camCoords = Camera.getCoords();

    isImage && drawRotatedImage(
      ctx,
      _rotation,
      _canvasObject,
      _nowState.x,
      _nowState.y,
      _innerSize.w,
      _innerSize.h,
      _coords.x + _offset.x + camCoords.x,
      _coords.y + _offset.y + camCoords.y,
      _size.w,
      _size.h,
      _rotationPivot
    );
  }
}

export class SquareSprite extends Sprite {
  constructor(size = {w: 100, h: 100}, color = 'black', offset = {x: 0, y: 0}, r = 0){
    super();
    this._size = size;
    this._color = color;
    this._alpha = 1;
    this._radius = r;
    this._offset = offset;
    this._nowMoving = null;
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
      this._nowMoving = null;
      this._coords = pos;
    }
  }

  setColor(color = 'white') {
    this._color = color;
  }

  draw(ctx){

    const nowTime = new Date().getTime();

    super.draw(ctx, false);
    const camCoords = Camera.getCoords();
    const lastAlpha = ctx.globalAlpha;

    if (this._nowMoving) {
      const startTime = this._nowMoving.startTime;
      const pastTime = nowTime - startTime;
      const time = this._nowMoving.time;
      const path = this._nowMoving.path;
      this._coords = {
        x: path.start_x + (path.end_x / time) * pastTime,
        y: path.start_y + (path.end_y / time) * pastTime
      };
      if (pastTime >= time) {
        const pos = this._nowMoving.pos;
        this._nowMoving = null;
        this._coords = pos;
      }
    }
    const r = this._radius;
    const {w, h} = this._size;
    let {x, y} = this._coords;

    x += this._offset.x;
    y += this._offset.y;

    ctx.fillStyle = this._color;
    ctx.globalAlpha = this._alpha;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = lastAlpha;
  }
}
