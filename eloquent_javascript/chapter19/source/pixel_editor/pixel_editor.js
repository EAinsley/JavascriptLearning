/** This module holds several classes to help mange the data
 * flow of an pixel art editor.
 * @module PixelDitor
 */
import { elt } from "./utils.js";
import { Picture, PictureCanvas } from "./picture.js";
import { draw, fill, rectangle, pick } from "./tool_pack.js";
import { ToolSelect, ColorSelect } from "./control_pack.js";

/** the pixel editor */
class PixelEditor {
  /**
   * @param {State} state the state of the editor
   * @param {Object} config the config of the editor
   */
  constructor(state, config) {
    let { tools, controls, dispatch } = config;
    this.state = state;
    this.canvas = new PictureCanvas(this.state.picture, (pos) => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return (pos) => onMove(pos, this.state);
    });
    this.controls = controls.map((Control) => new Control(state, config));
    this.dom = elt(
      "div",
      {},
      this.canvas.dom,
      elt("br"),
      ...this.controls.reduce((a, c) => a.concat(" ", c.dom), [])
    );
  }
  /**
   * sync the state
   * @param {State} state the satete of the editor
   */
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}
/**
 * assign new value
 * @param {State} state
 * @param {Object} action
 * @returns {State}
 */
function updateState(state, action) {
  // return Object.assign({}, state, action);
  return { ...state, ...action };
}

let state = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
};
let default_editor = new PixelEditor(state, {
  tools: { draw, fill, rectangle, pick },
  controls: [ToolSelect, ColorSelect],
  dispatch(action) {
    state = updateState(state, action);
    default_editor.syncState(state);
  },
});
export { PixelEditor, default_editor };

/**
 * @typedef State
 * @type {Object}
 * @property {String} tool the current selected tool
 * @property {String} color the current selected color
 * @property {Picture} picture the picture
 */
/**
 * @typedef Config
 * @type {Object}
 * @property {Array.<Function>} tools a list of tools
 * @property {Array.<Object>} controls a list of controls
 * @property {Function} dispatch the dispatch funtion
 */
