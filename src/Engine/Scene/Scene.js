export class Scene {
  constructor(w = 128, h = 123, objects = [], camera = null){
    this._params = {w, h};
    this._objects = objects;
    this._camera = null;
  }
  init(){
    this._objects.forEach(object => object.init());
  }
}