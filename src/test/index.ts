// import ontee from "../ontee";

import { loadSave } from "../onteeParser";

// let onteeWindow = ontee.init("ont");
// let i = 0;
// const sayer = () => {
//   onteeWindow.dialogue.say(
//     "YouME",
//     `오늘은 즐거운 월요일. 일하러 학교에 가지요. 를 ${i}번 말하고 있지요`,
//     () => {
//       i++;
//       sayer();
//     }
//   );
// };
// sayer();

// let vid = document.createElement("video");
// vid.src = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
// onteeWindow.setVideoBackground(vid);

// onteeWindow.setBackground(
//   ontee.image.get(await ontee.image.load(`https://bit.ly/3Gvbd6G`))
// );

// onteeWindow.bgm.set(
//   "https://file-examples.com/storage/fe9278ad7f642dbd39ac5c9/2017/11/file_example_MP3_5MG.mp3"
// );
// onteeWindow.bgm.play();

document.getElementById("start")?.addEventListener("click", () => {
  document.getElementById("ont")!.style.display = "";
  // RunOnt(
  //   `
  // to Ont("/main.ont");
  // `,
  //   "Ontee.JS",
  //   "ont"
  // );
  loadSave(
    {
      callstack: [
        { chaptername: "  init codes  ", file: "Ontee.JS", line: 0 },
        { chaptername: "  init codes  ", file: "/main.ont", line: 2 },
        { chaptername: "test", file: "/main.ont", line: 1 },
        { chaptername: "testa", file: "/main.ont", line: 0 },
      ],
      bgm: {
        playing: false,
        url: "https://file-examples.com/storage/fe7e1395d6643881797b91d/2017/11/file_example_MP3_700KB.mp3",
      },
      bg: { data: "#ffffff", type: "c" },
      onteeVar: {},
    },
    `to Ont("/main.ont");`,
    "ont"
  );
});
