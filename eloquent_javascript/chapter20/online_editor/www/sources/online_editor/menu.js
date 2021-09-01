import { Control, elt } from "./util.js";

class Menu extends Control {
  constructor(state, config) {
    super(state, config);
    this.dom = elt("menu", { id: "filelist" });
    this.newfile = elt("button", {}, "new file");
    this.newdir = elt("button", {}, "new directory");
    this.deletedir = elt("button", {}, "delete directory");
    this.tools = [this.newfile, this.newdir, this.deletedir];
    refreshmenue(this.dom, config.baseurl, state.currentdir, this.dispatch);
  }
  syncState(state) {
    this.state = state;
    refreshmenue(
      this.dom,
      this.config.baseurl,
      this.state.currentdir,
      this.dispatch
    );
  }
}

function refreshmenue(dom, root, directory, dispatch) {
  fetch(root + directory, { method: "GET" })
    .then((resp) => {
      if (resp.ok) return resp.json();
      console.log(resp.json());
    })
    .then((data) => {
      dom.appendChild(
        elt(
          "li",
          {
            ondblclick: () => dispatch({ currentdir: getparentdir(directory) }),
          },
          ".."
        )
      );
      for (const datum of data) {
        if (datum.isDir) {
          const dirname = datum.name + "/";
          const item = elt(
            "li",
            {
              ondblclick: () => dispatch({ currentdir: directory + dirname }),
            },
            dirname
          );
          dom.appendChild(item);
        }
      }
      for (const datum of data) {
        if (!datum.isDir) {
          const item = elt(
            "li",
            {
              ondblclick: () => dispatch({ currentfile: datum.name }),
            },
            datum.name
          );
          dom.appendChild(item);
        }
      }
    });
  while (dom.firstChild) dom.lastChild.remove();
}
function getparentdir(directory) {
  return (
    directory.slice(
      0,
      directory.slice(0, directory.length - 1).lastIndexOf("/")
    ) + "/"
  );
}
export { Menu };
