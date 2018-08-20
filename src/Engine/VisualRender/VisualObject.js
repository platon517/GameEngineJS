const VisualObject = 'VisualObject/';
export const SPRITE = `${VisualObject}SPRITE`;

class VisualObject {
  constructor(type){
    this._type = type;
    this._coords = {
      x: 0,
      y: 0
    }
  }
  draw(ctx){
    switch (this._type) {
      case SPRITE:
        ctx.drawImage(testImg, cursorPos.x, cursorPos.y, 50, 20);
        break;
    }
  }
}