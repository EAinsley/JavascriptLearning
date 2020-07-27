# 值、类型和运算符

* js的数据范围一般在64位左右。
* 小数运算不一定精确。
    ```
    (0.1 + 0.2 == 0.3) // -> false
    ```    
* 三个特殊数字：Infinity, -Infinity, NaN
* 字符串用""（双引号）或 ''（单引号） 都可以， 用\`${ some calculation }\`（！这里是反引号）可以做运算，并且还可以不用转义字符就包括换行符。
* NaN不等于自己, null 和 undefined大部分情况相同，但本质还是不同。
    ```
    (NaN == NaN) // -> false
    (null == undefined) // -> true
    (null === undefined) // -> false
    ```