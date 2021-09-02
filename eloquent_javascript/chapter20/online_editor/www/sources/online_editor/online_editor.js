import { Control, elt } from "./util.js";
import { Menu } from "./menu.js";
import { Editor } from "./editor.js";
import { ButtonGroup } from "./buttongroup.js";

const startState = {
  currentfile: "",
  currentdir: "/",
  openfile: false,
  opendir: true,
};
const startConfig = {
  baseurl: "http://localhost:8000/files",
  layout: {
    type: "div",
    attr: { id: "container" },
    children: [
      {
        type: "aside",
        attr: { id: "sidebar" },
        children: [ButtonGroup, Menu],
      },
      Editor,
    ],
  },
};

function buildeditor(component, state, config, dispatch) {
  if (component.prototype instanceof Control) {
    const control = new component(state, config, dispatch);
    return { control: control, dom: control.dom };
  }
  let control = [];
  let doms = [];
  for (const child of component.children) {
    const result = buildeditor(child, state, config, dispatch);
    control = control.concat(result.control);
    doms = doms.concat(result.dom);
  }
  const dom = elt(component.type, component.attr, ...doms);
  return { control, dom };
}

class OnlieEditor {
  constructor(state, config, dispatch) {
    this.state = state;
    this.config = config;
    const { dom, control } = buildeditor(
      config.layout,
      state,
      config,
      dispatch
    );
    this.dom = dom;
    this.controls = control;
    this.tools = [];
    for (const control of this.controls) {
      if (control.tools) {
        for (let { tool, hotkey } of control.tools) {
          this.tools.push(tool);
          registerHotkey(this.dom, hotkey, () => tool.click());
        }
      }
      if (control instanceof ButtonGroup) this.buttons = control;
    }
    this.buttons.setTools(this.tools);
  }
  syncState(state, command) {
    this.state = state;
    for (const control of this.controls) control.syncState(state, command);
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
  document.body.addEventListener("keydown", keydown);
}

function updateState(state, action) {
  return { ...state, ...action };
}

function startEditor({ state = startState, config = startConfig }) {
  let app = new OnlieEditor(state, {
    baseurl: config.baseurl,
    layout: config.layout,
    dispatch(action, command) {
      state = updateState(state, action);
      app.syncState(state, command);
    },
  });
  return app.dom;
}

export { startEditor };
