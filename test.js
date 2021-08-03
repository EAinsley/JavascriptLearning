let button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("click 1");
  setTimeout(() => {
    console.log("timeout 1");
  });
  new Promise((resolve) => {
    console.log("promise 1 create");
    throw Error("?");
    resolve(null);
  })
    .then(() => {
      console.log("promise 1 fullfilled");
    })
    .catch(() => {
      console.log("promise 1 catched");
    });
  async function hello() {
    return (greeting = await Promise.resolve("Hello"));
  }

  hello().then(console.log);
});

button.addEventListener("click", () => {
  console.log("click 2");
  setTimeout(() => {
    console.log("timeout 2");
  });
  new Promise((resolve) => {
    console.log("promise 2 create");
    resolve(null);
  }).then(() => {
    console.log("promise 2 fullfilled");
  });
});
console.log("---call by funciton---");
button.click();
