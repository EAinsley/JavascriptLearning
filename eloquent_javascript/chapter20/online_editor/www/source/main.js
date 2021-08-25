window.addEventListener("load", main);

function main() {
  const url = "http://localhost:8000";
  const filepath = "/anotherfile.html";
  const iframe = document.querySelector("iframe");
  const textarea = document.querySelector("textarea");
  const save_button = document.querySelector("#save");
  console.log(textarea);
  iframe.src = "http://localhost:8000/files/anotherfile.html";
  iframe.title = "anotherfile";
  fetch(url + "/files" + filepath, {
    method: "GET",
  })
    .then((resp) => resp.text())
    .then((text) => {
      textarea.value = text;
    });
  save_button.addEventListener("click", savefile);
  fetch(url + "/source/main.js", {
    method: "GET",
  })
    .then((resp) => resp.text())
    .then((text) => console.log);
  function savefile() {
    const content = textarea.value;
    fetch(url + "/files" + filepath, {
      method: "PUT",
      body: content,
    });
    iframe.contentWindow.location.reload();
    console.log("saved!");
  }
}
