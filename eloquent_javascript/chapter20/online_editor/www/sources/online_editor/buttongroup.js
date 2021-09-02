import { elt, Control } from "./util.js";

class ButtonGroup extends Control {
  constructor(state, config) {
    super(state, config);
    this.dom = elt("div", { id: "button_group" });
  }
  setTools(tools) {
    for (const tool of tools) {
      const button = elt(
        "button",
        {
          onclick: () => {
            tool.tool(this.state, this.baseurl, this.dispatch);
          },
        },
        tool.name
      );
      this.dom.appendChild(button);
      registerHotkey(document.body, tool.hotkey, () => button.click());
    }
  }
  syncState(state) {
    this.state = state;
  }
}

function registerHotkey(dom, hotkey, func) {
  function keydown(event) {
    if (
      (hotkey.ctrlKey ^ event.ctrlKey && hotkey.metaKey ^ event.metaKey) ||
      hotkey.shiftKey ^ event.shiftKey ||
      hotkey.altKey ^ event.altKey
    )
      return;
    if (hotkey.key == event.key) {
      event.preventDefault();
      func();
    }
  }
  dom.addEventListener("keydown", keydown);
}

export { ButtonGroup };
