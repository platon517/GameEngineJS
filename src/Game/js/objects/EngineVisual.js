import {VisualComponent} from "../../../Engine/VisualRender/VisualRenderComponent";
import {gc} from "../game_config";

export const EngineVisual = new VisualComponent(gc.originSize.w * gc.mult, gc.originSize.h * gc.mult);
