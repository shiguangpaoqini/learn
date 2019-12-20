var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var isDone = false;
var decLiteral = 6;
var hexLiteral = 0xf00d;
// ES6 中的二进制表示法
var binaryLiteral = 10;
// ES6 中的八进制表示法
var octalLiteral = 484;
var notANumber = NaN;
var infinityNumber = Infinity;
var fibonacci = [1, 1, 2, 3, 5];
var sum = function (x, y) {
    var args = arguments;
    console.log(args);
    return x + y;
};
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
// Tuple 元组 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
var Tuple = ['1', 1];
// 元组越界时，其类型会被限制为元组中每个类型的联合类型
Tuple.push(1);
// Tuple.push(false)
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Bule"] = 1] = "Bule";
    Color[Color["Yellow"] = 'yellow'.length] = "Yellow";
})(Color || (Color = {}));
// enum _color { Red, Bule = 'bule'.length, Yellow }
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
        this.age = 21;
    }
    Person.prototype.getAge = function () {
        return this.age;
    };
    return Person;
}());
var Jack = /** @class */ (function (_super) {
    __extends(Jack, _super);
    function Jack(name) {
        return _super.call(this, name) || this;
    }
    Jack.prototype.sayHi = function () {
        console.log(this.name, 'hi');
    };
    return Jack;
}(Person));
var a = new Jack('jack');
console.log(a.name);
// a.name = 'tom'
console.log(a.getAge());
console.log(a.sayHi());
