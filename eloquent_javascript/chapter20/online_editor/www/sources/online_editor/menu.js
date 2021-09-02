import { Control, elt } from "./util.js";

class Menu extends Control {
  constructor(state, config) {
    super(state, config);
    this.dom = elt("menu", { id: "filelist" });
    this.newfile = elt(
      "button",
      {
        onclick: () => newFile(this),
      },
      "new file"
    );
    this.newdir = elt("button", { onclick: () => {} }, "new directory");
    this.deletedir = elt(
      "button",
      { onclick: () => newDir(this) },
      "delete directory"
    );

    refreshmenue(this.dom, config.baseurl, state.currentdir, this.dispatch);
  }
  syncState(state) {
    this.state = state;
  }
  executeCommand({ opendir = false, refreshdir = false }) {
    if (opendir || refreshdir)
      refreshmenue(
        this.dom,
        this.baseurl,
        this.state.currentdir,
        this.dispatch
      );
  }
}

function refreshmenue(dom, root, directory, dispatch) {
  fetch(root + directory, { method: "GET" })
    .then((resp) => {
      if (resp.ok) return resp.json();
    })
    .then((data) => {
      dom.appendChild(
        elt(
          "li",
          {
            ondblclick: () =>
              dispatch(
                { currentdir: getparentdir(directory) },
                { opendir: true }
              ),
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
              ondblclick: () =>
                dispatch(
                  { currentdir: directory + dirname },
                  { opendir: true }
                ),
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
              ondblclick: () =>
                dispatch(
                  { currentfile: directory + datum.name },
                  { openfile: true }
                ),
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
