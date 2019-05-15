import {gc} from "../../Game/js/game_config";

export const Camera =  {
  _coords: {x: 0, y: 0},
  _nowMoving: false,
  getCoords(){
    if (this._nowMoving) {
      const nowTime = new Date().getTime();
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
      this._coords = pos;
    }
  }
};

//setTimeout(() => Camera.moveTo({x: 64 * gc.mult, y: 0 * gc.mult}, 5000), 500);