function flatten(arr) {
  return arr.reduce((ans, current) => ans.concat(current), []);
}

// test

let testa = [[1], [2, 3], [4, 5, 6]];
console.log(flatten(testa));