let isDone: boolean = false;

let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;

let fibonacci : number[] = [1, 1, 2, 3, 5];

let sum = function (x: number, y: number) : number {
  let args: IArguments = arguments
  console.log(args)
  return x + y
}

// console.log(sum(1, 2))

function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

// 类型别名
type Name = string;
type NameResolve = () => string;
type NameOrResolver = Name | NameResolve;


// Tuple 元组 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
let Tuple: [string, number] = ['1', 1]
// 元组越界时，其类型会被限制为元组中每个类型的联合类型
Tuple.push(1)
// Tuple.push(false)

enum Color { Red, Bule, Yellow = 'yellow'.length }

// enum _color { Red, Bule = 'bule'.length, Yellow }


abstract class Person {
  public readonly name;
  private age;
  protected constructor(name) {
    this.name = name
    this.age = 21
  }

  public getAge(){
    return this.age
  }

  abstract sayHi()
}

class Jack extends Person{
  constructor(name){
    super(name)
  }

  sayHi(){
    return `${this.name},Hi!`
  }
}

let a = new Jack('jack')
console.log(a.name)
// a.name = 'tom'
console.log(a.getAge())
console.log(a.sayHi())

interface Action {
  move();
}

class Ball {}

class basketBall extends Ball implements Action{
  move() {
    return 'move!'
  }
}

class phone implements Action{
  move() {
    return 'evom!'
  }
}

function swap<T, U>(tuple: [T, U]): [U, T]{
  return [tuple[1], tuple[0]]
}

console.log(swap([7, 'seven']))