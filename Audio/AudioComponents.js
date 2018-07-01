export class AudioPLayer {
  constructor(loaded_callback = null) {
    this.context = new AudioContext();
    this.mainGainNode = this.context.createGain();
    this.mainGainNode.gain.value = 1;
    this.mainGainNode.connect(this.context.destination);
    this.samples = [];
    this.loaded_callback = loaded_callback;
  }
  get volume(){
    return this.mainGainNode.gain.value;
  }
  set volume(val){
    this.mainGainNode.gain.value = val;
  }
  sampleLoad(num){
    this.samples[num].loaded = true;
    if (this.samples.every((item)=>{return item.loaded})) {
      if (this.loaded_callback !== null) this.loaded_callback();
    }
  }
}
export class AudioSample{
  constructor(player, source) {
    const num = player.samples.length;
    player.samples.push({sample: this, loaded: false});
    fetch(source)
      .then(response => response.arrayBuffer())
  .then(arrayBuffer => player.context.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
      this.gainNode = player.context.createGain();
    this.gainNode.gain.value = 1;
    this.gainNode.connect(player.mainGainNode);
    this.source = player.context.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.gainNode);
    player.sampleLoad(num);
  });
  }
  get volume(){
    return this.gainNode.gain.value;
  }
  set volume(val){
    this.gainNode.gain.value = val;
  }
  loop(val = true){
    this.source.loop = val;
  }
  play(){
    this.source.start();
  }
  stop(){
    this.source.stop();
  }
}
