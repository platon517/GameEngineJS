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

  getCoords(){
    return this.sprite && this.sprite.getCoords();
  }
  getColliderInfo(){
    return this.collider && this.collider.getInfo();
  }

  // render index methods
  getRenderIndex(){
    return engineVisual.renderList.getZIndex(this);
  }
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