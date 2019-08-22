import { GameObject } from "../../../../Engine/GameObject/GameObject";
import { Sprite } from "../../../../Engine/Sprite/Sprite";
import { Collider } from "../../../../Engine/Collider/Collider";
import { BrushButtonObj, ChangeButtonObj, GameStates, MainCursor } from "../../scenes/CoreScene";
import { YarnGrid } from "../../scenes/CoreScene";
import { getRandom } from "../../utilities/random";
import { gc } from "../../game_config";
import { GRID_SIZE } from "../Grid/gridSize";

export const BLUE = "BLUE";
export const GREEN = "GREEN";
export const PINK = "PINK";
export const PURPLE = "PURPLE";
export const YELLOW = "YELLOW";
export const MULT = "MULT";
const Z_INDEX = 10;
const GROW_ANIM_TIME = 200;

export const BALL_SIZE = (60 / GRID_SIZE) * 5 * gc.modifer;
export const SHADOW_SIZE = (72 / GRID_SIZE) * 5 * gc.modifer;

export const getColorSrc = color => {
  switch (color) {
    case BLUE:
      return "img/YarnBalls/png/yarn_blue.png";
    case GREEN:
      return "img/YarnBalls/png/yarn_green.png";
    case PINK:
      return "img/YarnBalls/png/yarn_pink.png";
    case PURPLE:
      return "img/YarnBalls/png/yarn_purple.png";
    case YELLOW:
      return "img/YarnBalls/png/yarn_yellow.png";
    case MULT:
      return "img/YarnBalls/png/yarn_all.png";
  }
};

export class YarnBall extends GameObject {
  constructor(coords, color) {
    super();
    this.sprite = [
      new Sprite(
        "img/YarnBalls/png/yarn_shadow.png",
        { x: 0, y: 0 },
        { w: 500, h: 500 },
        { w: SHADOW_SIZE, h: SHADOW_SIZE },
        { x: (BALL_SIZE - SHADOW_SIZE) / 2, y: (BALL_SIZE - SHADOW_SIZE) / 2 }
      ),
      new Sprite(
        getColorSrc(color),
        { x: 0, y: 0 },
        { w: 370, h: 370 },
        { w: BALL_SIZE, h: BALL_SIZE }
      )
    ];

    this.collider = new Collider(
      { x: 0, y: 0 },
      { w: BALL_SIZE, h: BALL_SIZE },
      { x: 0, y: 0 }
    );

    this.collider.addInteractionObject(MainCursor);

    this.moveTo(coords);

    this.selected = false;

    this.color = color;

    this.disabled = false;

    this.sprite[0].resize(0.5);
    this.sprite[0].setAlpha(0);

    this.setInit(() => {
      this.render();
      this.setRenderIndex(Z_INDEX);
    });
  }

  _clearAnimationPlan() {
    if (this._animationPlan) {
      clearTimeout(this._animationPlan);
      this._animationPlan = null;
    }
  }

  grow() {
    this._clearAnimationPlan();
    this.sprite[1].rotate(
      this.sprite[1]._rotation + getRandom(15, 45),
      GROW_ANIM_TIME * 0.6
    );

    this.sprite[0].setAlpha(1, GROW_ANIM_TIME * 0.6);
    this.sprite[0].resize(1.3, GROW_ANIM_TIME * 0.6);
    this.sprite[1].resize(1.3, GROW_ANIM_TIME * 0.6);

    this.setRenderIndex(Z_INDEX + YarnGrid.selection.size);
    this._animationPlan = setTimeout(() => {
      this.sprite[0].resize(1.2, GROW_ANIM_TIME * 0.4);
      this.sprite[1].resize(1.2, GROW_ANIM_TIME * 0.4);
    }, GROW_ANIM_TIME * 0.6);
  }

  reset(mult = false) {
    this._clearAnimationPlan();

    if (mult) {
      this.sprite[0].resize(0, GROW_ANIM_TIME * 0.6);
      this.sprite[1].resize(0, GROW_ANIM_TIME * 0.6);
      setTimeout(() => {
        this.sprite[1].setImageSrc("img/YarnBalls/png/yarn_all.png");
        this.sprite[0].setAlpha(0, GROW_ANIM_TIME * 0.4);
        this.sprite[0].resize(0.5, GROW_ANIM_TIME * 0.4);
        this.sprite[1].resize(1, GROW_ANIM_TIME * 0.4);
      }, GROW_ANIM_TIME * 0.6);
    } else {
      this.sprite[1].rotate(
        this.sprite[1]._rotation + getRandom(-45, 15),
        GROW_ANIM_TIME * 0.6
      );

      this.sprite[0].resize(0.9, GROW_ANIM_TIME * 0.6);
      this.sprite[1].resize(0.9, GROW_ANIM_TIME * 0.6);

      this.setRenderIndex(Z_INDEX);
      this._animationPlan = setTimeout(() => {
        this.sprite[0].setAlpha(0, GROW_ANIM_TIME * 0.4);
        this.sprite[0].resize(0.5, GROW_ANIM_TIME * 0.4);
        this.sprite[1].resize(1, GROW_ANIM_TIME * 0.4);
      }, GROW_ANIM_TIME * 0.6);
    }
    this.selected = false;
  }

  setGridPos(pos) {
    this.gridX = pos.x;
    this.gridY = pos.y;
  }

  fall() {
    let y = 1;
    let distance = 0;

    while (
      YarnGrid.getBallByPos(this.gridX, this.gridY + y) === undefined &&
      y < YarnGrid.size - this.gridY
    ) {
      y += 1;
      distance += 1;
    }
    const coords = this.getCoords();

    const topBall = YarnGrid.getBallByPos(this.gridX, this.gridY - 1);
    const ball = YarnGrid.balls.find(ball => ball.obj === this);

    ball.y += distance;
    ball.obj.setGridPos({ x: ball.x, y: ball.y });

    if (topBall) {
      topBall.obj.fall();
    }

    this.moveTo(
      {
        x: coords.x,
        y: coords.y + BALL_SIZE * distance
      },
      distance * 100
    );

    setTimeout(() => {
      this.sprite[1].resize(0.9, 100);
      setTimeout(() => {
        this.sprite[1].resize(1, 100);
      }, 100);
    }, distance * 100);
  }

  clear(center) {
    this.sprite[0].setAlpha(0, 200);
    this.sprite[1].setAlpha(0, 200);
    this.sprite[1].resize(1, 200);
    this.moveTo(
      {
        x: center.x - BALL_SIZE / 2,
        y: center.y - BALL_SIZE / 2 + 150
      },
      200
    );
    setTimeout(() => this.renderClear(), 200);

    const topBall = YarnGrid.getBallByPos(this.gridX, this.gridY - 1);
    if (topBall && !YarnGrid.selection.has(topBall.obj)) {
      topBall.obj.fall();
    }
  }

  tick() {
    super.tick();

    if (!ChangeButtonObj.isChanging && this._isGrown){
      this.reset();
      YarnGrid.deleteFromSelection(this);
      this.selected = false;
      this._isGrown = false;
    }

    if (
      !GameStates.gameOver &&
      this.collider.getInteractions().has(MainCursor.collider) &&
      !this.disabled &&
      !GameStates.gameOver
    ) {
      if (BrushButtonObj.isPainting) {
        if (this.color === MULT) {
          return false;
        }
        YarnGrid.disableColliders(this, false);
      }
      if (ChangeButtonObj.isChanging) {
        if (!this._isGrown && YarnGrid.selection.size < 2) {
          this.grow();
          YarnGrid.addToSelection(this);
          setTimeout(
            () => {
              this._isGrown = true;
            }, GROW_ANIM_TIME
          );
        }
        if (!this.selected && !MainCursor.hold) {
          this.selected = true;
        }
        if (this.selected && !MainCursor.hold && this._isGrown) {
          this.reset();
          YarnGrid.deleteFromSelection(this);
          this.selected = false;
          setTimeout(
            () => {
              this._isGrown = false;
            }, GROW_ANIM_TIME
          );
        }
        return false;
      }
      if (
        YarnGrid.selection.size > 0 &&
        [...YarnGrid.selection].pop().color !== this.color &&
        [...YarnGrid.selection].pop().color !== MULT &&
        this.color !== MULT
      ) {
        return false;
      }
      if (MainCursor.hold && !this.collider.disabled) {
        if (!this.selected) {
          YarnGrid.disableColliders(this);
          YarnGrid.addToSelection(this);

          this.grow();

          this.selected = true;
        } else {
          const selectionArr = [...YarnGrid.selection];
          if (
            selectionArr[selectionArr.length - 2] === this &&
            !selectionArr[selectionArr.length - 1].collider
              .getInteractions()
              .has(MainCursor.collider)
          ) {
            const lastBall = selectionArr.pop();
            lastBall.reset();
            YarnGrid.deleteFromSelection(lastBall);
            YarnGrid.disableColliders([...YarnGrid.selection].pop());
          }
        }
      }
    }
  }
}
