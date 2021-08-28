import { Editor } from "./editor.js";

window.addEventListener("load", main);

function main() {
  const initstate = { currentfile: "", currentdir: "/" };
  const initconfig = { baseurl: "http://localhost:8000/files" };
  const editor = new Editor(initstate, initconfig);
  document.body.appendChild(editor.dom);
  // save_button.addEventListener("click", savefile);
}
