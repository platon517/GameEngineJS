import {flag_1, folderObject} from "../objects_initializing";
import {gc} from "../game_config";
import {EngineVisual} from "../objects_initializing";

export let selectedIsland = null;

let isAbleClick = true;
let firstClick = true;

const NON_SELECTED_Z = 1;
const SELECTED_Z = 2;
const FLAG_Z = 3;

export const islandsInfo = {
  playerSelect: null,
  left: [
    {flag: null, x: 16 * gc.mult, y: 20 * gc.mult},
    {flag: null, x: 50 * gc.mult, y: 18 * gc.mult},
    {flag: null, x: 41 * gc.mult, y: 44 * gc.mult}
  ],
  right: [
    {flag: null, x: 149 * gc.mult, y: 11 * gc.mult},
    {flag: null, x: 153 * gc.mult, y: 33 * gc.mult}
  ],
  middle_top: [
    {flag: null, x: 100 * gc.mult, y: 14 * gc.mult}
  ],
  middle_bottom: [
    {flag: null, x: 83 * gc.mult, y: 44 * gc.mult},
    {flag: null, x: 110 * gc.mult, y: 54 * gc.mult}
  ]
};

export const islandClick = (island) => {

  const playerFlag = flag_1;
  if (firstClick) {
    EngineVisual.renderList.add(playerFlag);
    EngineVisual.renderList.setZIndex(playerFlag, FLAG_Z);
    playerFlag.moveTo({x: islandsInfo[island.name].x, y: islandsInfo[island.name].y});
    firstClick = false;
  }
  if (isAbleClick && selectedIsland !== island) {
    isAbleClick = false;
    let isFlaged = false;

    playerFlag.moveTo({x: islandsInfo[island.name].x, y: islandsInfo[island.name].y}, 200);

    const islandPlacesArray = islandsInfo[island.name];
    for(let i = 0; i < islandPlacesArray.length; i++) {
      const item = islandPlacesArray[i];
      if(item.flag === null) {
        playerFlag.moveTo({x: islandPlacesArray[i].x, y: islandPlacesArray[i].y}, 200);
        if (islandsInfo.playerSelect !== null) {
          islandsInfo.playerSelect.flag = null
        }
        islandsInfo.playerSelect = islandPlacesArray[i];
        islandPlacesArray[i].flag = playerFlag;
        isFlaged = true;
        break;
      }
    }

    if (!isFlaged) {
      console.log('no place');
    }

    if (selectedIsland !== null) {
      EngineVisual.renderList.setZIndex(selectedIsland, NON_SELECTED_Z);
      selectedIsland.sprite.changeNowState({x: 0, y: 0})
    }
    EngineVisual.renderList.setZIndex(island, SELECTED_Z);
    island.sprite.changeNowState({x: 96, y: 0});
    selectedIsland = island;
    folderObject.sprite.playAnimation('nextPage');
    setTimeout(() => {
      isAbleClick = true;
    }, folderObject.sprite.getAnimationInfo('nextPage').time);
  }
};