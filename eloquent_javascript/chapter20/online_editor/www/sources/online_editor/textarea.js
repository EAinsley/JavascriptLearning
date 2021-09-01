import { elt } from "./util.js";

class Textarea {
  constructor(state, config, dispatch) {
    this.state = state;
    this.config = config;
    this.dispatch = dispatch;
    this.dom = elt("textarea");
  }
  syncState(state) {}
}

export { Textarea };
