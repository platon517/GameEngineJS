import { engineVisual } from "../VisualRender/VisualRenderComponent";
import { throttle } from "throttle-debounce";

export class Collider {
  constructor(
    pos = { x: 0, y: 0 },
    size = { w: 0, h: 0 },
    offset = { x: 0, y: 0 },
    checkDelay = 0
  ) {
    this._size = size;
    this._offset = offset;
    this._coords = pos;
    this._nowMoving = null;
    this._interactions = new Set();

    // LEGACY
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
    // LEGACY

    this.disabled = false;
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
  setClick(func) {
    this._onClick.events.push(func);
  }
  setMouseDown(func) {
    this._onMouseDown.events.push(func);
  }
  setMouseUp(func) {
    this._onMouseUp.events.push(func);
  }
  setMouseEnter(func) {
    this._onMouseEnter.events.push(func);
  }
  setMouseLeave(func) {
    this._onMouseLeave.events.push(func);
  }
  onMouseUp() {
    if (this._onMouseEnter.entered) {
      for (let i in this._onMouseUp.events) {
        this._onMouseUp.events[i]();
      }
    }
  }
  onMouseDown() {
    if (this._onMouseEnter.entered) {
      for (let i in this._onMouseDown.events) {
        this._onMouseDown.events[i]();
      }
    }
  }
  click() {
    if (this._onMouseEnter.entered) {
      for (let i in this._onClick.events) {
        this._onClick.events[i]();
      }
    }
  }
  getInfo() {
    return {
      coords: this._coords,
      offset: this._offset,
      size: this._size
    };
  }
  setInteraction(object) {
    this._interactions.add(object);
  }
  deleteInteraction(object) {
    this._interactions.delete(object);
  }
  getInteractions() {
    return this._interactions;
  }
  _isInside(coordinate) {
    return (
      coordinate[0] >= this._coords.x + this._offset.x &&
      coordinate[0] <= this._coords.x + this._offset.x + this._size.w &&
      coordinate[1] >= this._coords.y + this._offset.y &&
      coordinate[1] <= this._coords.y + this._offset.y + this._size.h
    );
  }
  _isOutside(selfCoordinate, outerCoordinate) {
    return (
      selfCoordinate[0] >= outerCoordinate[0][0] &&
      selfCoordinate[0] <= outerCoordinate[1][0] &&
      selfCoordinate[1] >= outerCoordinate[0][1] &&
      selfCoordinate[1] <= outerCoordinate[2][1]
    );
  }
  _getCoordsObj(data) {
    const { coords, offset, size } = data;
    const x1y1 = [coords.x + offset.x, coords.y + offset.y];
    const x2y1 = [coords.x + offset.x + size.w, coords.y + offset.y];
    const x1y2 = [coords.x + offset.x, coords.y + offset.y + size.h];
    const x2y2 = [coords.x + offset.x + size.w, coords.y + offset.y + size.h];
    return [x1y1, x2y1, x1y2, x2y2];
  }
  _isCollides(colliderInfo) {
    return (
      this._getCoordsObj(colliderInfo).some(coord => this._isInside(coord)) ||
      this._getCoordsObj({
        coords: this._coords,
        offset: this._offset,
        size: this._size
      }).some(coord => this._isOutside(coord, this._getCoordsObj(colliderInfo)))
    );
  }
  _checkSingleInteractions(collider){
    if (collider instanceof Collider && collider !== this) {
      if (
        this._isCollides(collider.getInfo())
      ) {
        this.setInteraction(collider);
        collider.setInteraction(this);
        //console.log('in');
      } else if (
        this._interactions.has(collider) ||
        collider.getInteractions().has(this)
      ) {
        this.deleteInteraction(collider);
        collider.deleteInteraction(collider);
        //console.log('out');
      }
    }
  }
  _checkInteractions = throttle(this.checkDelay, () => {
    if (!this.disabled) {
      const objects = engineVisual.renderList.get();
      objects.forEach(object => {
        const collider = object.obj.collider;
        if (collider instanceof ColliderGroup) {
          collider.arr.forEach(item => {
            this._checkSingleInteractions(item);
          })
        } else {
          this._checkSingleInteractions(collider);
        }
      });
    }
  });
  update(ctx) {
    const { _size, _offset, _nowMoving, disabled } = this;

    this._checkInteractions();

    if (!disabled) {
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

      /*if (
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
      }*/

      const render_rect = true;
      if (render_rect) {
        ctx.beginPath();
        ctx.rect(
          this._coords.x + this._offset.x,
          this._coords.y + this._offset.y,
          this._size.w,
          this._size.h
        );
        ctx.stroke();
      }
    }
  }
}

export class ColliderGroup {
  constructor(arr){
    this.arr = arr.map(info => new Collider(...info));
    console.log(this.arr);
  }
  moveTo = (...args) => {
    for (let i in this.arr) {
      this.arr[i].moveTo(...args);
    }
  };
  update = (ctx) => {
    for (let i in this.arr) {
      this.arr[i].update(ctx);
    }
  }
}