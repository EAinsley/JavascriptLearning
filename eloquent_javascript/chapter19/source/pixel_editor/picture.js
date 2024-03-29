/**
 * This module holds two calsses `Picture` and `PictureCanvas`,
 * `Picture` is used to store the data of the picture,
 * `PictureCanvas` is the canvas element to displayd the picture.
 * @module Picture
 */
import { elt, drawPicture } from "./utils.js";
/**
 * @constant {Number}
 * @default
 */
const scale = 10;

/** the data structure for the picture. */
class Picture {
  /**
   * @param {Number} width the width of the picture
   * @param {Number} height the height of the picture
   * @param {Array.<String>} pixels an array of the color of the pixels, the color code should be the hex code begin with `#`
   */
  constructor(width = 0, height = 0, pixels = []) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  /**
   * resize the picture and fill it with the given color
   * @param {Number} width the width of the new picture
   * @param {Number} height the height of the new picture
   * @param {String} color the background color of the new picture
   * @returns {Picture} new picture
   */
  static empty(width = 0, height = 0, color = "#ffffff") {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  /**
   * return the color code of the pixel
   * @param {Number} x the x position
   * @param {Number} y the y position
   * @returns {String} the color code
   */
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  /**
   * draw a bunch of pixels on the picture.
   * @param {Array.<{x: Number, y: Number, color: String}>} pixels an array of pixels to be drawn. the pixel should contain its postion and the color.
   * @returns {Picture} the updated picture
   */
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}
/** the class to maintain the canvas update to the picture */
class PictureCanvas {
  /**
   * @param {Picture} picture the picture
   * @param {Function} pointerDown a callback function to handle every mouse down and touch event on the canvas.
   */
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: (event) => this.mouse(event, pointerDown),
      ontouchstart: (event) => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }
  /**
   * draw the canvas based on the give picture
   * @param {Picture} picture the picture
   */
  syncState(picture) {
    if (this.picture == picture) return;
    drawPicture(picture, this.dom, scale, this.picture);
    this.picture = picture;
  }
  /**
   * add a mouse down event
   * @param {MouseEvent} downEvent the mouseEvent
   * @param {DispatchCallback} onDown the dispatch function called on mouse down, returns a move handler (if has).
   */
  mouse(downEvent, onDown) {
    if (downEvent.button != 0) return;
    let pos = pointerPosition(downEvent, this.dom);
    let onMove = onDown(pos);
    if (!onMove) return;
    let move = (moveEvent) => {
      if (moveEvent.buttons == 0) {
        this.dom.removeEventListener("mousemove", move);
      } else {
        let newPos = pointerPosition(moveEvent, this.dom);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.dom.addEventListener("mousemove", move);
  }
  /**
   * add a touch event
   * @param {TouchEvent} startEvent the touchEvent
   * @param {DispatchCallback} onDown the dispatch function called on touch start, returns a move handler (if has).
   */
  touch(startEvent, onDown) {
    let pos = pointerPosition(startEvent.touches[0], this.dom);
    let onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    let move = (moveEvent) => {
      let newPos = pointerPosition(moveEvent.touches[0], this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    };
    let end = () => {
      this.dom.removeEventListener("touchmove", move);
      this.dom.removeEventListener("touchend", end);
    };
    this.dom.addEventListener("touchmove", move);
    this.dom.addEventListener("touchend", end);
  }
}

/**
 * convert the position on the page to the positon on the picture
 * @param {MouseEvent} pos the mouseEvent used to get the mouse position
 * @param {HTMLCanvasElement} domNode the canvas node
 * @returns {{x:Number, y:Number}} the relative postion of the pointer
 */
function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.max(Math.floor((pos.clientX - rect.left) / scale), 0),
    y: Math.max(Math.floor((pos.clientY - rect.top) / scale), 0),
  };
}

export { Picture, PictureCanvas };

/**
 * @callback DispatchCallback
 * @param {{x:Number, y:Number}}
 * @returns {?DispatchCallback}
 */
