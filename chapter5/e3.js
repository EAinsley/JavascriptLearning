function everyVLoop(arr, test) {
    for (a of arr) {
        if (!test(a))
            return false;
    }
    return true;
}

function everyVSome(arr, test) {
    return !arr.some(ans => !test(ans));
}

// test

// loop version
console.log("loop:");
console.log(everyVLoop([1, 3, 5], n => n < 10));
console.log(everyVLoop([2, 4, 16], n => n < 10));
console.log(everyVLoop([], n => n < 10));

console.log();

// some version
console.log("some:");
console.log(everyVSome([1, 3, 5], n => n < 10));
console.log(everyVSome([2, 4, 16], n => n < 10));
console.log(everyVSome([], n => n < 10));