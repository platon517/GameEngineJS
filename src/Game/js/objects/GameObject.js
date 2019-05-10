import {engineVisual} from "../../../Engine/VisualRender/VisualRenderComponent";

export class GameObject {
  constructor(){
    this.ui = [];
    this._initFunction = () => {};
  }
  render(){
    engineVisual.renderList.add(this);
  }
  renderClear(){
    engineVisual.renderList.delete(this);
  }
  setRenderIndex(index){
    engineVisual.renderList.setZIndex(this, index);
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