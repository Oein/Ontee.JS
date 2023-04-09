# Ontee(온티) Engine

Typescript based virtual novel game engine

# Installation

wip

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
