import { Control, elt } from "./util.js";

class Editor extends Control {
  constructor(state, config) {
    super(state, config);
    this.textarea = elt("textarea");
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
    this.tools = [
      { tool: this.save, hotkey: { ctrlKey: true, metaKey: true, key: "s" } },
      { tool: this.delete, hotkey: { ctrlKey: true, metaKey: true, key: "d" } },
    ];
  }

  syncState(state, { openfile = false, clearfile = false }) {
    this.state = state;
    if (openfile) {
      const fileulr =
        this.baseurl + this.state.currentdir + this.state.currentfile;
      fetch(fileulr, { method: "GET" })
        .then((resp) => {
          if (resp.ok) {
            this.preview.src = fileulr;
            this.name.textContent =
              `${this.state.currentfile}` + ` (${this.state.currentdir})`;
            return resp.text();
          }
        })
        .then((text) => (this.textarea.value = text));
    }
    if (clearfile) {
      this.textarea.value = "";
      this.name.textContent = "";
      this.preview.src = "";
    }
  }
}

function deleteFile(that) {
  if (that.state.currentfile) {
    const confirmDelete = window.confirm(
      `Do you want to delete: ${that.state.currentfile} ` +
        `(${that.state.currentdir})?`
    );
    if (confirmDelete)
      fetch(that.baseurl + that.state.currentdir + that.state.currentfile, {
        method: "DELETE",
      }).then(() => {
        that.dispatch(
          { currentfile: "" },
          { clearfile: true, refreshdir: true }
        );
      });
  }
}

function saveFile(that) {
  if (!that.state.currentfile) return;
  const fileurl = that.baseurl + that.state.currentdir + that.state.currentfile;
  fetch(fileurl, { method: "PUT", body: that.textarea.value }).then((resp) => {
    if (resp.ok) {
      that.preview.src = fileurl;
    }
    console.log("saved");
  });
}

export { Editor };
