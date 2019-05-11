import { engineVisual } from "../VisualRender/VisualRenderComponent";
import { throttle } from "throttle-debounce";
import {isCollides} from "../../Game/js/utilities/isCollides";
import {getCoordsArr} from "../../Game/js/utilities/getCoordsArr";

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
    this._interactionsObjectsList = new Set();
    this.checkDelay = checkDelay;
    this._events = new Map();
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

  setEvent(name, func){
    this._events.set(name, func);
  }
  deleteEvent(name){
    this._events.delete(name);
  }
  callEvent(name, args = []){
    this._events.get(name)(...args)
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
  addInteractionObject(object){
    this._interactionsObjectsList.add(object);
  }
  deleteInteractionObject(object){
    this._interactionsObjectsList.delete(object);
  }
  getInteractions() {
    return this._interactions;
  }
  _checkSingleInteractions(collider){
    if (collider instanceof Collider && collider !== this && !collider.disabled) {
      if (
        isCollides(
          getCoordsArr({
            coords: this._coords,
            offset: this._offset,
            size: this._size
          }),
          getCoordsArr(
            collider.getInfo()
          )
        )
      ) {
        this.setInteraction(collider);
        collider.setInteraction(this);
        //console.log('in');
      } else if (
        this._interactions.has(collider) ||
        collider.getInteractions().has(this)
      ) {
        this.deleteInteraction(collider);
        collider.deleteInteraction(this);
        //console.log('out');
      }
    }
  }
  _checkInteractions = throttle(this.checkDelay, () => {
    let objects, fromRenderList;

    if (this._interactionsObjectsList.size !== 0){
      objects = this._interactionsObjectsList;
      fromRenderList = false;
    } else {
      objects = engineVisual.renderList.get();
      fromRenderList = true;
    }

    objects.forEach(object => {
      //console.log('collision checking');
      if (!object) return false;
      const collider = fromRenderList ? object.obj.collider : object.collider;
      if (collider instanceof ColliderGroup) {
        collider.arr.forEach(item => {
          this._checkSingleInteractions(item);
        })
      } else {
        this._checkSingleInteractions(collider);
      }
    });
  });
  update(ctx) {
    const { _size, _offset, _nowMoving, disabled } = this;

    if (!disabled) {
      this._checkInteractions();
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
  }
  addInteractionObject(object){
    this.arr.forEach(collider => collider.addInteractionObject(object))
  }
  deleteInteractionObject(object){
    this.arr.forEach(collider => collider.deleteInteractionObject(object))
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