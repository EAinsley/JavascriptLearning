class Control {
  constructor(state, config) {
    this.state = state;
    this.baseurl = config.baseurl;
    this.dispatch = config.dispatch;
  }
  syncState(state) {
    this.state = state;
  }
  executeCommand() {}
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

function getparentdir(directory) {
  return (
    directory.slice(
      0,
      directory.slice(0, directory.length - 1).lastIndexOf("/")
    ) + "/"
  );
}
export { elt, getparentdir, Control };
