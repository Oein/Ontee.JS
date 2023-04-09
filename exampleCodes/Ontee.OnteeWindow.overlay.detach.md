# [Example Code] Ontee.OnteeWindow.overlay.detach

```ts
let onteeWindow = ontee.init("ont");

let overlayElement = document.createElement("div");
overlayElement.innerText = "OVERLAYED!";
overlayElement.style.position = "relative";
overlayElement.style.left = "50%";
overlayElement.style.top = "50%";
overlayElement.style.transform = "translate(-50%, -50%)";

let overlayid = onteeWindow.overlay.attach(overlayElement);

onteeWindow.overlay.detach(overlayid);
```
