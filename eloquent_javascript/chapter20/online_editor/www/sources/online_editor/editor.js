import { Control, elt } from "./util.js";

class Editor extends Control {
  constructor(state, config) {
    super(state, config);
    this.textarea = elt("textarea");
    this.preview = elt("iframe");
    this.save = elt("button", {}, "save file");
    this.delete = elt("button", {}, "delete file");
    this.dom = elt("main", { id: "editor" }, this.textarea, this.preview);
    this.tools = [this.save, this.delete];
  }
  syncState(state) {
    this.state = state;
  }
}

export { Editor };
