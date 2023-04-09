export interface OnteeInitOptions {
  width?: number;
  height?: number;
  dialogue?: {
    dialogueElementGenerator?: (name: string, line: string) => Element;
    getCharacterNameFontSizePixel?: (height: number) => number | string;
    getLineFontSizePixel?: (height: number) => number | string;
  };
}

export interface OnteeOverlay {
  id: string;
  element: Element;
}

export type OnteeEventType = "resize" | "nextDialogue";

export interface OnteeEvent {
  type: OnteeEventType;
  data: any;
}

export interface OnteeEventEmitter {
  listeners: {
    [key in OnteeEventType]?: {
      handler: (event: OnteeEvent) => void;
      id: string;
    }[];
  };
  addEventListener: (
    type: OnteeEventType,
    listener: (event: OnteeEvent) => void
  ) => string;
  removeEventListener: (id: string) => void;
  emit: (type: OnteeEventType, data?: any) => void;
}

export interface OnteeWindow {
  onteeElement: HTMLDivElement;
  canvasElement: HTMLCanvasElement;
  options: OnteeInitOptions;
  underlayElement: HTMLDivElement;
  overlay: {
    overlays: OnteeOverlay[];
    overlayElement: HTMLDivElement;
    attach: (element: Element, customID?: string) => string;
    detach: (id: string) => void;
  };
  events: OnteeEventEmitter;
  fullscreen: {
    isFullscreen: boolean;
    getIsFullscreen: () => boolean;
    requestFullscreen: () => Promise<void>;
    exitFullscreen: () => void;
    toggleFullscreen: () => Promise<void>;
    setFullscreen: (isFullscreen: boolean) => Promise<void>;
  };
  dialogue: {
    say: (name: string, line: string, next: () => void) => void;
  };
  requestFrame: () => void;
  setBackground: (background: HTMLImageElement | string) => void;
  setVideoBackground: (
    video: HTMLVideoElement,
    loop?: boolean,
    endHandler?: (e: Event) => void
  ) => void;
  varables: { [key: string]: any };
  bgm: {
    set: (url: string) => void;
    play: () => void;
    pause: () => void;
  };
}
