import {selectedIsland} from "./islandClick";
import {startGameAnimation} from "./startAnimation";

export const readyState = {
  isPlayerReady: false,
  countdown: null,
  gameStarted: false
};

const countdown = (cd = null) => {
  if (cd !== null) {
    clearInterval(cd);
    console.log('aborted');
    return null;
  } else {
    let i = 0;
    const cd = setInterval(() => {
      console.log(++i);
      if (i >= 3) {
        startGameAnimation();
        clearInterval(cd);
        readyState.gameStarted = true;
        console.log('start');
      }
    }, 1000);
    return cd;
  }
};

export const readyPressFunction = (islands) => {
  if(!readyState.gameStarted){
    readyState.isPlayerReady = !readyState.isPlayerReady;
    islands.forEach(item => {
      item.collider.disabled = readyState.isPlayerReady;
    });
    if(readyState.isPlayerReady){
      readyState.countdown = countdown();
    } else {
      readyState.countdown = countdown(readyState.countdown);
    }
  }
};