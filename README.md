<img src="https://raw.githubusercontent.com/Oein/Ontee.JS/master/images/Ontee_garo.svg" style="width: 100%;"></img>

# Ontee(온티).JS

Typescript based virtual novel game engine

# Installation

wip

# Features

- [x] Responsive to any screen sizes (on default settings)
- [x] Voice supported
- [x] Image caching supported
- [x] Typescript supported
- [x] HTML based overlay support
- [x] Video, image, color background supported

# Example Usage

index.html

```html
<div
  id="ont"
  x-data-ontee="enabled"
  style="
    position: fixed;
    left: 0px;
    bottom: 0px;
    height: 100vh;
    width: 100vw;
    background-color: black;
    "
></div>

<script type="module" src="/src/test/index.ts"></script>
```

/src/test/index.ts

```ts
import ontee from "../ontee";

let onteeWindow = ontee.init("ont");
let i = 0;

// says from 0 to endless
const sayer = () => {
  onteeWindow.dialogue.say(
    "Hi",
    `${i}th ${i}th ${Math.random()}${Math.random()}`,
    () => {
      i++;
      sayer();
    }
  );
};
sayer();
```
