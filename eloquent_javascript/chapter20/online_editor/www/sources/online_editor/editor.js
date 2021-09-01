import { elt } from "./util.js";
import { Menu } from "./menu.js";

class Editor {
  constructor(state, config, dispatch) {
    this.state = state;
    this.config = config;
    this.textarea = elt("textarea");
    this.iframe = elt("iframe", { frameborder: 1 });

    const savebutton = elt(
      "button",
      { onclick: () => this.savefile() },
      "save"
    );
    const newfilebutton = elt(
      "button",
      { onclick: () => this.newfile() },
      "new file"
    );
    this.button_group = elt(
      "div",
      { id: "button_group" },
      savebutton,
      newfilebutton
    );
    this.filelist = new Menu(this.state, this.config, dispatch);
    this.dom = elt(
      "div",
      { id: "container" },
      elt("aside", { id: "sidebar" }, this.button_group, this.filelist.dom),
      elt("main", { id: "editor" }, this.textarea, this.iframe)
    );
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
    this.filelist.syncState(state);
  }
}

function updateState(state, action) {
  return { ...state, ...action };
}

const startState = { currentfile: "", currentdir: "/" };
const startConfig = { baseurl: "http://localhost:8000/files" };

function startEditor({ state = startState, config = startConfig }) {
  let app = new Editor(state, config, function dispatch(action) {
    state = updateState(state, action);
    app.syncState(state);
  });
  return app.dom;
}

export { startEditor };
