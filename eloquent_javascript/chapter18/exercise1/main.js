const fetchtypes = [
  "text/plain",
  "text/html",
  "application/json",
  "application/rainbows+unicorns",
];
const url = "https://eloquentjavascript.net/author";

for (let type of fetchtypes) {
  fetch(url, {
    headers: {
      Accept: type,
    },
  })
    .then((resp) => {
      console.log("Fetching", type);
      console.log("the server returned:", resp.status, resp.statusText);
      if (!resp.ok) throw Error("the server doesn't return ok");
      else return resp.text();
    })
    .then((text) => {
      console.log("content-type:", type);
      console.log("content:\n", text);
    })
    .catch(console.log);
}
