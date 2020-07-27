# 数据结构对象和数组
* 除了null 和 undefined 以外，所有的JS值都可以有属性，如 myString.length和Math.max。
* 保存了函数的属性被称为方法。
* 字符串的属性和方法:
    * ```.length``` 返回字符串长度。
    * ```.toUpperCase()``` 字符串变成全大写。
    * ```.toLowerCase()``` 字符串变成全小写。
    * ```.slice(start, end)``` 去除索引在[start, end)外的字符，end省略默认到字符串末尾。
    * ```.indexOf(str, pos)``` 从指定位置（默认为开头）向后查找字符或字符串。
    * ```.padStart(length, ch)``` 把字符扩充到最小length长度，用ch填充。
    * ```.split(ch)``` 以ch为界限把字符串拆分成数组。
    * ```.repeat(times)``` 把字符串用重复的方式扩展times倍。  
* 数组的属性和方法：
    * ```.push(value)``` 在数组末尾添加元素。
    * ```.pop()``` 从数组末尾删去元素，并返回元素值。
    * ```.unshift(value)``` 在数组开头添加元素。
    * ```.shift()``` 从数组开头删去元素，并返回元素值。
    * ```.indexOf(val, pos)``` 从指定位置（默认为开头）向后开始搜索特定元素值，返回找到的第一个元素的索引。
    * ```.lastIndexOf(val, pos)``` 从指定位置（默认为末尾）向前开始搜索特定元素值，返回找到的第一个元素的索引。
    * ```.slice(start, end)``` 去除索引在[start, end)之外的元素，end省略默认到数组末尾。
    * ```.concat(arr)``` 和另外一个数组拼接在一起。

* 通过```myObject = { element1: value1, element2: value2}; ```的方式创建对象。方括号称为属性列表。
* 在函数参数表中添加```...args```创建可以接受多个参数的情况。
* 可以用方括号结构数组，用花括号结构对象。
