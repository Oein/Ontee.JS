import { OnteeWindow } from "../../types";

export function fetchDialogueOverlay(ontee: OnteeWindow) {
  let elements = ontee.overlay.overlays.filter((i) => i.id == "dialogue");
  if (elements.length == 0) return;
  const fetchName = () => {
    let span = elements[0].element.querySelector(
      "#ontee_name"
    ) as HTMLSpanElement;
    if (!span) return;
    if (!span.style) return;

    span.style.fontSize = "1.2em";

    let elementx = ontee.overlay.overlays.filter((i) => i.id == "dialogue");
    if (
      elementx.length != 0 &&
      elementx[0] &&
      elementx[0].element &&
      ontee.options &&
      ontee.options.dialogue &&
      ontee.options.dialogue.getCharacterNameFontSizePixel
    )
      span.style.fontSize =
        ontee.options.dialogue
          .getCharacterNameFontSizePixel(elementx[0].element.clientHeight)
          .toString() + "px";
  };
  const fetchLine = () => {
    let span = elements[0].element.querySelector(
      "#ontee_line"
    ) as HTMLSpanElement;
    if (!span) return;
    if (!span.style) return;

    span.style.fontSize = "1em";

    let elementx = ontee.overlay.overlays.filter((i) => i.id == "dialogue");
    if (
      elementx.length != 0 &&
      elementx[0] &&
      elementx[0].element &&
      ontee.options &&
      ontee.options.dialogue &&
      ontee.options.dialogue.getLineFontSizePixel
    )
      span.style.fontSize =
        ontee.options.dialogue
          .getLineFontSizePixel(elementx[0].element.clientHeight)
          .toString() + "px";
  };

  fetchName();
  fetchLine();
}

export default function fetchOnteeCanvasSize(ontee: OnteeWindow) {
  fetchDialogueOverlay(ontee);

  let wd = ontee.onteeElement.clientWidth;
  let hd = ontee.onteeElement.clientHeight;

  // option에서의 width, height의 비율을 1로 가정 했을때 실제 비율
  let rradi = wd / hd / (ontee.options.width! / ontee.options.height!);

  const fetchOverlay = (element: HTMLElement) => {
    element.style.width = ontee.canvasElement.style.width;
    element.style.height =
      (
        parseInt(ontee.canvasElement.style.height.replace("px", "")) + 1
      ).toString() + "px";
    element.style.left = ontee.canvasElement.offsetLeft.toString() + "px";
    element.style.top = ontee.canvasElement.offsetTop.toString() + "px";
  };

  const fetchLayers = () => {
    fetchOverlay(ontee.overlay.overlayElement);
    fetchOverlay(ontee.underlayElement);
  };

  if (rradi > 1) {
    // 세로에 맞춰야함
    ontee.canvasElement.style.height = `${hd}px`;
    ontee.canvasElement.style.width = `${
      hd * (ontee.options.width! / ontee.options.height!)
    }px`;

    fetchLayers();

    return;
  }

  // 가로에 맞춰야함
  ontee.canvasElement.style.width = `${wd}px`;
  ontee.canvasElement.style.height = `${
    wd * (ontee.options.height! / ontee.options.width!)
  }px`;

  fetchLayers();
}
