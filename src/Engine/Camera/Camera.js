import {gc} from "../../Game/js/game_config";
import {getRandom} from "../../Game/js/utilities/random";

export const Camera =  {
  _coords: {x: 0, y: 0},
  _params: {w: 128, h: 128},
  _nowMoving: false,
  _frames: null,
  _isShaking: false,
  _setCoords(coords){
    const frames = this._frames;
    if (frames && !this._isShaking){
      if (coords.x < frames[0][0]) {
        coords.x = frames[0][0];
      }
      if (coords.x + this._params.w > frames[1][0]) {
        coords.x = frames[1][0] - this._params.w
      }
      if (coords.y < frames[0][1]) {
        coords.y = frames[0][1];
      }
      if (coords.y + this._params.h > frames[1][1]) {
        coords.y = frames[1][1] - this._params.h
      }
    }
    this._coords = coords;
  },
  setParams(params = {w: 128, h: 128}){
    this._params = params;
  },
  setFrames(frames = [[0, 0], [128, 128]]){
    this._frames = frames;
  },
  getCoords(){
    if (this._nowMoving) {
      const nowTime = new Date().getTime();
      const startTime = this._nowMoving.startTime;
      const pastTime = nowTime - startTime;
      const time = this._nowMoving.time;
      const path = this._nowMoving.path;
      this._setCoords({
        x: path.start_x + (path.end_x / time) * pastTime,
        y: path.start_y + (path.end_y / time) * pastTime
      });
      if (pastTime >= time) {
        const pos = this._nowMoving.pos;
        this._nowMoving = null;
        this._setCoords(pos);
      }
    }
    return this._coords
  },
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
      this._setCoords(pos);
    }
  },
  shake(time, power = 1) {
    const startCoords = this._coords;
    this._isShaking = true;
    const int = setInterval(() => {
      this.moveTo({
        x: getRandom(-1 * power, power),
        y: getRandom(-1 * power, power)
      }, 50);
    }, 50);
    setTimeout(() => {
      clearInterval(int);
      this._isShaking = false;
      setTimeout(() => {
        this.moveTo(startCoords);
      }, 100);
    }, time);
  }
};

//Camera.shake(3000);

//Camera.moveTo({x: 0, y: 128 * gc.mult}, 5000);

//Camera.setFrames([[0, 0], [128, 128]]);
