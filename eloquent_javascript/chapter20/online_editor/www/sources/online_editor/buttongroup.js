import { elt, Control } from "./util.js";

class ButtonGroup extends Control {
  constructor(state, config) {
    super(state, config);
    this.dom = elt("div", { id: "button_group" });
  }
  setTools(tools) {
    for (const tool of tools) this.dom.appendChild(tool);
  }
}

export { ButtonGroup };
