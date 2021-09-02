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
    this.tools = [
      {
        tool: this.newfile,
        hotkey: { metaKey: true, ctrlKey: true, key: "b" },
      },
      {
        tool: this.newdir,
        hotkey: { metaKey: true, ctrlKey: true, shifKey: true, key: "b" },
      },
      {
        tool: this.deletedir,
        hotkey: { metaKey: true, ctrlKey: true, shifKey: true },
        key: "d",
      },
    ];
    refreshmenue(this.dom, config.baseurl, state.currentdir, this.dispatch);
  }
  syncState(state, { opendir = false, refreshdir = false }) {
    this.state = state;
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
                dispatch({ currentfile: datum.name }, { openfile: true }),
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

function newFile(that) {
  const filename = prompt("Enter file name?");
  if (filename === null) return;
  const fileurl = that.baseurl + that.state.currentdir + filename;
  fetch(fileurl, { method: "PUT" }).then((resp) => {
    if (resp.ok) {
      that.dispatch(
        { currentfile: filename },
        { openfile: true, refreshdir: true }
      );
      return;
    }
    console.log(resp);
  });
}

function newDir(that) {
  const dirname = prompt("Enter directory name?");
  if (dirname === null) return;
  const dirurl = that.baseurl + that.state.dirname;
  fetch(dirurl, { method: "MKCOL" }).then((resp) => {
    if (resp.ok) {
      that.dispatch({}, { refreshdir: true });
    }
  });
}
export { Menu };
