class Control {
  constructor(state, config) {
    this.state = state;
    this.config = config;
    this.dispatch = config.dispatch;
  }
  syncState(state) {
    this.state = state;
  }
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
export { elt, Control };
