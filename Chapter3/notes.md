# 函数
* 三种定义函数的方式：
    ```
    const f = function(a, b){
        return a + b;
    }

    function g(a, b){
        console.log(a + b);
    }

    let h = (a, b) => a + b;
    ```
    其中f和h是纯函数，只返回值而没有副作用。g有副作用，同时返回undefined。

* 闭包是指引用封闭作用域中局部绑定的特定实例的功能（不是人话），通常来讲一个函数就是一个闭包，有局部变量并且保留了状态，指在函数不在活动状态时，原有的局部绑定仍然保留。
    有一些神奇的特质：
    ```
    function add(x){
        return function(y){
            return x + y;
        }
    }

    let inc = add(1);
    console.log(inc(2)); // -> 3

    ```
    在这个样例中，其实```let inc = add(1); ```被解释成：```let inc = function(y){ 1 + y };``` 

* 先写一些正确且易于理解的东西，之后再进行优化。感觉在其他地方看到过类似的观点，Paul Graham也表示做一个项目要先快速写个原型出来，然后根据用户反馈进行修改。避免过早设计。

* 用let来代替var，可以理解成var是声明一种全局变量，作用域是从声明开始到函数结束，let声明的作用域是从声明开始到块结束。