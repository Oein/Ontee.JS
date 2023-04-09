# Ontee api docs

# Ontee

- init: (onteeid: string, options?: OnteeInitOptions) => OnteeWindow

## Ontee.init

Creates an ontee window in the given HTMLElement

```ts
function init(
  // HTML Element id
  onteeid: string,
  options?: OnteeInitOptions
): OnteeWindow;
```

## Ontee.OnteeInitOptions

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

#### Ontee.OnteeInitOptions.dialogue.dialogueElementGenerator

```ts
function dialogueElementGenerator(
  // character name
  name: string,
  // line to say
  line: string
): HTMLElement;
```

#### Ontee.OnteeInitOptions.dialogue.getCharacterNameFontSizePixel

```ts
function getCharacterNameFontSizePixel(
  // Client height of the generated dialogue div
  height: number
): number | string; // Returns px
```

#### Ontee.OnteeInitOptions.dialogue.getLineFontSizePixel

```ts
function getLineFontSizePixel(
  // Client height of the generated dialogue div
  height: number
): number | string; // Returns px
```

## Ontee.OnteeWindow

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

#### Ontee.OnteeWindow.overlay.attach

```ts
function attach(
  // element to show on the overlay window
  element: Element,
  // [Optional] fixed overlay id
  customID?: string
): string; // overlay id
```

#### Ontee.OnteeWindow.overlay.detach

Detach the element with the given overlay id from the overlay element

```ts
function detach(
  // overlay id
  id: string
): void;
```

### Ontee.OnteeWindow.fullscreen

#### Ontee.OnteeWindow.fullscreen.getIsFullscreen

Returns is the ontee element is fullscreened

```ts
function getIsFullscreen(): boolean;
```

#### Ontee.OnteeWindow.fullscreen.requestFullscreen

Fullscreen ontee element

```ts
function async requestFullscreen(): void
```

#### Ontee.OnteeWindow.fullscreen.exitFullscreen

Exit fullscreen ontee element

```ts
function exitFullscreen(): void;
```

#### Ontee.OnteeWindow.fullscreen.toggleFullscreen

Toggle fullscreen ontee element

```ts
function async toggleFullscreen(): void
```

#### Ontee.OnteeWindow.fullscreen.setFullscreen

Set fullscreen ontee element

```ts
function async setFullscreen(isFullscreen: boolean): void
```
