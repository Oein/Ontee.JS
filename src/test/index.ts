import ontee, { image } from "../ontee";

let onteeWindow = ontee.init("ont");
let i = 0;
const sayer = () => {
  onteeWindow.dialogue.say(
    "YouME",
    `오늘은 즐거운 월요일. 일하러 학교에 가지요. 를 ${i}번 말하고 있지요`,
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

onteeWindow.setBackground(
  image.get(await image.load(`https://bit.ly/3Gvbd6G`))
);

// onteeWindow.bgm.set(
//   "https://file-examples.com/storage/fe9278ad7f642dbd39ac5c9/2017/11/file_example_MP3_5MG.mp3"
// );
// onteeWindow.bgm.play();
