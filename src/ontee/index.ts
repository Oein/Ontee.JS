import { uid } from "uid";
import fetchOnteeCanvasSize, {
  fetchDialogueOverlay,
} from "./controllers/canvas/size";
import jsStler, { styled } from "./jsStyle/index";
import {
  OnteeEvent,
  OnteeEventType,
  OnteeInitOptions,
  OnteeWindow,
} from "./types";
import { image } from "./controllers/image";

jsStler();

let runner =
  (window as any).requestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame;

const ontee = {
  init: (onteeid: string, options?: OnteeInitOptions): OnteeWindow => {
    options = Object.assign(
      {
        width: 1920,
        height: 1080,
        dialogue: {
          saySpeed: 25,
          getCharacterNameFontSizePixel: (height: number) => {
            return height / 2.5;
          },
          getLineFontSizePixel: (height: number) => {
            return height / 6;
          },
          dialogueElementGenerator(name: string, line: string) {
            let div = document.createElement("div");
            styled(div, "dialogue_container");

            let secdiv = document.createElement("div");
            styled(secdiv, "dialogue_name_container");
            div.appendChild(secdiv);

            let span = document.createElement("span");
            styled(span, "dialogue_character_name");
            secdiv.appendChild(span);
            span.id = "ontee_name";
            span.innerText = name;

            let lineEle = document.createElement("div");
            lineEle.style.padding = "0.5em";
            lineEle.style.flexGrow = "1";
            lineEle.innerText = line;
            lineEle.style.wordBreak = "break-all";
            lineEle.id = "ontee_line";
            div.appendChild(lineEle);

            fetchDialogueOverlay(onteeWin);

            return div;
          },
        },
      },
      options
    );

    let onteeElementsList = document.querySelectorAll(
      `div#${onteeid}[x-data-ontee="enabled"]`
    ) as NodeListOf<HTMLDivElement>;
    if (onteeElementsList.length == 0)
      throw new Error(`Could not find ontee element with id "${onteeid}"`);
    if (onteeElementsList.length > 1)
      throw new Error(`There are many ontee elements with id "${onteeid}"`);
    let onteeElement = onteeElementsList[0];

    let backgroundUnderlay = styled(
      document.createElement("div"),
      "overlay",
      "background"
    ) as HTMLDivElement;
    let canvas = styled(
      document.createElement("canvas"),
      "canvas"
    ) as HTMLCanvasElement;
    canvas.id = `ontee${onteeid}-canvas-${onteeid}`;
    let overlay = styled(
      document.createElement("div"),
      "overlay"
    ) as HTMLDivElement;
    overlay.id = `ontee${onteeid}-overlay-${onteeid}`;
    overlay.style.background = "transparent";

    onteeElement.appendChild(backgroundUnderlay);
    onteeElement.appendChild(canvas);
    onteeElement.appendChild(overlay);

    let ctx = canvas.getContext("2d");
    while (ctx == null) ctx = canvas.getContext("2d");

    let bgmElement = document.createElement("audio");
    bgmElement.style.display = "none";
    bgmElement.loop = true;
    bgmElement.id = `ontee${onteeid}-bgm-${onteeid}`;
    onteeElement.appendChild(bgmElement);

    let voiceElement = document.createElement("audio");
    voiceElement.style.display = "none";
    voiceElement.loop = false;
    voiceElement.id = `ontee${onteeid}-voice-${onteeid}`;
    onteeElement.appendChild(voiceElement);

    let onteeWin: OnteeWindow = {
      onteeElement: onteeElement,
      canvasElement: canvas,
      underlayElement: backgroundUnderlay,
      options: options,
      varables: {},
      overlay: {
        overlayElement: overlay,
        overlays: [],
        /**
         *
         * @param element Overlay element
         * @returns Ontee overlay id
         */
        attach(element: Element, customID?: string) {
          let id = customID || "ontee_overlay" + uid();
          onteeWin.overlay.overlays.push({
            element: element,
            id: id,
          });
          element.id = id;
          onteeWin.overlay.overlayElement.appendChild(element);
          return id;
        },
        /**
         * @description Remove the overlay from the game
         * @param id "Ontee overlay id" OR "Overlay element id"
         */
        detach(id: string) {
          let overlay_ = onteeWin.overlay.overlays.filter(
            (overlay) => overlay.id == id || overlay.element.id == id
          );
          if (overlay_.length == 0)
            throw new Error(`Could not find overlay with id "${id}"`);
          if (overlay_.length > 1)
            throw new Error(
              `Overlay with id "${id}" has more than one element`
            );
          let overlay = overlay_[0];
          overlay.element.remove();
          onteeWin.overlay.overlays = onteeWin.overlay.overlays.filter(
            (overlay) => overlay.id != id && overlay.element.id != id
          );
        },
      },
      events: {
        listeners: {},
        /**
         * @description Add an event listener
         * @returns Ontee listener id
         */
        addEventListener(
          eventType: OnteeEventType,
          listener: (event: OnteeEvent) => void
        ) {
          let id = "ontee_listener" + uid();
          if (onteeWin.events.listeners[eventType] == null)
            onteeWin.events.listeners[eventType] = [];
          onteeWin.events.listeners[eventType]!.push({
            handler: listener,
            id: id,
          });
          return id;
        },
        /**
         * @description Remove the listener from the game
         * @param id id of the listener
         */
        removeEventListener(id: string) {
          Object.keys(onteeWin.events.listeners).forEach((key) => {
            let ek = key as OnteeEventType;
            if (typeof onteeWin.events.listeners[ek] == "undefined") return;
            onteeWin.events.listeners[ek] = onteeWin.events.listeners[
              ek
            ]!.filter((i) => i.id != id);
          });
        },
        /**
         * @description Send an event to all the listeners
         */
        emit(eventType: OnteeEventType, data: any) {
          onteeWin.events.listeners[eventType]?.forEach((i) => {
            i.handler({
              data,
              type: eventType,
            });
          });
        },
      },
      fullscreen: {
        isFullscreen: false,
        getIsFullscreen() {
          let a =
            (document as any)?.fullscreenElement ||
            (document as any)?.webkitFullscreenElement ||
            (document as any)?.mozFullScreenElement ||
            (document as any)?.msFullscreenElement;
          if (a == null) {
            onteeWin.fullscreen.isFullscreen = false;
            return false;
          }
          onteeWin.fullscreen.isFullscreen = a === onteeWin.onteeElement;
          return onteeWin.fullscreen.isFullscreen;
        },
        async requestFullscreen() {
          await onteeWin.onteeElement.requestFullscreen();
          onteeWin.fullscreen.isFullscreen = true;
        },
        exitFullscreen() {
          if (!onteeWin.fullscreen.isFullscreen)
            throw new Error("Not in fullscreen");
          (
            (document as any).exitFullscreen ||
            (document as any)?.webkitExitFullscreen ||
            (document as any)?.mozCancelFullScreen ||
            (document as any)?.msExitFullscreen
          )();
          onteeWin.fullscreen.isFullscreen = false;
        },
        async toggleFullscreen() {
          if (onteeWin.fullscreen.getIsFullscreen())
            onteeWin.fullscreen.exitFullscreen();
          else await onteeWin.fullscreen.requestFullscreen();
        },
        async setFullscreen(isFullscreen: boolean) {
          if (onteeWin.fullscreen.getIsFullscreen() == isFullscreen) return;
          onteeWin.fullscreen.isFullscreen = isFullscreen;
          if (isFullscreen) await onteeWin.fullscreen.requestFullscreen();
          else onteeWin.fullscreen.exitFullscreen();
        },
      },
      dialogue: {
        say(
          name: string,
          line: string,
          next: () => void = () => {},
          voiceURL?: string
        ) {
          let sayDone = false;
          let inter = setTimeout(() => {});
          const sayer = (index: number) => {
            if (index - 1 == line.length || sayDone) {
              sayDone = true;
              return;
            }
            // get new line element
            let ele = options!.dialogue!.dialogueElementGenerator!(
              name,
              line.slice(0, index)
            );

            // get old lines
            let alrea = onteeWin.overlay.overlays.filter(
              (i) => i.id == "dialogue"
            );

            // detach old lines
            if (alrea.length > 0)
              alrea.forEach((i) => onteeWin.overlay.detach(i.id));
            onteeWin.overlay.attach(ele, "dialogue");

            // fetchSize
            fetchDialogueOverlay(onteeWin);

            inter = setTimeout(
              sayer,
              onteeWin.options.dialogue?.saySpeed || 25,
              index + 1
            );
          };

          inter = setTimeout(sayer, 0, 0);

          const callNextLine = () => {
            if (!sayDone) {
              clearInterval(inter);
              sayer(line.length);
              return;
            }
            onteeWin.voice.pause();
            document.removeEventListener("keydown", keydown);
            onteeWin.onteeElement.removeEventListener("mousedown", mousedown);
            onteeWin.overlay.overlays
              .filter((i) => i.id == "dialogue")
              .forEach((i) => onteeWin.overlay.detach(i.id));
            onteeWin.events.emit("nextDialogue");
            next();
          };

          // goto next line by enter
          let keydown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            if (e.key == "Enter") {
              e.preventDefault();
              callNextLine();
            }
          };

          // goto next line by click
          let mousedown = (e: MouseEvent) => {
            if (e.button == 0) {
              e.preventDefault();
              callNextLine();
            }
          };
          document.addEventListener("keydown", keydown);
          onteeWin.onteeElement.addEventListener("mousedown", mousedown);
          if (voiceURL) {
            onteeWin.voice.set(voiceURL, () => {});
            onteeWin.voice.play();
          }
        },
      },
      bgm: {
        set(url: string) {
          bgmElement.src = url;
          bgmElement.onload = () => {
            bgmElement.play();
          };
        },
        play() {
          bgmElement.play();
        },
        pause() {
          bgmElement.pause();
        },
      },
      voice: {
        set(url: string, callback?: () => void) {
          voiceElement.src = url;
          voiceElement.onload = () => {
            voiceElement.play();
            if (callback) voiceElement.addEventListener("ended", callback);
          };
        },
        play() {
          voiceElement.play();
        },
        pause() {
          voiceElement.pause();
        },
      },
      requestFrame() {
        (() => {})();

        runner(onteeWin.requestFrame);
      },
      setBackground(background: HTMLImageElement | string) {
        backgroundUnderlay.innerHTML = "";
        backgroundUnderlay.style.backgroundColor = "";
        backgroundUnderlay.style.backgroundImage = "";
        if (typeof background == "string") {
          backgroundUnderlay.style.background = background;
          return;
        }

        backgroundUnderlay.style.backgroundImage = `url("${background.src}")`;
      },
      setVideoBackground(
        video: HTMLVideoElement,
        loop: boolean = true,
        endHandler?: (e: Event) => void
      ) {
        backgroundUnderlay.innerHTML = "";
        backgroundUnderlay.style.backgroundColor = "black";
        backgroundUnderlay.style.backgroundImage = "";

        backgroundUnderlay.appendChild(video);

        video.autoplay = true;
        video.loop = loop;
        video.controls = false;

        if (endHandler) video.addEventListener("ended", endHandler);

        styled(video, "background_video");

        video.load();
      },
    };

    runner(onteeWin.requestFrame);

    /**
     * On resize div or window
     *  -> Call canvas style resizer
     */
    fetchOnteeCanvasSize(onteeWin);

    const handleResize = () => {
      fetchOnteeCanvasSize(onteeWin);
      onteeWin.events.emit("resize", {
        width: parseFloat(onteeWin.canvasElement.style.width.replace("px", "")),
        height: parseFloat(
          onteeWin.canvasElement.style.height.replace("px", "")
        ),
      });
    };
    new ResizeObserver(handleResize).observe(onteeElement);
    window?.addEventListener("orientationchange", handleResize);
    window.addEventListener("resize", handleResize);

    return onteeWin;
  },
  image: image,
};

export default ontee;
