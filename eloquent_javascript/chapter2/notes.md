# 程序结构
* 控制语句和c++基本一样。
* 可以用 ```for (let a of array)``` 来遍历数组。
* 使用 let 而非 var 声明变量。
* 绑定其实是绑定地址：
    ```
    let object1 = {value: 10};
    let object2 = object1;
    let objuect3 = {value:10};

    console.log(object1 == object2); // -> true
    console.log(object1 == object3; // -> false

    object1.value = 15;
    console.log(object2.value); // -> 15;
    ```
    关于对象的问题参考Chapter4