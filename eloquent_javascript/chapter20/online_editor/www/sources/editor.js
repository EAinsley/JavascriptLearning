class Editor {
  constructor(state, config) {
    this.state = state;
    this.config = config;
    this.textarea = elt("textarea");
    this.iframe = elt("iframe", { frameborder: 1 });
    const savebutton = elt(
      "button",
      { onclick: () => this.savefile() },
      "save"
    );
    this.button_group = elt("div", { id: "button_group" }, savebutton);
    this.filelist = elt("menu", { id: "filelist" });
    this.dom = elt(
      "div",
      { id: "container" },
      elt("aside", { id: "sidebar" }, this.button_group, this.filelist),
      elt("main", { id: "editor" }, this.textarea, this.iframe)
    );
    this.refreshmenue("/");
  }
  refreshmenue(currentdir) {
    fetch(this.config.baseurl + currentdir, { method: "GET" })
      .then((resp) => resp.json())
      .then((data) => {
        const parentdir =
          currentdir.slice(
            0,
            currentdir.slice(0, currentdir.length - 1).lastIndexOf("/")
          ) + "/";
        this.filelist.appendChild(
          elt(
            "li",
            {
              ondblclick: () => this.refreshmenue(parentdir),
            },
            ".."
          )
        );
        for (const datum of data) {
          if (datum.isDir) {
            this.filelist.appendChild(
              elt(
                "li",
                {
                  ondblclick: () =>
                    this.refreshmenue(currentdir + datum.name + "/"),
                },
                datum.name + "/"
              )
            );
          }
        }
        for (const datum of data) {
          if (!datum.isDir) {
            this.filelist.appendChild(
              elt(
                "li",
                {
                  ondblclick: () => this.openfile(currentdir + datum.name),
                },
                datum.name
              )
            );
          }
        }
      });
    while (this.filelist.firstChild) this.filelist.lastChild.remove();
  }
  openfile(filepath) {
    this.state.currentfile = filepath;
    this.iframe.src = this.config.baseurl + filepath;
    fetch(this.config.baseurl + filepath, {
      method: "GET",
    })
      .then((resp) => resp.text())
      .then((text) => {
        this.textarea.value = text;
      });
  }
  savefile() {
    const content = this.textarea.value;
    fetch(this.config.baseurl + this.state.currentfile, {
      method: "PUT",
      body: content,
    });
    this.iframe.contentWindow.location.reload();
    console.log("saved!");
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
export { Editor };
