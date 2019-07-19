import { gc } from "../../Game/js/game_config";
import { Camera } from "../Camera/Camera";

export const ARIAL_FONT = "Arial";

export const CENTER = "center";
export const LEFT = "left";
export const RIGHT = "right";

export class Text {
  constructor(
    text = "sample text",
    font = ARIAL_FONT,
    size = 30,
    color = "black",
    style = 'normal',
    coords = {
      x: gc.originSize.w / 2,
      y: gc.originSize.h / 2
    },
    offset = { x: 0, y: 0 },
    areaSize = { w: 100, h: 100 }
  ) {
    this._text = text;
    this._coords = {
      x: coords.x * gc.mult,
      y: coords.y * gc.mult,
    };
    this._style = style;
    this._font = font;
    this._color = color;
    this._size = size * gc.mult;
    this._hidden = false;
    this._textAllign = LEFT;
    this._nowMoving = null;
    this._offset = offset;
    this._areaSize = {
      w: areaSize.w * gc.mult,
      h: areaSize.h * gc.mult
    };
    this._animation = null;
    this._renderText = "";
    this._pages = 0;
    this._page = 0;
  }

  hide() {
    this._hidden = true;
  }

  getPagesInfo() {
    return {
      current: this._page,
      max: this._pages
    }
  }
  setPages(val){
    this._pages = val;
  }

  show() {
    this._hidden = false;
  }

  textAllign(type = CENTER) {
    this._textAllign = type;
  }

  text(text, letterSpeed = 0) {
    this._text = text;
    if (letterSpeed !== 0) {
      this._animation = {
        letterSpeed,
        finalText: text,
        startLetterTime: new Date().getTime(),
        finalTextFormatted: null
      };
      this._skippedAnimationSpeed = this._animation.letterSpeed;
      this._skippedAnimationText = this._animation.finalText;
    }
  }

  skip() {
    this._animation = null;
  }

  next() {
    if (this._page <= this._pages) {
      if (!!this._skippedAnimationText) {
        this._animation = {
          letterSpeed: this._skippedAnimationSpeed,
          finalText: this._skippedAnimationText,
          startLetterTime: new Date().getTime(),
          finalTextFormatted: null
        };
      }
      this._page += 1;
    }
  }

  control(){
    switch (this._contols) {
      case END_CONTROL:
        return this.hide();
      case NEXT_CONTROL:
        return this.next();
    }
  }

  getPos() {
    return {
      x: this._coords.x / gc.mult,
      y: this._coords.y / gc.mult,
    };
  }

  moveTo(pos = { x: 0, y: 0 }, time = null) {
    pos = {
      x: pos.x * gc.mult,
      y: pos.y * gc.mult,
    };
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

  lineSplitter = (() => {
    const cache = new Map();
    let lastWidth = null;
    let lastStartLine = null;
    let firstCalc = true;
    return (ctx, _text, camCoords, _size, _areaSize, startLine = 0, setPages) => {
      if (
        cache.has(_text) &&
        ctx.measureText(_text).width === lastWidth &&
        startLine === lastStartLine
      ) {
        return cache.get(_text);
      }

      lastStartLine = startLine;
      const lineWidth = _areaSize.w;
      const wordsArr = _text.split(" ");
      let lines = [];

      wordsArr.forEach(word => {
        const lastLine = lines.length - 1;
        const newLineWidth =
          ctx.measureText(lines[lastLine]).width + ctx.measureText(word).width;
        if (lines[lastLine] && newLineWidth <= lineWidth) {
          lines[lastLine] += `${word} `;
        } else {
          lines[lastLine] += `\n`;
          lines.push(`${word} `);
        }
      });

      if (firstCalc) {
        const pagesval = Math.ceil(
          lines.length > 1 ? ((lines.length) * _size) / _areaSize.h : 0
        );
        setPages(pagesval);
        firstCalc = false;
      }

      const endLine = startLine + Math.floor(_areaSize.h / _size);

      lines = lines.slice(startLine, endLine);

      cache.set(_text, lines.join(""));
      lastWidth = ctx.measureText(_text).width;

      return lines.join("");
    };
  })();

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
      _nowMoving,
      _style
    } = this;

    ctx.font = `${_style} ${_size}px ${_font}`;
    ctx.fillStyle = _color;

    if (!_hidden) {
      const startLine =
        this._page * Math.floor(this._areaSize.h / (this._size));

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
          x = _coords.x + this._offset.x + (this._areaSize.w - ctx.measureText(_text).width) / 2;
          break;
        case LEFT:
          x = _coords.x + this._offset.x;
          break;
        case RIGHT:
          x =
            _coords.x +
            this._areaSize.w +
            this._offset.x -
            ctx.measureText(_text).width;
          break;
      }

      if (this._animation) {
        const nowTime = new Date().getTime();
        const pastTime = nowTime - this._animation.startLetterTime;

        if (
          !this._animation.finalTextFormatted ||
          this._animation.finalTextFormatted.join("") !==
            this.lineSplitter(
              ctx,
              this._animation.finalText,
              camCoords,
              this._size,
              this._areaSize,
              startLine,
              val => this.setPages(val)
            )
        ) {
          this._animation.finalTextFormatted = this.lineSplitter(
            ctx,
            this._animation.finalText,
            camCoords,
            this._size,
            this._areaSize,
            startLine,
            val => this.setPages(val)
          ).split("");
        }

        const lettersRange = Math.floor(pastTime / this._animation.letterSpeed);

        this._renderText = this._animation.finalTextFormatted
          .slice(0, lettersRange)
          .join("");

        if (lettersRange >= this._animation.finalTextFormatted.length) {
          this._text = this._animation.finalText;
          setTimeout(
            () => (this._animation = null),
            this._animation.letterSpeed * 2
          );
        }
      } else {
        this._renderText = this.lineSplitter(
          ctx,
          _text,
          camCoords,
          this._size,
          this._areaSize,
          startLine,
          val => this.setPages(val)
        );
      }

      const lines = this._renderText.split("\n");

      for (let i = 0; i < lines.length; i++) {
        if (!((i + 1) * _size >= this._areaSize.h)) {
          ctx.fillText(
            lines[i],
            x + camCoords.x,
            _coords.y + this._offset.y + camCoords.y + this._size * i
          );
        }
      }

      const render_rect = false;
      if (render_rect) {
        ctx.beginPath();
        ctx.strokeStyle = "Red";
        ctx.rect(
          this._coords.x + this._offset.x + camCoords.x,
          this._coords.y + this._offset.y + camCoords.y - this._size,
          this._areaSize.w,
          this._areaSize.h
        );
        ctx.stroke();
      }
    }
  }
}

