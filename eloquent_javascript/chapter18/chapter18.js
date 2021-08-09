function BrowsersAndHTTP() {
  console.log("---Browsers and HTTP---");
  console.log(encodeURIComponent("Yes?"));
  console.log(decodeURIComponent("Yes%3F"));
}

async function asyncFetch() {
  console.log("---async Fetch---");
  let data = await fetch("./example/data.txt");
  console.log(data.status);
  console.log(data.headers.get("Content-Type"));
  let text = await data.text();
  console.log(text);
}

function promiseFetch() {
  console.log("---promise Fetch---");
  return fetch("./example/data.txt")
    .then((response) => {
      console.log(response.status);
      console.log(response.headers.get("Content-Type"));
      return response.text();
    })
    .then(console.log);
}

function promiseDeleteFetch() {
  console.log("---promise delete---");
  return fetch("./example/data.txt", { method: "DELETE" }).then((resp) => {
    console.log(resp.status);
  });
}

function promiseHeaderFetch() {
  console.log("---promise add header---");
  return fetch("./example/data.txt", { headers: { Range: "bytes=8-19" } })
    .then((resp) => resp.text())
    .then(console.log);
}

function focusAndBlur() {
  console.log("---focus and blur---");
  document.querySelector("#Focus input").focus();
  console.log(document.activeElement.tagName);
  document.querySelector("#Focus input").blur();
  console.log(document.activeElement.tagName);
  console.log("---focus and blur end---");
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", () => {
      reject(reader.error);
    });
    reader.readAsText(file);
  });
}

function localstore() {
  localStorage.setItem("username", "ains");
  console.log(localStorage.getItem("username"));
  localStorage.removeItem("username");
}
function storingDataClientside() {
  let list = document.querySelector("#storingDataClientside select");
  let note = document.querySelector("#storingDataClientside textarea");
  let state;
  function setState(newState) {
    list.textContent = "";
    for (let name of Object.keys(newState.notes)) {
      let option = document.createElement("option");
      option.textContent = name;
      if (newState.selected == name) option.selected = true;
      list.appendChild(option);
    }
    note.value = newState.notes[newState.selected];
    localStorage.setItem("note", JSON.stringify(newState));
    state = newState;
  }
  setState(
    JSON.parse(localStorage.getItem("Notes")) || {
      notes: { "shopping list": "Carrotes\nRaisins" },
      selected: "shopping list",
    }
  );
  list.addEventListener("change", () => {
    setState({ notes: state.notes, selected: list.value });
  });
  note.addEventListener("change", () => {
    setState({
      notes: Object.assign({}, state.notes, {
        [state.selected]: note.value,
      }),
      selected: state.selected,
    });
  });
  document.querySelector("#addnote").addEventListener("click", () => {
    let name = prompt("Note name");
    if (name) {
      setState({
        notes: Object.assign({}, state.notes, { [name]: "" }),
        selected: name,
      });
    }
  });
}
