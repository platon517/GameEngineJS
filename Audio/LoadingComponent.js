import {AudioPLayer} from "./AudioComponents";
import {AudioSample} from "./AudioComponents";

(() => {
  let player_loading = new Promise(resolve => {
    const url = 'https://cs9-9v4.vkuseraudio.net/p22/fc9a6813b7c5fb.mp3?extra=mI2uGmj0wDzX7adREd8ra4EBJFozb-hyaI47t3xY6qIP_XP0fVA10h0TYREnhbv6Wk6jNhvorC2MquyaR9lwcV9mgmeUtHH74ok92j0Uq4s2ehZXi5juGiijL8LpVNh5-Au8NFqODjo';

    const player = new AudioPLayer(loaded);
    new AudioSample(player, './sample.mp3');
    new AudioSample(player, url);

    function loaded() {
      resolve(player);
    }
  });

  // Пример еще одного элемента для загрузки
  let delay = new Promise(resolve => {
    const time = 3000;
    setTimeout(() => {resolve(time)}, time);
  });

  Promise.all([player_loading, delay])
    .then(result => {
      console.log('All resources are loaded:');
      console.log(result);
    });
})();