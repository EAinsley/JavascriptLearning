function arrayToList(arr) {
    function addNode(now, end) {
        let index = arr[now];
        let next = null;
        if (now < end) {
            next = addNode(now + 1, end);
        }
        return {
            value: index,
            rest: next
        };
    };
    return addNode(0, arr.length - 1);
}

function listToArray(list) {
    let a = [];
    let tempList = list;
    while (tempList) {
        a.push(tempList.value);
        tempList = tempList.rest;
    }
    return a;
};

function prepend(element, list) {
    return {
        value: element,
        rest: list
    };
}

function nth(list, index, start = 0) {
    if (!list) return undefined;
    if (index == start) return list.value;
    return nth(list.rest, index, start + 1);
}

let a = [1, 2, 3, 4, 5];

let testList = arrayToList(a);
console.log("arrayToList:\n", JSON.stringify(testList));

let testArray = listToArray(testList);
console.log("listToarry:\n", JSON.stringify(testArray));

testList2 = prepend(0, testList);
console.log("prepend:\n", JSON.stringify(testList2));

console.log("nth(1):\n", JSON.stringify(nth(testList2, 3)));
console.log("nth(2):\n", nth(testList2, 10));