export class GameObject {
  constructor(){
    this.ui = [];
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