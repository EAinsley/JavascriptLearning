/**
 * handful tools
 * @module Utils
 */

/**
 * creat an DOM element based on the given type, properties and its children nodes
 * @param {String} type the type of the created DOM element
 * @param {Object} props the properties of the element
 * @param  {...(String|HTMLElement)} children the child nodes. If it's String, a text node will be created.
 * @returns {Node} the DOM node
 */
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

/**
 * draw the picture on the given canvas
 * @param {Picture} picture the picture
 * @param {HTMLCanvasElement} canvas the canvas node
 * @param {Number} scale the number of the real pixels one pixel equals to
 */
function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");
  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

export { elt, drawPicture };
