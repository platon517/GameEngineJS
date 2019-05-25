import { gc } from "../../Game/js/game_config";
import { Camera } from "../Camera/Camera";

export const ARIAL_FONT = "Arial";
export const PIXEL_FONT = "pixel";
export const PIXEL_ENG_FONT = "pixel_eng";

export const CENTER = "center";
export const LEFT = "left";
export const RIGHT = "right";

export class Text {
  constructor(
    text = "sample text",
    font = ARIAL_FONT,
    size = 30,
    color = "black",
    coords = {
      x: (gc.originSize.w * gc.mult) / 2,
      y: (gc.originSize.h * gc.mult) / 2
    },
    offset = { x: 0, y: 0 },
    areaSize = { w: 128, h: 128 }
  ) {
    this._text = text;
    this._coords = coords;
    this._font = font;
    this._color = color;
    this._size = size;
    this._hidden = false;
    this._textAllign = LEFT;
    this._nowMoving = null;
    this._offset = offset;
    this._areaSize = areaSize;
    this._animation = null;
    this._renderText = "";
  }
  hide() {
    this._hidden = true;
  }
  show() {
    this._hidden = false;
  }
  textAllign(type = CENTER) {
    this._textAllign = type;
  }
  text(text, letterSpeed = 0) {
    if (letterSpeed === 0) {
      this._text = text;
    } else {
      this._animation = {
        letterSpeed,
        finalText: text,
        startLetterTime: new Date().getTime(),
        finalTextFormatted: null
      };
    }
    this._textFormatted = false;
  }
  getPos() {
    return this._coords;
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
  draw(ctx) {
    const camCoords = Camera.getCoords();
    const {
      _text,
      _font,
      _size,
      _coords,
      _color,
      _hidden,
      _textAllign,
      _nowMoving
    } = this;

    ctx.font = `${_size}px ${_font}`;
    ctx.fillStyle = _color;

    if (!_hidden) {
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

      let x;

      switch (_textAllign) {
        case CENTER:
          x = _coords.x + this._offset.x - ctx.measureText(_text).width / 2;
          break;
        case LEFT:
          x = _coords.x + this._offset.x;
          break;
        case RIGHT:
          x = _coords.x + this._offset.x - ctx.measureText(_text).width;
          break;
      }

      if (this._animation) {
        const nowTime = new Date().getTime();
        const pastTime = nowTime - this._animation.startLetterTime;

        if (
          !this._animation.finalTextFormatted ||
          this._animation.finalTextFormatted.join("") !==
            lineSplitter(
              ctx,
              this._animation.finalText,
              camCoords,
              this._size,
              this._areaSize
            )
        ) {
          this._animation.finalTextFormatted = lineSplitter(
            ctx,
            this._animation.finalText,
            camCoords,
            this._size,
            this._areaSize
          ).split("");
        }

        const lettersRange = Math.floor(pastTime / this._animation.letterSpeed);

        this._renderText = this._animation.finalTextFormatted
          .slice(0, lettersRange)
          .join("");

        if (lettersRange >= this._animation.finalTextFormatted.length) {
          this._text = this._animation.finalText;
          this._animation = null;
        }

      } else {
        this._renderText = lineSplitter(
          ctx,
          _text,
          camCoords,
          this._size,
          this._areaSize
        );
      }

      this._renderText.split("\n").forEach((line, index) => {
        ctx.fillText(
          line,
          x + camCoords.x,
          _coords.y + this._offset.y + camCoords.y + this._size * index
        );
      });

      const render_rect = false;
      if (render_rect) {
        ctx.beginPath();
        ctx.strokeStyle = "Red";
        ctx.rect(
          this._coords.x + this._offset.x + camCoords.x,
          this._coords.y + this._offset.y + camCoords.y - this._size,
          this._areaSize.w * gc.mult,
          this._areaSize.h * gc.mult
        );
        ctx.stroke();
      }
    }
  }
}

const lineSplitter = (() => {
  const cache = new Map();
  let lastWidth = null;
  return (ctx, _text, camCoords, _size, _areaSize) => {
    if (cache.has(_text) && ctx.measureText(_text).width === lastWidth) {
      return cache.get(_text);
    }

    const lineWidth = _areaSize.w * gc.mult;
    const wordsArr = _text.split(" ");
    const lines = [];

    wordsArr.forEach(word => {
      const lastLine = lines.length - 1;
      const newLineWidth =
        ctx.measureText(lines[lastLine]).width + ctx.measureText(word).width;
      if (lines[lastLine] && newLineWidth <= lineWidth) {
        lines[lastLine] += `${word} `;
      } else if (!((lines.length + 1) * _size >= _areaSize.h * gc.mult)) {
        lines[lastLine] += `\n`;
        lines.push(`${word} `);
      }
    });

    cache.set(_text, lines.join(""));
    lastWidth = ctx.measureText(_text).width;

    return lines.join("");
  };
})();
