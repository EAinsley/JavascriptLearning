let map = {
    one: true,
    two: true,
    hasOwnProperty: true
    // 这似乎是个危险的写法，有没有更好的办法解决？
    // 避免使用方法名，加上用户前缀？比如 bOne，bTwo，bHasOwnProperty（b 是boolean的意思）
};

// Fix this call
// console.log(map.hasOwnProperty("one"));

console.log(Object.prototype.hasOwnProperty.call(map, "one"));
// → true