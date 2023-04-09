# [Example Code] Ontee.OnteeInitOptions.dialogue.dialogueElementGenerator

# Warning!

Character name element's id must be `ontee_name`. And line element's id must be `ontee_line`.

```ts
function dialogueElementGenerator(name: string, line: string) {
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
}
```
