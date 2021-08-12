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

export { elt };
