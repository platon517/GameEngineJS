import {gc} from "../../Game/js/game_config";

const FPS_RATE_DELTA = 1000 / 60;

class RenderList {
  constructor(){
    this._renderList = [];
    this._isDirty = false;
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
    this._isDirty = false;
  }
  getZIndex(obj){
    return this._renderList.filter(item => obj === item.obj)[0].zIndex;
  }
  setZIndex(obj, value){
    this._renderList.filter(item => obj === item.obj)[0].zIndex = value;
    this._isDirty = true;
  }
  draw(ctx){
    this._isDirty && this._sortZIndex();
    this._renderList.forEach(item => {
      const obj = item.obj;
      obj.sprite && obj.sprite.draw(ctx);
      obj.collider && obj.collider.update(engineVisual.ctx);
      obj.tick();
      if (obj.ui !== undefined && obj.ui.length !== 0) {
        obj.ui.map( item => {
          item.draw(ctx);
        })
      }
    });
  }
}

export class VisualComponent {
  constructor(w = 100, h = 100){
    this.gameWindow = document.getElementById("game_window");

    window.onkeydown = e => this._pushKey(e);
    window.onkeyup = e => this._releaseKey(e);
    
    this._keysEvents = {};
    this._keysReleaseEvents = {};
    this._keysPressed = new Set();

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

  addKeysEvent(keyCode, func){
    if (!Array.isArray(keyCode)){
      keyCode = [keyCode];
    }
    keyCode.forEach(key => {
      this._keysEvents[key] ?
        this._keysEvents[key].push(func)
        :
        this._keysEvents[key] = [func];
    });
  }

  addKeysReleaseEvent(keyCode, func){
    if (!Array.isArray(keyCode)){
      keyCode = [keyCode];
    }
    keyCode.forEach(key => {
      this._keysReleaseEvents[key] ?
        this._keysReleaseEvents[key].push(func)
        :
        this._keysReleaseEvents[key] = [func];
    });
  }

  _callKeysEvents(code){
    this._keysEvents[code] && this._keysEvents[code].forEach(event => event());
  }

  _callKeysReleaseEvents(code){
    this._keysReleaseEvents[code] && this._keysReleaseEvents[code].forEach(event => event());
  }
  
  _pushKey(e){
    const code = e.keyCode;
    //console.log(`${code} is down`);
    (this._keysEvents[code] || this._keysReleaseEvents[code]) && this._keysPressed.add(code);
  }
  _releaseKey(e){
    const code = e.keyCode;
    //console.log(`${code} is up`);
    this._keysPressed.delete(code);
  }

  _fpsUpdate = (() => {
    let lastCalledTime = 0;
    let startTime = new Date().getTime();
    let count = 0;

    let lastKeysPressed = [];

    return () => {
      count += 1;
      const time = new Date().getTime();
      if (time - startTime >= 1000) {
        //console.log(`fpsUpdates: ${count}`);
        startTime = new Date().getTime();
        count = 0;
      }
      const deltaTime = time - lastCalledTime;
      const skippedFrames = Math.round(deltaTime / FPS_RATE_DELTA);
      this._keysPressed.forEach(key => {
        for (let i = 0; i < skippedFrames; i++) {
          this._callKeysEvents(key);
        }
      });
      lastKeysPressed.forEach(key => {
        if (![...this._keysPressed].some(item => item === key)) {
          this._callKeysReleaseEvents(key);
        }
      });
      lastKeysPressed = [...this._keysPressed];
      lastCalledTime = time;
    }
  })();

  update(){
    const gW = this.gameWindow;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, gW.width, gW.height);

    this._fpsUpdate();
    this.renderList.draw(ctx);

    /*
    ctx.font = '18pt Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`test`, 10, 25);
    */
  };
}

export const engineVisual = new VisualComponent(gc.originSize.w * gc.mult, gc.originSize.h * gc.mult);