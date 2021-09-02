import { Control, elt } from "./util.js";

class Editor extends Control {
  constructor(state, config) {
    super(state, config);
    this.textarea = elt("textarea", {
      oninput: () => {
        this.dispatch({ value: this.textarea.value });
      },
      onchange: () => {
        this.dispatch({ value: this.textarea.value }, { refreshpreview: true });
      },
    });
    this.preview = elt("iframe");
    this.name = elt("p");
    this.save = elt("button", { onclick: () => saveFile(this) }, "save file");
    this.delete = elt(
      "button",
      { onclick: () => deleteFile(this) },
      "delete file"
    );
    this.dom = elt(
      "main",
      { id: "editor" },
      this.name,
      this.textarea,
      this.preview
    );
  }

  syncState({ value, currentdir, currentfile }) {
    this.textarea.value = value;
    this.state.value = value;
    if (currentfile != this.state.currentfile) {
      this.state.currentfile = currentfile;
      if (currentfile) {
        this.name.textContent = `${currentfile}`;
        this.preview.src = this.baseurl + currentfile;
      } else this.name.textContent = `${currentdir}`;
    }
  }

  executeCommand({
    openfile = false,
    clearfile = false,
    refreshpreview = false,
  }) {
    if (openfile) {
      const fileulr = this.baseurl + this.state.currentfile;
      fetch(fileulr, { method: "GET" })
        .then((resp) => {
          if (resp.ok) {
            return resp.text();
          }
        })
        .then((text) => {
          this.dispatch({ value: text });
        });
    }
    if (refreshpreview) {
      this.preview.src = this.baseurl + this.state.currentfile;
    }
    if (clearfile) {
      this.dispatch({ value: "", currentfile: "" });
    }
  }
}

export { Editor };
