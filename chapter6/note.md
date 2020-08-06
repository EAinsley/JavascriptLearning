# 对象的秘密

* 面向对象编程的核心思想是将程序划分为更小的部分，并使每个部分管理自己的状态。
* 将接口与实现分离称为封装。
* this绑定指向调用方法的对象，通过call可以显式地传递this。
* Object.getPrototypeOf 返回一个对象的原型。
* 空对象的原型是Object.prototyep, 函数的原型为Function.prototype, 数组的原型为Array.prototype。其中，Function.prototype 和 Array.prototype 的原型为 Object.prototype。
* 使用Object.creat(prototype)从一个原型中创建对象。
* 把new放在函数前面，则此函数成为构造函数，以函数的原型为对象的原型初始化对象。
* 用class创建类，通过constructor()定义构造函数，class创建的类可以包含一组方法，但不能包含值。可以把class直接放入语句中使用，次是可以省略class名。
* 将null传给Object.create() 来创建没有原型的对象。
* Symbol() 生成一个全局唯一值，Symbol的字符串名称和值没有关系，只是注释。
* 使用get来编写获取计算值的函数，用set编写设置数值的函数，用static可以将另外的函数附加到构建函数中。
* 用extends来说明类基于哪个原型
* 不要过多的使用类继承，因为会导致更高的耦合。
* instanceof 运算符可以告诉你一个对象是否是另一个构造函数的实例。