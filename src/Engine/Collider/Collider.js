import {CursorObject} from "../../Game/js/objects/Cursor";

export class Collider {
  constructor (pos = {x: 0, y: 0}, size = { w: 0, h: 0 }, offset = { x: 0, y: 0 }) {
    this._size = size;
    this._offset = offset;
    this._coords = pos;
    this._nowMoving = null;
    this._onClick = {
      events: []
    };
    this._onMouseDown = {
      events: []
    };
    this._onMouseUp = {
      events: []
    };
    this._onMouseEnter = {
      entered: false,
      events: []
    };
    this._onMouseLeave = {
      events: []
    };
    this.disabled = false;
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
  setClick(func){
    this._onClick.events.push(func);
  }
  setMouseDown(func){
    this._onMouseDown.events.push(func);
  }
  setMouseUp(func){
    this._onMouseUp.events.push(func);
  }
  setMouseEnter(func){
    this._onMouseEnter.events.push(func);
  }
  setMouseLeave(func){
    this._onMouseLeave.events.push(func);
  }
  onMouseUp(){
    if(this._onMouseEnter.entered) {
      for (let i in this._onMouseUp.events) {
        this._onMouseUp.events[i]();
      }
    }
  }
  onMouseDown(){
    if(this._onMouseEnter.entered) {
      for (let i in this._onMouseDown.events) {
        this._onMouseDown.events[i]();
      }
    }
  }
  click(){
    if(this._onMouseEnter.entered) {
      for (let i in this._onClick.events) {
        this._onClick.events[i]();
      }
    }
  }
  update(ctx){
    const {
      _size,
      _offset,
      _nowMoving,
      disabled
    } = this;

    if(!disabled){
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

      if (
        CursorObject.pos.x + CursorObject.size.w / 2 >= this._coords.x + this._offset.x &&
        CursorObject.pos.x + CursorObject.size.w / 2 <= this._coords.x + this._offset.x + this._size.w &&
        CursorObject.pos.y >= this._coords.y + this._offset.y &&
        CursorObject.pos.y <= this._coords.y + this._offset.y + this._size.h
      ) {
        if(!this._onMouseEnter.entered) {
          for (let i in this._onMouseEnter.events) {
            this._onMouseEnter.events[i]();
          }

          CursorObject.targetElement = this;
          CursorObject.setType('pointer');
          this._onMouseEnter.entered = true;
        }
      } else {
        if(this._onMouseEnter.entered) {
          for (let i in this._onMouseLeave.events) {
            this._onMouseLeave.events[i]();
          }
          CursorObject.setType('default');
          this._onMouseEnter.entered = false;
        }
      }

      const render_rect = false;
      if(render_rect){
        ctx.beginPath();
        ctx.rect(this._coords.x + this._offset.x, this._coords.y + this._offset.y, this._size.w, this._size.h);
        ctx.stroke();
      }
    }
  }
}