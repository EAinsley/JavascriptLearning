function arrayToList(arr) {
  let list = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    list = {value: arr[i], rest: list};
  }
  return list;
}

function listToArray(list) {
  let a = [];
  while (list) {
    a.push(list.value);
    list = list.rest;
  }
  return a;
};

function prepend(value, list) {
  return {value, rest: list};
}

function nth(list, index) {
  if (!list) return undefined;
  if (index == 0) return list.value;
  return nth(list.rest, index - 1);
}

// test
let a = [1, 2, 3, 4, 5];

let testList = arrayToList(a);
console.log('arrayToList:\n', JSON.stringify(testList));

let testArray = listToArray(testList);
console.log('listToarry:\n', JSON.stringify(testArray));

testList2 = prepend(0, testList);
console.log('prepend:\n', JSON.stringify(testList2));

console.log('nth(1):\n', JSON.stringify(nth(testList2, 3)));
console.log('nth(2):\n', nth(testList2, 10));