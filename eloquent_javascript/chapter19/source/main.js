"use strict";
import { default_editor } from "./pixel_editor/pixel_editor.js";

window.addEventListener("load", main);
function main() {
  let app = default_editor;
  document.querySelector("div").appendChild(app.dom);
}
