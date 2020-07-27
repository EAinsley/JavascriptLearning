function reverseArray(arr) {
    let temparr = [];
    for (let i = 0; i < arr.length; i++) {
        temparr.unshift(arr[i]);
    }
    return temparr;
}

function reverseArrayInPlace(arr) {
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
        let temp = arr[i];
        arr[i] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
    return arr;
}

let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

console.time("复制计时");
console.log(reverseArray(a));
console.timeEnd("复制计时");
console.log(a);

console.time("替换计时")
console.log(reverseArrayInPlace(a));
console.timeEnd("替换计时");
console.log(a);

// 个人觉得第二种函数更有用一点。测试表明第二个也更快一点。