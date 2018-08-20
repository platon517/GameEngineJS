export class ProgressBar {
  constructor(width = 200, height = 20, bg = 'red', fill = 'blue', offset = {x: 0, y: 0}, coords = {x: 0, y: 0}){
    this._width = width;
    this._height = height;
    this._bg = bg;
    this._fill = fill;
    this._coords = coords;
    this._nowMoving = null;
    this._nowSettingValue = null;
    this._offset = offset;
    this._value = 0.5;
  }
  moveTo(pos = {x: 0, y: 0}, time = null){
    if (time) {
      const startTime = new Date().getTime();
      const path = {
        start_x: this._coords.x,
        start_y: this._coords.y,
        end_x: pos.x - this._coords.x,
        end_y: pos.y - this._coords.y
      };
      this._nowMoving = {path, pos, time, startTime};
    } else {
      this._coords = pos;
    }
  }

  addValue(value, time = 0){
    this.setValue(this._value + value, time);
  }

  setValue(value, time = 0){
    if (time === 0) {
      this._value = value;
    } else {
      const startTime = new Date().getTime();
      const start_value = this._value;
      this._nowSettingValue = {start_value, value, time, startTime};
    }
  }

  draw(ctx){
    let {
      _width,
      _height,
      _bg,
      _fill,
      _coords,
      _nowMoving,
      _offset,
      _value,
      _nowSettingValue
    } = this;

    if (_nowMoving) {
      const nowTime = new Date().getTime();
      const startTime = _nowMoving.startTime;
      const pastTime = (nowTime - startTime);
      const time = _nowMoving.time;
      const path = _nowMoving.path;
      this._coords = {
        x: path.start_x + (path.end_x / time * pastTime),
        y: path.start_y + (path.end_y / time * pastTime),
      };
      if(pastTime >= time) {
        const pos = _nowMoving.pos;
        this._nowMoving = null;
        this._coords = pos;
      }
    }

    if (_nowSettingValue) {
      const nowTime = new Date().getTime();

      const {
        startTime,
        start_value,
        time,
        value
      } = _nowSettingValue;

      const pastTime = (nowTime - startTime);
      const deltaValue = value - start_value;
      this._value = start_value + (deltaValue / time) * pastTime;
      if(pastTime >= time) {
        this._nowSettingValue = null;
        this._value = value;
      }
    }

    ctx.beginPath();
    ctx.rect(_coords.x + this._offset.x, _coords.y + this._offset.y, _width, _height);
    //ctx.stroke();
    ctx.fillStyle = _bg;
    ctx.fill();

    ctx.beginPath();
    ctx.rect(_coords.x + this._offset.x, _coords.y + this._offset.y, _width * _value, _height);
    //ctx.stroke();
    ctx.fillStyle = _fill;
    ctx.fill();
  }
}