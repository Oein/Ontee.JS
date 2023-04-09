# Ontee api docs

# Ontee

- init: (onteeid: string, options?: OnteeInitOptions) => OnteeWindow

## [Ontee.init](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.init.md)

Creates an ontee window in the given HTMLElement

```ts
function init(
  // HTML Element id
  onteeid: string,
  options?: OnteeInitOptions
): OnteeWindow;
```

## [Ontee.OnteeInitOptions](https://github.com/Oein/Ontee.JS/blob/master/src/ontee/types.ts#L1)

```ts
interface OnteeInitOptions {
  // Size of the canvas
  width: number;
  height: number;
  dialogue: {
    // Generates an element with name and line
    dialogueElementGenerator: function;
    // Returns character name's font size (px)
    getCharacterNameFontSizePixel: function;
    // Returns line's font size (px)
    getLineFontSizePixel: function;
  };
}
```

### Ontee.OnteeInitOptions.dialogue

#### [Ontee.OnteeInitOptions.dialogue.dialogueElementGenerator](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeInitOptions.dialogue.dialogueElementGenerator.md)

```ts
function dialogueElementGenerator(
  // character name
  name: string,
  // line to say
  line: string
): HTMLElement;
```

#### [Ontee.OnteeInitOptions.dialogue.getCharacterNameFontSizePixel](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeInitOptions.dialogue.getCharacterNameFontSizePixel.md)

```ts
function getCharacterNameFontSizePixel(
  // Client height of the generated dialogue div
  height: number
): number | string; // Returns px
```

#### [Ontee.OnteeInitOptions.dialogue.getLineFontSizePixel](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeInitOptions.dialogue.getLineFontSizePixel.md)

```ts
function getLineFontSizePixel(
  // Client height of the generated dialogue div
  height: number
): number | string; // Returns px
```

## [Ontee.OnteeWindow](https://github.com/Oein/Ontee.JS/blob/147830e9049284ecae30124355e53190cc0293ad/src/ontee/types.ts#L38)

```ts
interface OnteeWindow {
  // Root Element
  onteeElement: HTMLDivElement;
  canvasElement: HTMLCanvasElement;
  // Background element
  underlayElement: HTMLDivElement;
  options: OnteeInitOptions;
  overlay: {
    overlays: OnteeOverlay[];
    overlayElement: HTMLDivElement;
    attach: function;
    detach: function;
  };
  events: OnteeEventEmitter;
  fullscreen: {
    isFullscreen: boolean;
    getIsFullscreen: function;
    requestFullscreen: function;
    exitFullscreen: function;
    toggleFullscreen: function;
    setFullscreen: function;
  };
  dialogue: {
    say: function;
  };
  requestFrame: function;
  setBackground: function;
  setVideoBackground: function;
  varables: { [key: string]: any };
  bgm: {
    set: function;
    play: function;
    pause: function;
  };
}
```

### Ontee.OnteeWindow.overlay

Attach the given element to the overlay element

#### [Ontee.OnteeWindow.overlay.attach](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.overlay.attach.md)

```ts
function attach(
  // element to show on the overlay window
  element: Element,
  // [Optional] fixed overlay id
  customID?: string
): string; // overlay id
```

#### [Ontee.OnteeWindow.overlay.detach](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.overlay.detach.md)

Detach the element with the given overlay id from the overlay element

```ts
function detach(
  // overlay id
  id: string
): void;
```

### Ontee.OnteeWindow.fullscreen

#### [Ontee.OnteeWindow.fullscreen.getIsFullscreen](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.fullscreen.getIsFullscreen.md)

Returns is the ontee element is fullscreened

```ts
function getIsFullscreen(): boolean;
```

#### [Ontee.OnteeWindow.fullscreen.requestFullscreen](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.fullscreen.requestFullscreen.md)

Fullscreen ontee element

```ts
function async requestFullscreen(): void
```

#### [Ontee.OnteeWindow.fullscreen.exitFullscreen](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.fullscreen.exitFullscreen.md)

Exit fullscreen ontee element

```ts
function exitFullscreen(): void;
```

#### [Ontee.OnteeWindow.fullscreen.toggleFullscreen](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.fullscreen.toggleFullscreen.md)

Toggle fullscreen ontee element

```ts
function async toggleFullscreen(): void
```

#### [Ontee.OnteeWindow.fullscreen.setFullscreen](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.fullscreen.setFullscreen.md)

Set fullscreen ontee element

```ts
function async setFullscreen(isFullscreen: boolean): void
```

### Ontee.OnteeWindow.dialogue

#### [Ontee.OnteeWindow.dialogue.say](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.dialogue.say.md)

Say a message

```ts
function say(
  // name of the character
  name: string,
  // message to say
  line: string,
  // callback function to call when player requests the next message
  next: () => void
): void;
```

### Ontee.OnteeWindow.requestFrame

> Called by onteeheart, not your application

Draw to the canvas

```ts
function requestFrame(): void;
```

### [Ontee.OnteeWindow.setBackground](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.setBackground.md)

Set the background of your canvas

```ts
function setBackground(
  // Image
  //  or HexColor Value
  background: HTMLImageElement | string
) => void
```

### [Ontee.OnteeWindow.setVideoBackground](https://github.com/Oein/Ontee.JS/blob/master/exampleCodes/Ontee.OnteeWindow.setVideoBackground.md)

Set the background of your canvas

```ts
function setVideoBackground(
  // document.createElement('video')
  video: HTMLVideoElement,
  loop?: boolean,
  // called when listened "ended" from the video
  endHandler?: (e: Event) => void
): void;
```

### Ontee.OnteeWindow.bgm

#### Ontee.OnteeWindow.bgm.set

Set the bgm url

```ts
function set(url: string): void;
```

#### Ontee.OnteeWindow.bgm.play

Play the bgm

```ts
function play(): void;
```

#### Ontee.OnteeWindow.bgm.pause

Pause the bgm

```ts
function pause(): void;
```
