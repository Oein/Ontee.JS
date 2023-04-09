import ontee from "../ontee";

let onteeWindow = ontee.init("ont");
let i = 0;
const sayer = () => {
  onteeWindow.dialogue.say(
    "Hi",
    `B${i}ak${i}a${Math.random()}${Math.random()}`,
    () => {
      i++;
      sayer();
    }
  );
};
sayer();

// let vid = document.createElement("video");
// vid.src = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
// onteeWindow.setVideoBackground(vid);

onteeWindow.bgm.set("https://github.com/Oein/Oein/raw/main/04%20comet.mp3");
onteeWindow.bgm.play();
