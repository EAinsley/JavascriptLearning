import { startEditor } from "./online_editor/online_editor.js";

window.addEventListener("load", main);

function main() {
  document.body.appendChild(startEditor({}));
}
