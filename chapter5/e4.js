const SCRIPTS = require("./05_higher_order/code/scripts");

require("./05_higher_order/code/load")("code/scripts.js", "code/chapter/05_higher_order.js", "code/intro.js");

function dominantDirection(text) {
    let counted = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.direction : "null";
    }).filter(n => n.name != "null");
    if (counted.length == 0) return "ltr";
    // 要判断length长度，以防reduce空数组。不能用counted == [] 判断，
    // 因为 [] == [] -> false。（confusing js）
    return counted.reduce((a, b) => a.count > b.count ? a : b).name;
    // name 加在最后，因为如果数组数不足两个的话，并不会调用reduce。
}

// test
console.log(dominantDirection("!"));
console.log(dominantDirection("Hello!"));
console.log(dominantDirection("Hey, مساء الخير"));