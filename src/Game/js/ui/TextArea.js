import {GameObject} from "../../../Engine/GameObject/GameObject";
import {gc} from "../game_config";
import {Sprite} from "../../../Engine/Sprite/Sprite";
import {LEFT, PIXEL_ENG_FONT, PIXEL_FONT, RIGHT, Text} from "../../../Engine/Text/Text";
import {END, local, NEXT, TEST} from "../../localization/localization";
import {engineVisual} from "../../../Engine/VisualRender/VisualRenderComponent";
import {PlayerCharacter} from "../chars/lich/Lich";

const NEXT_CONTROL = "NEXT_CONTROL";
const END_CONTROL = "END_CONTROL";

export class TextArea extends GameObject{
  constructor(){
    super();

    this.sprite = new Sprite(
      "img/ui/text_area.png",
      { x: 0, y: 0 },
      { w: 128, h: 42 },
      { w: 128 * gc.mult, h: 42 * gc.mult },
      { x: 0, y: 86 * gc.mult },
    );

    this._endFuncs = [];

    this._contols = NEXT_CONTROL;

    this.text =
      new Text(
        '',
        local === 'EN' ? PIXEL_ENG_FONT : PIXEL_FONT,
        (local === 'EN' ? 4 : 4.5),
        'white',
        {x: 7, y: 96},
        {x: 0 * gc.mult, y: 0 * gc.mult},
        { w: 116, h: 26},
      );
    this.text.textAllign(LEFT);

    this.endButton =
      new Text(
        END[local],
        local === 'EN' ? PIXEL_ENG_FONT : PIXEL_FONT,
        (local === 'EN' ? 4 : 4.5),
        'white',
        {x: 70, y: 122},
        {x: 0 * gc.mult, y: 0 * gc.mult},
        { w: 29, h: 5},
      );
    this.endButton.textAllign(LEFT);

    this.nextButton =
      new Text(
        NEXT[local],
        local === 'EN' ? PIXEL_ENG_FONT : PIXEL_FONT,
        (local === 'EN' ? 4 : 4.5),
        'white',
        {x: 106, y: 122},
        {x: 0 * gc.mult, y: 0 * gc.mult},
        { w: 17, h: 5},
      );
    this.nextButton.textAllign(LEFT);

    this.pointer =
      new Text(
        '▶',
        PIXEL_FONT,
        4,
        'white',
        {x: 102, y: 122},
        {x: 0 * gc.mult, y: 0 * gc.mult},
        { w: 4, h: 5},
      );
    this.pointer.textAllign(LEFT);

    this.ui = [this.text, this.endButton, this.nextButton, this.pointer];

    engineVisual.addKeysReleaseEvent([13, 32], () => {
      this.text._animation ? this.text.skip() : this.controls();
    });

    engineVisual.addKeysReleaseEvent([37, 39], () => this.switchControls());

    this.setInit(() => {
      this._contols = NEXT_CONTROL;
      this.text =
        new Text(
          '',
          local === 'EN' ? PIXEL_ENG_FONT : PIXEL_FONT,
          (local === 'EN' ? 4 : 4.5),
          'white',
          {x: 7, y: 96},
          {x: 0 * gc.mult, y: 0 * gc.mult},
          { w: 116, h: 26},
        );
      this.text.textAllign(LEFT);

      this.ui = [this.text, this.endButton, this.nextButton, this.pointer];

      this.render();
      this.setRenderIndex(99);
    });
  }

  render(){
    super.render();
    PlayerCharacter.blockInput(true);
  }

  renderClear(){
    super.renderClear();
    PlayerCharacter.blockInput(false);
    this._endFuncs.forEach(func => func());
    this._endFuncs = [];
  }

  addEndEvent(func) {
    this._endFuncs.push(func);
  }

  controls() {
    if (this._contols === NEXT_CONTROL) {
      this.text.next();
    } else {
      this.renderClear();
    }
  }

  switchControls(){
    const pages = this.text.getPagesInfo();
    if (pages.current < pages.max && !this.text._animation) {
      this._contols = (this._contols === NEXT_CONTROL ? END_CONTROL : NEXT_CONTROL);
      switch (this._contols) {
        case NEXT_CONTROL:
          this.pointer.moveTo({x: 102, y: this.pointer.getPos().y});
          break;
        case END_CONTROL:
          this.pointer.moveTo({x: 66, y: this.pointer.getPos().y});
          break;
      }
    }
  }

  tick(){
    super.tick();
    this.nextButton.hide();
    this.endButton.hide();
    this.pointer.hide();
    if (!this.text._animation) {
      //this.endButton.show();
      this.pointer.show();
      this.nextButton.show();
      const pages = this.text.getPagesInfo();
      if (pages.current < pages.max) {
        this.nextButton.show();
      }
      if (pages.current >= pages.max) {
        this._contols = END_CONTROL;
        //this.pointer.moveTo({x: 90, y: 122});
        //this.endButton.moveTo({x: 94, y: 122});
      }
    }
  }

}

export const TextAreaBottom = new TextArea();