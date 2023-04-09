import style2string from "./utils";
import type { Properties as CSSProperties } from "csstype";
import { uid } from "uid";

export type StyleTypes =
  | "canvas"
  | "overlay"
  | "dialogue_container"
  | "dialogue_name_container"
  | "dialogue_character_name"
  | "background"
  | "background_video";

export let styles: {
  [key in StyleTypes]: CSSProperties;
} = {
  canvas: {
    position: "relative",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    background: "white",
  },
  dialogue_container: {
    color: "white",
    position: "absolute",
    width: "80%",
    height: "20%",
    borderRadius: "16px",
    left: "10%",
    right: "10%",
    bottom: "10%",
    background:
      "linear-gradient(180deg, rgba(17, 17, 17, 0.9) 0%, rgba(37, 37, 37, 0.86) 43%, rgba(78, 78, 78, 0.8) 100%)",
    display: "flex",
    flexDirection: "row",
  },
  dialogue_name_container: {
    minWidth: "25%",
    height: "100%",
    textAlign: "center",
    width: "fit-content",
    display: "table",
    borderRight: "1px solid white",
  },
  dialogue_character_name: {
    position: "relative",
    color: "white",
    fontSize: "1.2em",
    display: "table-cell",
    verticalAlign: "middle",
  },
  background: {
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  background_video: {
    width: "100%",
    top: "50%",
    position: "relative",
    transform: "translateY(-50%)",
  },
};

export let styleClassnames: {
  [key in StyleTypes]: string;
};

export default function styler() {
  let newD: { [key: string]: string } = {};
  Object.keys(styles).forEach((x) => {
    let styleKey = x as StyleTypes;
    let styleUID = "onteeStyle_" + uid();
    newD[styleKey] = styleUID;
    let style = document.createElement("style");
    style.innerHTML = `.${styleUID}{${style2string(styles[styleKey])}}`;
    style.id = styleUID;
    style.className =
      "jsStyler_" +
      styleKey
        .split("_")
        .map((i) => {
          i = i.toLowerCase();
          if (i.length == 0) return i;
          let fir = i.charCodeAt(0) - 32;
          return `${String.fromCharCode(fir)}${i.slice(1)}`;
        })
        .join("");
    document.head.appendChild(style);
  });
  styleClassnames = newD as any;
}

export function styled(element: Element, ...style: StyleTypes[]) {
  style.forEach((x) => {
    element.classList.add(styleClassnames[x]);
  });

  return element;
}
