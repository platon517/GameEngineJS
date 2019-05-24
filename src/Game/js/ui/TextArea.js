import {GameObject} from "../../../Engine/GameObject/GameObject";
import {gc} from "../game_config";
import {Sprite} from "../../../Engine/Sprite/Sprite";
import {LEFT, PIXEL_ENG_FONT, PIXEL_FONT, Text} from "../../../Engine/Text/Text";
import {local, TEST} from "../../localization/localization";

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

    const text =
      new Text(
        TEST[local],
        local === 'EN' ? PIXEL_ENG_FONT : PIXEL_FONT,
        (local === 'EN' ? 4 : 4.5) * gc.mult,
        'white',
        {x: 7 * gc.mult, y: 96 * gc.mult},
        {x: 0 * gc.mult, y: 0 * gc.mult},
        { w: 116, h: 26}
      );
    text.textAllign(LEFT);

    this.ui.push(text);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(99);
    });
  }
}

export const TextAreaBottom = new TextArea();