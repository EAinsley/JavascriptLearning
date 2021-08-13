"use strict";
import { startPixelEditor } from "./pixel_editor/pixel_editor.js";

window.addEventListener("load", main);
function main() {
  document.querySelector("div").appendChild(startPixelEditor({}));
}
