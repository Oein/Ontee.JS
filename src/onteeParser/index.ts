import { OnteeWindow } from "./../ontee/types";
import ontee from "../ontee";
import { OnteeInitOptions } from "../ontee/types";

let inited: {
  [key: string]: OnteeWindow;
} = {};

let characters: {
  [key: string]: {
    [key: string]: string;
  };
} = {};

function logger(type: string, message: string) {
  console.debug(
    `%c ${type} %c ${message} %c`,
    "background:deepskyblue;padding: 1px;border-radius: 3px 0 0 3px;color:#fff",
    "background:#444;padding: 1px;border-radius: 0 3px 3px 0;color:#fff",
    "background:transparent"
  );
}

type CommandTypes =
  | "bg" //
  | "delay" //
  | "eval" //
  | "bgm" //
  | "to" //
  | "say" //
  | "play.bgm" //
  | "pause.bgm"; //
interface Command {
  command: CommandTypes;
  type?: string;
  data?: string;
}

export function OntParser(ontCode: string, ontid: string = "null") {
  let res: Command[] = [];
  let cahpat: Command[] = [];
  let chapters: { [key: string]: Command[] } = {};
  let chapterName = "";
  let acters: { [key: string]: string } = characters[ontid] || {};
  let alias: { [key: string]: string } = {};

  const trimmer = (i: string) => {
    i = i.trim();
    while (i.startsWith("\t") || i.startsWith("\n")) {
      i = i.substring(1);
    }
    if (i.startsWith("//")) i = i.split("\n").splice(1).join("\n");
    i = i.trim();
    return i;
  };
  const isNum = (str: string) => {
    try {
      str = trimmer(str);
      return parseInt(str).toString() == str;
    } catch (e) {
      return false;
    }
  };
  const chapterPusher = (str: any) => {
    if (chapterName == "") res.push(str);
    else cahpat.push(str);
  };
  const chapterHandler = (i: string) => {
    let fli = trimmer(i.slice(0, i.indexOf("{") + 1));
    chapterName = fli.replace("chapter ", "").replace("{", "").trim();
    logger("chapter.start", `Chapter name : ${chapterName}`);
    eacher(i.slice(i.indexOf("{") + 1));
    return;
  };
  const chapterEndHandler = (i: string) => {
    logger("chapter.end", `Chapter "${chapterName}" done`);
    chapters[chapterName] = cahpat;
    cahpat = [];
    chapterName = "";
    i = i.substring(1);
    i = trimmer(i);
    eacher(i);
  };
  const newActerHandler = (str: string) => {
    str = str.replace("acter ", "");
    let splstr = str.split("=");
    let codeName = trimmer(splstr[0]);
    let shownName = trimmer(splstr.splice(1).join("="));

    if (!shownName.startsWith('"'))
      throw new Error(
        "Acter definer's 2nd parameter(Shown name) is not string\nAt : " + str
      );
    if (!shownName.endsWith('"'))
      throw new Error(
        "Acter definer's 2nd parameter(Shown name) is not string\nAt : " + str
      );

    shownName = shownName.replace('"', "");
    shownName = shownName.slice(0, shownName.length - 1);

    logger("acter.new", `${codeName} : ${shownName}`);
    acters[codeName] = shownName;
  };
  const newDefineHandler = (str: string) => {
    str = str.replace("alias ", "");
    let splstr = str.split("=");
    let alias_ = trimmer(splstr[0]);
    let realCode = trimmer(splstr.splice(1).join("="));

    if (alias_.includes(" "))
      throw new Error('Alias can not contain " "\nAt : ' + str);

    logger("alias.new", `${alias_} : ${realCode}`);
    alias[alias_] = realCode;
  };
  const stringFunctionValidator = (str: string, functionName: string) => {
    str = trimmer(str);
    str = str.replace(functionName, "");
    str = trimmer(str);
    if (!str.startsWith("("))
      throw new Error(`${functionName} is function\nAt : ${str}`);
    if (!str.endsWith(")"))
      throw new Error(`${functionName} is function\nAt : ${str}`);
    str = str.replace("(", "");
    str = str.slice(0, str.length - 1);
    str = trimmer(str);
    if (!str.startsWith('"'))
      throw new Error(`${functionName} requires string\nAt : ${str}`);
    if (!str.endsWith('"'))
      throw new Error(`${functionName} requires string\nAt : ${str}`);
    str = str.replace('"', "");
    str = str.slice(0, str.length - 1);
    return str;
  };
  const bgCommandHandler = (str: string) => {
    str = str.replace("bg ", "");
    str = trimmer(str);
    if (str.startsWith("Image")) {
      const url = stringFunctionValidator(str, "Image");
      chapterPusher({
        command: "bg",
        type: "img",
        data: url,
      });
    }
    if (str.startsWith("Video")) {
      const url = stringFunctionValidator(str, "Video");
      chapterPusher({
        command: "bg",
        type: "vid",
        data: url,
      });
    }
    if (str.startsWith('"') && str.endsWith('"')) {
      str = str.replace('"', "");
      str = str.slice(0, str.length - 1);
      str = trimmer(str);
      if (!str.startsWith("#"))
        throw new Error(`bg requires hex value, Image, or Video\nAt : ${str}`);
      if (str.length != 7)
        throw new Error(`bg requires hex value, Image, or Video\nAt : ${str}`);
      chapterPusher({
        command: "bg",
        type: "col",
        data: str,
      });
    }
  };
  const delayCommandHandler = (str: string) => {
    str = str.replace("delay ", "");
    if (isNum(str))
      chapterPusher({
        command: "delay",
        data: parseInt(str),
      });
    else throw new Error("delay requires a number\nAt : " + str);
  };
  const evalCommandHandler = (str: string) => {
    str = str.replace("eval ", "");
    str = trimmer(str);
    if (str.startsWith("Code")) {
      const url = stringFunctionValidator(str, "Code");
      chapterPusher({
        command: "eval",
        data: url,
      });
      return;
    }
    throw new Error("eval requires Code\nAt : " + str);
  };
  const bgmCommandHandler = (str: string) => {
    str = str.replace("bgm ", "");
    str = trimmer(str);
    if (str.startsWith("Audio")) {
      const url = stringFunctionValidator(str, "Audio");
      chapterPusher({
        command: "bgm",
        data: url,
      });
      return;
    }
    throw new Error("bgm requires Audio\nAt : " + str);
  };
  const toCommandHandler = (str: string) => {
    str = str.replace("to ", "");
    str = trimmer(str);
    if (str.startsWith("Ont")) {
      const url = stringFunctionValidator(str, "Ont");
      chapterPusher({
        command: "to",
        type: "url",
        data: url,
      });
      return;
    }
    if (str.startsWith("Chapter")) {
      const url = stringFunctionValidator(str, "Chapter");
      chapterPusher({
        command: "to",
        type: "cha",
        data: url,
      });
      return;
    }
    throw new Error("to requires Ont or Chapter\nAt : " + str);
  };
  const sayHandler = (str: string, acterName: string) => {
    str = trimmer(str.replace(`${acterName} `, ""));
    if (!str.startsWith('"'))
      throw new Error("Acter requires a string\nAt : " + str);
    if (!str.endsWith('"'))
      throw new Error("Acter requires a string\nAt : " + str);

    str = str.replace('"', "");
    str = str.slice(0, str.length - 1);
    str = trimmer(str);

    chapterPusher({
      command: "say",
      type: acterName,
      data: str,
    });
  };
  const commandHandler = (str: string) => {
    if (str.startsWith("acter ")) return newActerHandler(str);
    if (str.startsWith("alias ")) return newDefineHandler(str);
    if (str.startsWith("bg ")) return bgCommandHandler(str);
    if (str.startsWith("delay ")) return delayCommandHandler(str);
    if (str.startsWith("eval ")) return evalCommandHandler(str);
    if (str.startsWith("bgm ")) return bgmCommandHandler(str);
    if (str == "play.bgm")
      return chapterPusher({
        command: "play.bgm",
      });
    if (str == "pause.bgm")
      return chapterPusher({
        command: "pause.bgm",
      });
    if (str.startsWith("to ")) return toCommandHandler(str);
    let wasSayCommand = false;
    Object.keys(acters).forEach((key) => {
      if (str.startsWith(`${key} `)) {
        wasSayCommand = true;
        sayHandler(str, key);
      }
    });
    if (wasSayCommand) return;
    chapterPusher(str);
  };
  const eacher = (i: string) => {
    i = trimmer(i);
    if (i == "") return;
    logger("eacher", `Handle ${i.replace(/\n/gi, " ")}`);

    if (i.startsWith("}")) return chapterEndHandler(i);
    if (i.startsWith("chapter ")) return chapterHandler(i);
    commandHandler(i);
  };
  ontCode
    .replace(/\r\n/gi, "\n")
    .replace(/\r/gi, "\n")
    .replace(/\n\n/gi, "\n")
    .split(";")
    .forEach(eacher);
  return {
    initCodes: res,
    chapters: chapters,
    acters: acters,
    alias: alias,
  };
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function RunOnt(
  ontCode: string,
  onteeid: string,
  options?: OnteeInitOptions
) {
  let jsoned = OntParser(ontCode, onteeid);
  if (typeof characters[onteeid] == "undefined")
    characters[onteeid] = jsoned.acters;
  else characters[onteeid] = Object.assign(characters[onteeid], jsoned.acters);
  let onteeWindow: OnteeWindow;
  if (typeof inited[onteeid] !== "undefined") onteeWindow = inited[onteeid];
  else {
    inited[onteeid] = ontee.init(onteeid, options);
    onteeWindow = inited[onteeid];
  }

  const codeExecuter = async (code: Command) => {
    switch (code.command) {
      case "bgm":
        onteeWindow.bgm.set(code.data!);
        return;
      case "play.bgm":
        onteeWindow.bgm.play();
        return;
      case "pause.bgm":
        onteeWindow.bgm.pause();
        return;
      case "delay":
        await delay(parseInt(code.data!));
        return;
      case "eval":
        let jsCodeRes = await fetch(code.data!);
        let jsCode = await jsCodeRes.text();
        eval(`(()=>{ontid=${onteeid};${jsCode}})()`);
        return;
      case "bg":
        switch (code.type! as "img" | "vid" | "col") {
          case "img":
            onteeWindow.setBackground(
              ontee.image.get(await ontee.image.load(code.data!))
            );
            return;
          case "col":
            onteeWindow.setBackground(code.data!);
            return;
          case "vid":
            let vidOb = document.createElement("video");
            vidOb.src = code.data!;
            onteeWindow.setVideoBackground(vidOb);
            return;
        }
      case "say":
        return await new Promise<void>((resolve) => {
          onteeWindow.dialogue.say(
            characters[onteeid][code.type!],
            code.data!,
            () => {
              resolve();
            }
          );
        });
      case "to":
        if (code.type! == "cha")
          return await executeChapter(jsoned.chapters[code.data!]);
        if (code.type! == "url") {
          const data = await fetch(code.data!);
          const texted = await data.text();

          await RunOnt(texted, onteeid);
        }
    }
  };

  const executeChapter = async (chapter: Command[]) => {
    for (let i = 0; i < chapter.length; i++) {
      await codeExecuter(chapter[i]);
    }
  };

  await executeChapter(jsoned.initCodes);
}
