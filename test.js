let button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("click 1");
  setTimeout(() => {
    console.log("timeout 1");
  });
  new Promise((resolve) => {
    console.log("promise 1 create");
    resolve(null);
  }).then(() => {
    console.log("promise 1 fullfilled");
  });
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
