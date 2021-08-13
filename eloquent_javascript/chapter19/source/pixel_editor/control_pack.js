/**
 * holds several Control classes for pixel editor
 * @module ControlPack
 */

import { elt, drawPicture } from "./utils.js";
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

/** a save file menu */
class SaveButton {
  /**
   * @param {State} state the state of the editor
   */
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      "button",
      {
        onclick: () => this.save(),
      },
      "Save"
    );
  }
  /**
   * save the file
   */
  save() {
    /**@type {HTMLCanvasElement} */
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png",
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  /**
   * sync the state
   * @param {State} state the state of the editor
   */
  syncState(state) {
    this.picture = state.picture;
  }
}
/** the load file menu */
class LoadButton {
  /**
   * @param {State} _
   * @param {Config} param1
   */
  constructor(_, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => startLoad(dispatch),
      },
      "Load"
    );
  }
  syncState() {}
}
/**
 * @param {DispatchCallback} dispatch
 */
function startLoad(dispatch) {
  /**@type {HTMLInputElement} */
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch),
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}
/**
 * @param {?File} file
 * @param {DispatchCallback} dispatch
 */
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    });
  });
  reader.readAsDataURL(file);
}
/**
 * convert the image to Picture
 * @param {HTMLImageElement} image
 * @returns {Picture}
 */
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  /**@type {HTMLCanvasElement} */
  let canvas = elt("canvas", { width, height });
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let { data } = cx.getImageData(0, 0, width, height);
  /**
   * @param {Number} n
   * @returns {String}
   */
  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}
/** the undo button */
class UndoButton {
  /**
   * @param {State} state the state of the editor
   * @param {Config} param1
   */
  constructor(state, { dispatch }) {
    /**@type {HTMLButtonElement} */
    this.dom = elt(
      "button",
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length == 0,
      },
      "Undo"
    );
  }
  /**
   * @param {State} state the state of the editor
   */
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}

export { ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton };

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
 * @property {Array} done
 * @property {Number} doneAt
 */

/**
 * @typedef Config
 * @type {Object}
 * @property {Array.<Function>} tools a list of tools
 * @property {Array.<Object>} controls a list of controls
 * @property {Function} dispatch the dispatch funtion
 */
