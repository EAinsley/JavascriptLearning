/**
 * holds several useful drawing tools
 * @module ToolPack
 */
import { Picture } from "./picture.js";
/**
 * @constant
 */
const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

/**
 * draw one pixel on the picture
 * @param {{x: Number, y: Number}} pos the postion
 * @param {State} state the state of the pixel editor
 * @param {DispatchCallback} dispatch the dispatch function
 * @returns {DispatchCallback}
 */
function draw(pos, state, dispatch) {
  function drawPixel({ x, y }, state) {
    let drawn = { x, y, color: state.color };
    dispatch({ picture: state.picture.draw([drawn]) });
  }
  drawPixel(pos, state);
  return drawPixel;
}

/**
 * draw a rectangle on the picture
 * @param {{x: Number, y: Number}} start the start position
 * @param {State} state the state of the editor
 * @param {DispatchCallback} dispatch the dispatch function
 * @returns {DispatchCallback}
 */
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}
/**
 * draw a circle
 * @param {{x:Number, y:Number}} start the start position
 * @param {State} state the state of the editor
 * @param {DispatchCallback} dispatch the dispatch fucntion
 * @return {DispatchCallback}
 */
function circle(center, state, dispatch) {
  function drawCircle(end) {
    let radius = Math.sqrt(
      Math.pow(center.x - end.x, 2) + Math.pow(center.y - end.y, 2)
    );
    let drawn = [];
    for (let dy = -Math.floor(radius); dy <= Math.floor(radius); dy++) {
      for (let dx = -Math.floor(radius); dx <= Math.floor(radius); dx++) {
        if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) > radius) continue;
        let x = center.x + dx;
        let y = center.y + dy;
        if (
          x >= state.picture.width ||
          x < 0 ||
          y >= state.picture.height ||
          y < 0
        )
          continue;
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawCircle(center);
  return drawCircle;
}

/**
 * to fill the area of the same color
 * @param {{x: Number, y: Number}} param0 the position
 * @param {State} state the state of the editor
 * @param {DispatchCallback} dispatch  the dispatch callback
 */
function fill({ x, y }, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{ x, y, color: state.color }];
  for (let done = 0; done < drawn.length; done++) {
    for (let { dx, dy } of around) {
      let x = drawn[done].x + dx;
      let y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) == targetColor &&
        !drawn.some((p) => p.x == x && p.y == y)
      ) {
        drawn.push({ x, y, color: state.color });
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

/**
 * to pick the color of one pixel
 * @param {{x: Number, y:Number}} pos the postion
 * @param {State} state the state of the editor
 * @param {DispatchCallback} dispatch the dispatch function
 */
function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

export { draw, rectangle, fill, pick, circle };

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
