/**
 * holds several Control classes for pixel editor
 * @module ControlPack
 */

import { elt } from "./utils.js";
import { Picture } from "./picture.js";
/** a tool select menu */
class ToolSelect {
  /**
   * @param {State} state the state of editor.
   * @param {Config} param1
   */
  constructor(state, { tools, dispatch }) {
    this.select = elt(
      "select",
      {
        onchange: () => dispatch({ tool: this.select.value }),
      },
      ...Object.keys(tools).map((name) =>
        elt(
          "option",
          {
            selected: name == state.tool,
          },
          name
        )
      )
    );
    this.dom = elt("label", null, "Tool: ", this.select);
  }
  syncState(state) {
    this.select.value = state.tool;
  }
}

/** a color select menu */
class ColorSelect {
  /**
   * @param {State} state
   * @param {Config} param1
   */
  constructor(state, { dispatch }) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({ color: this.input.value }),
    });
    this.dom = elt("label", null, "Color: ", this.input);
  }
  syncState(state) {
    this.input.value = state.color;
  }
}

export { ToolSelect, ColorSelect };

/**
 * @callback DispatchCallback
 * @param {{x:Number, y:Number}}
 * @returns {?DispatchCallback}
 */

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
