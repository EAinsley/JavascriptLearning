
function range(start, end, step = start < end ? 1 : -1) {
  let li = [];
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    li.push(i);
  }
  return li;
}

function sum(arr) {
  let ans = 0;
  for (let a of arr) {
    ans += a;
  }
  return ans;
}

// test
console.log(range(1, 10));
console.log(range(1, 10, 2));
console.log(range(5, 2, -1));
console.log(sum(range(1, 10)));