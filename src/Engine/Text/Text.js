import {gc} from "../../Game/js/game_config";

export const ARIAL_FONT = 'Arial';
export const PIXEL_FONT = 'pixel';
export const PIXEL_ENG_FONT = 'pixel_eng';

export const CENTER = 'center';
export const LEFT = 'left';
export const RIGHT = 'right';

export class Text {
  constructor(
    text = 'sample text',
    font = ARIAL_FONT,
    size = 30,
    color = 'black',
    offset = {x: 0, y: 0},
    coords = {x: gc.originSize.w * gc.mult / 2, y: gc.originSize.h * gc.mult / 2},
    ){
    this._text = text;
    this._coords = coords;
    this._font = font;
    this._color = color;
    this._size = size;
    this._hidden = false;
    this._textAllign = LEFT;
    this._nowMoving = null;
    this._offset = offset;
  }
  hide(){
    this._hidden = true;
  }
  show(){
    this._hidden = false;
  }
  textAllign(type = CENTER){
    this._textAllign = type;
  }
  text(text, animation = {type: 'text', time: 0}){
    if (animation.time === 0) {
      this._text = text;
    }
  }
  getPos(){
    return this._coords;
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
  draw(ctx){
    const {
      _text,
      _font,
      _size,
      _coords,
      _color,
      _hidden,
      _textAllign,
      _nowMoving
    } = this;
    ctx.font = `${_size}px ${_font}`;
    ctx.fillStyle = _color;
    if(!_hidden){

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

      let x;

      switch (_textAllign) {
        case CENTER:
          x = _coords.x + this._offset.x - ctx.measureText(_text).width / 2;
          break;
        case LEFT:
          x = _coords.x  + this._offset.x;
          break;
        case RIGHT:
          x = _coords.x  + this._offset.x - ctx.measureText(_text).width;
          break;
      }

      ctx.fillText(_text, x, _coords.y + this._offset.y);
    }
  }
}