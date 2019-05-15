export const Camera =  {
  _coords: {x: 0, y: 0},
  _params: {w: 128, h: 128},
  _nowMoving: false,
  _frames: [[0, 0], [128, 128]],
  _setCoords(coords){
    const frames = this._frames;
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
  }
};