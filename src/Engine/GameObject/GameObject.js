import {engineVisual} from "../VisualRender/VisualRenderComponent";

export class GameObject {
  constructor(){
    this.ui = [];
    this._initFunction = () => {};
  }

  // render methods
  render(){
    engineVisual.renderList.add(this);
  }
  renderClear(){
    engineVisual.renderList.delete(this);
  }

  // render index methods
  setRenderIndex(index){
    engineVisual.renderList.setZIndex(this, index);
  }

  // init methods
  setInit(func){
    this._initFunction = func;
  }
  init(){
    this._initFunction()
  }

  tick(){
  }

  // move methods
  moveTo(...args){
    this.collider && this.collider.moveTo(...args);
    this.sprite && this.sprite.moveTo(...args);
    this.ui.forEach( item => {
      item.moveTo(...args);
    });
    this.pos = args[0];
  }
}