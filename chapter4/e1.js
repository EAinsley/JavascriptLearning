function range(start, end, step = 1) {
    if (((start > end) && step >= 0) || ((start < end) && step <= 0)) {
        return -1;
    }
    let index = [];
    for (let i = start; step > 0 ? (i <= end) : (i >= end); i += step) {
        index.push(i);
    }

    return index;
}

function sum(arr) {
    let ans = 0;
    for (let a of arr) {
        ans += a;
    }
    return ans;
}

console.log(range(1, 10));
console.log(range(1, 10, 2));
console.log(range(5, 2, -1));
console.log(sum(range(1, 10)));