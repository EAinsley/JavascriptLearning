window.addEventListener("load", main);

function main() {
  const baseurl = "http://localhost:8000";
  const fileapi = "/files";
  const filepath = "/anotherfile.html";
  const textarea = document.querySelector("textarea");
  const save_button = document.querySelector("#save_button");
  const menu = document.querySelector("menu");
  const iframe = document.querySelector("iframe");
  refreshmenu("/");
  save_button.addEventListener("click", savefile);

  function savefile() {
    const content = textarea.value;
    fetch(baseurl + fileapi + filepath, {
      method: "PUT",
      body: content,
    });
    iframe.contentWindow.location.reload();
    console.log("saved!");
  }
  /**
   *
   * @param {HTMLMenuElement} menu
   * @param {String} directory
   */
  function refreshmenu(directory) {
    fetch(baseurl + fileapi + directory, { method: "GET" })
      .then((resp) => resp.json())
      .then((data) => {
        const cd = () =>
          refreshmenu(
            directory.slice(
              0,
              directory.slice(0, directory.length - 1).lastIndexOf("/")
            ) + "/"
          );
        menu.appendChild(elt("li", { ondblclick: cd }, ".."));
        for (const datum of data) {
          const opendir = () => refreshmenu(directory + datum.name + "/");
          if (datum.isDir) {
            menu.appendChild(
              elt("li", { ondblclick: opendir }, datum.name + "/")
            );
          }
        }
        for (const datum of data) {
          if (!datum.isDir) {
            const loadfile = () => {
              openfile(directory + datum.name);
            };
            menu.appendChild(elt("li", { ondblclick: loadfile }, datum.name));
          }
        }
      });
    while (menu.firstChild) menu.lastChild.remove();
  }
  function openfile(filepath) {
    iframe.src = baseurl + fileapi + filepath;
    fetch(baseurl + fileapi + filepath, {
      method: "GET",
    })
      .then((resp) => resp.text())
      .then((text) => {
        textarea.value = text;
      });
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
