import { startEditor } from "./online_editor/editor.js";

window.addEventListener("load", main);

function main() {
  document.body.appendChild(startEditor({}));
}
