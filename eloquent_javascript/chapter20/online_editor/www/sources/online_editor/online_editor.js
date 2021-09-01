import { Control, elt } from "./util.js";
import { Menu } from "./menu.js";
import { Editor } from "./editor.js";
import { ButtonGroup } from "./buttongroup.js";

const startState = { currentfile: "", currentdir: "/" };
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
      if (control.tools) this.tools = this.tools.concat(control.tools);
      if (control instanceof ButtonGroup) this.buttons = control;
    }
    this.buttons.setTools(this.tools);
  }
  openfile(filename) {
    this.state.currentfile = filename;
    fetch(this.config.baseurl + this.state.currentdir + filename, {
      method: "GET",
    })
      .then((resp) => resp.text())
      .then((text) => {
        this.iframe.src =
          this.config.baseurl + this.state.currentdir + filename;
        this.textarea.value = text;
      });
  }
  savefile() {
    const content = this.textarea.value;
    fetch(
      this.config.baseurl + this.state.currentdir + this.state.currentfile,
      {
        method: "PUT",
        body: content,
      }
    );
    this.iframe.contentWindow.location.reload();
    console.log("saved!");
  }
  newfile() {
    const newfilename = prompt("filename:");
    fetch(this.config.baseurl + this.state.currentdir + newfilename, {
      method: "PUT",
    }).then((resp) => {
      if (resp.ok) {
        this.state.currentfile = newfilename;
      }
    });
  }
  syncState(state) {
    this.state = state;
    for (const control of this.controls) control.syncState(state);
  }
}

function updateState(state, action) {
  return { ...state, ...action };
}

function startEditor({ state = startState, config = startConfig }) {
  let app = new OnlieEditor(state, {
    baseurl: config.baseurl,
    layout: config.layout,
    dispatch(action) {
      state = updateState(state, action);
      app.syncState(state);
    },
  });
  return app.dom;
}

export { startEditor };
