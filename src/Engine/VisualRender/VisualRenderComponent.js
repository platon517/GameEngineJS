import {gc} from "../../Game/js/game_config";

class RenderList {
  constructor(){
    this._renderList = [];
  }
  get(){
    return this._renderList;
  }
  add(...prop){
    prop.forEach(item => {
      this._renderList.push({obj: item, zIndex: 1});
      this._sortZIndex();
    });
  }
  delete(...prop){
    prop.forEach(obj => {
      this._renderList = this._renderList.filter(item => item.obj !== obj);
      this._sortZIndex();
    });
  }
  _sortZIndex(){
    this._renderList.sort((a, b) => {
      return a.zIndex > b.zIndex ? 1 : -1;
    });
  }
  setZIndex(obj, value){
    this._renderList.filter(item => obj === item.obj)[0].zIndex = value;
    this._sortZIndex();
  }
  draw(ctx){
    for (let i in this._renderList){

      const obj = this._renderList[i].obj;

      obj.sprite.draw(ctx);

      if (obj.ui !== undefined && obj.ui.length !== 0) {
        obj.ui.map( item => {
          item.draw(ctx);
        })
      }

    }
  }
}

export class VisualComponent {
  constructor(w, h){
    this.gameWindow = document.getElementById("game_window");

    const gW = this.gameWindow;
    gW.style.cursor = 'none';
    gW.style.width = `${w}px`;
    gW.style.height = `${h}px`;
    gW.style.letterSpacing = `${0.5 * gc.mult}px`;
    gW.width = w;
    gW.height = h;

    this.ctx = gW.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.renderList = new RenderList();

    this.update();
  }

  update(){
    const gW = this.gameWindow;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, gW.width, gW.height);

    this.renderList.draw(ctx);

    /*
    ctx.font = '18pt Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`test`, 10, 25);
    */
  };
}

