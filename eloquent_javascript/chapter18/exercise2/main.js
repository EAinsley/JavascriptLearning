window.addEventListener("load", () => {
  const code = document.querySelector("#code");
  const button = document.querySelector("button");
  const output = document.querySelector("#output");
  const checkbox = document.querySelector("#log_flag");
  let log_times = 0;
  function runcode() {
    const code_text = code.value;
    if (checkbox.checked) {
      output.appendChild(
        document.createTextNode("Output[" + ++log_times + "]:")
      );
      output.appendChild(document.createElement("br"));
      try {
        const func = Function(code_text);
        output.appendChild(document.createTextNode(func()));
      } catch (error) {
        output.appendChild(document.createTextNode(error));
      }
      output.appendChild(document.createElement("br"));
    } else {
      try {
        const func = Function(code_text);
        output.textContent = func();
      } catch (error) {
        output.textContent = error;
      }
    }
  }
  button.addEventListener("click", runcode);
  checkbox.addEventListener("change", () => {
    while (output.firstChild) {
      output.removeChild(output.firstChild);
    }
    log_times = 0;
  });
  code.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key == "Enter") {
      runcode();
      event.preventDefault();
    }
  });
});
