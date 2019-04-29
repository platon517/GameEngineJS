import {EngineVisual} from "./EngineVisual";

export class GameObject {
  constructor(){
    this.ui = [];
    this._initFunction = () => {};
  }
  render(){
    EngineVisual.renderList.add(this);
  }
  renderClear(){
    EngineVisual.renderList.delete(this);
  }
  setRenderIndex(index){
    EngineVisual.renderList.setZIndex(this, index);
  }
  setInit(func){
    this._initFunction = func;
  }
  init(){
    this._initFunction()
  }
  moveTo(...args){
    this.sprite && this.sprite.moveTo(...args);
    this.collider && this.collider.moveTo(...args);
    this.ui.forEach( item => {
      item.moveTo(...args);
    });
    this.pos = args[0];
  }
}