import { OnteeWindow } from "./../ontee/types";
import ontee from "../ontee";
import { OnteeInitOptions } from "../ontee/types";

const initCodesKey = "  init codes  ";
const ontParser__log = false;
const loadSave__log = false;
const runOnt__log = false;
const runOnt_saveFile__log = false;

let inited: {
  [key: string]: OnteeWindow;
} = {};

let characters: {
  [key: string]: {
    [key: string]: string;
  };
} = {};

export let saves: {
  [key: string]: any;
} = {};

let codeCache: {
  [key: string]: string;
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
  | "bg"
  | "delay"
  | "eval"
  | "bgm"
  | "to"
  | "say"
  | "play.bgm"
  | "pause.bgm";

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
    if (ontParser__log)
      logger("chapter.start", `Chapter name : ${chapterName}`);
    eacher(i.slice(i.indexOf("{") + 1));
    return;
  };
  const chapterEndHandler = (i: string) => {
    if (ontParser__log) logger("chapter.end", `Chapter "${chapterName}" done`);
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

    if (ontParser__log) logger("acter.new", `${codeName} : ${shownName}`);
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
    if (ontParser__log) logger("eacher", `Handle ${i.replace(/\n/gi, " ")}`);

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

async function fetchOnt(url: string) {
  if (typeof codeCache[url] != "undefined") return codeCache[url];
  let res = await fetch(url);
  let tex = await res.text();
  codeCache[url] = tex;
  return tex;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function RunOnt(
  ontCode: string,
  filename: string,
  onteeid: string,
  options?: OnteeInitOptions,
  runFrom?: {
    chapter: string;
    line: number;
  }
) {
  let jsoned = OntParser(ontCode, onteeid);
  if (typeof characters[onteeid] == "undefined")
    characters[onteeid] = jsoned.acters;
  else characters[onteeid] = Object.assign(characters[onteeid], jsoned.acters);
  if (typeof saves[onteeid] == "undefined") saves[onteeid] = {};

  if (typeof saves[onteeid]["callstack"] == "undefined")
    saves[onteeid]["callstack"] = [];

  if (typeof saves[onteeid]["bgm"] == "undefined")
    saves[onteeid]["bgm"] = {
      playing: false,
      url: "",
    };

  if (typeof saves[onteeid]["bg"] == "undefined")
    saves[onteeid]["bg"] = {
      data: "#ffffff",
      type: "c",
    };

  let onteeWindow: OnteeWindow;
  if (typeof inited[onteeid] !== "undefined") onteeWindow = inited[onteeid];
  else {
    inited[onteeid] = ontee.init(onteeid, options);
    onteeWindow = inited[onteeid];
  }

  if (typeof saves[onteeid]["onteeVar"] == "undefined")
    saves[onteeid]["onteeVar"] = onteeWindow.varables;

  const codeExecuter = async (code: Command) => {
    switch (code.command) {
      case "bgm":
        saves[onteeid]["bgm"]["url"] = code.data!;
        onteeWindow.bgm.set(code.data!);
        return;
      case "play.bgm":
        saves[onteeid]["bgm"]["playing"] = true;
        onteeWindow.bgm.play();
        return;
      case "pause.bgm":
        saves[onteeid]["bgm"]["playing"] = false;
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
            saves[onteeid]["bg"] = {
              type: "i",
              data: code.data!,
            };
            return;
          case "col":
            onteeWindow.setBackground(code.data!);
            saves[onteeid]["bg"] = {
              type: "c",
              data: code.data!,
            };
            return;
          case "vid":
            let vidOb = document.createElement("video");
            vidOb.src = code.data!;
            onteeWindow.setVideoBackground(vidOb);
            saves[onteeid]["bg"] = {
              type: "v",
              data: code.data!,
            };
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
        if (code.type! == "cha") {
          await executeChapter(jsoned.chapters[code.data!], code.data!);
        }
        if (code.type! == "url") {
          const texted = await fetchOnt(code.data!);

          return await RunOnt(texted, code.data!, onteeid);
        }
    }
  };

  const save = () => {
    saves[onteeid]["onteeVar"] = onteeWindow.varables;
    if (runOnt_saveFile__log)
      logger("Save file", JSON.stringify(saves[onteeid], null, 2));
  };

  const executeChapter = async (
    chapter: Command[],
    chapterName: string,
    fromLine?: number
  ) => {
    if (typeof runFrom === "undefined")
      saves[onteeid]["callstack"].push({
        chaptername: chapterName,
        file: filename,
        line: fromLine || 0,
      });
    save();

    for (let i = fromLine || 0; i < chapter.length; i++) {
      saves[onteeid]["callstack"][saves[onteeid]["callstack"].length - 1][
        "line"
      ] = i;

      save();
      if (runOnt__log) logger("Run", JSON.stringify(chapter[i], null, 2));
      await codeExecuter(chapter[i]);
    }
    saves[onteeid]["callstack"].pop();
  };

  if (runFrom) {
    if (runFrom.chapter == initCodesKey)
      await executeChapter(jsoned.initCodes, initCodesKey, runFrom.line);
    else
      await executeChapter(
        jsoned.chapters[runFrom.chapter],
        runFrom.chapter,
        runFrom.line
      );
  } else await executeChapter(jsoned.initCodes, initCodesKey);
}

export async function loadSave(
  saveFile: any,
  mainCode: string,
  onteeid: string,
  options?: OnteeInitOptions
) {
  saves[onteeid] = JSON.parse(JSON.stringify(saveFile));
  inited[onteeid] = ontee.init(onteeid, options);
  inited[onteeid].varables = { ...saveFile["onteeVar"] };

  // Load background
  switch (saveFile["bg"]["type"]) {
    case "c":
      inited[onteeid].setBackground(saveFile["bg"]["data"]);
      break;
    case "i":
      inited[onteeid].setBackground(
        ontee.image.get(await ontee.image.load(saveFile["bg"]["data"]))
      );
      break;
    case "v":
      let vidOb = document.createElement("video");
      vidOb.src = saveFile["bg"]["data"];
      inited[onteeid].setVideoBackground(vidOb);
      break;
  }

  // Load bgm
  if (
    saveFile["bgm"]["url"] &&
    saveFile["bgm"]["url"].length &&
    saveFile["bgm"]["url"].length > 0
  ) {
    inited[onteeid].bgm.set(saveFile["bgm"]["url"]);
  }

  // Play bgm
  if (saveFile["bgm"]["playing"]) {
    inited[onteeid].bgm.play();
  }

  for (let i = saveFile["callstack"].length - 1; i >= 0; i--) {
    let addit = saveFile["callstack"].length - 1 == i ? 0 : 1;
    let callstack = saveFile["callstack"][i] as {
      chaptername: string;
      file: string;
      line: number;
    };

    let runFrom = {
      chapter: callstack.chaptername,
      line: callstack.line + addit,
    };

    if (loadSave__log)
      logger(
        "Loader::Run from",
        JSON.stringify(
          {
            ...runFrom,
            file: callstack.file,
          },
          null,
          2
        )
      );

    if (callstack.file == "Ontee.JS") {
      // from raw code
      logger("Save loader", "Run Main Ont");
      await RunOnt(mainCode, callstack.file, onteeid, options, runFrom);
      continue;
    }

    if (loadSave__log) logger("Save loader", "Run Web Ont");

    // from web code
    let rawCode = await fetchOnt(callstack.file);

    await RunOnt(rawCode, callstack.file, onteeid, options, runFrom);

    if (loadSave__log) logger("Loder::Done", "");
  }
}
