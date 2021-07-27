function loop(value, testFunc, renewFunc, mainFunc) {
  while (testFunc(value)) {
    mainFunc(value);
    value = renewFunc(value);  // renewFunc(value)并不能直接更新value值……
  }
}

// test
loop(3, n => n > 0, n => n - 1, console.log)