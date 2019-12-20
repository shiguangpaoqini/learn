/**
 *  栈遵循「后进先出（Last In, First Out. LIFO）」的规则。
 *  （不使用数组来构造是因为默认_storage的存储是无序的）
 */

class Stack {
  constructor() {
    this._size = 0;
    this._storage = {};
  }

  push(data) {
    const size = ++this._size
    this._storage[size] = data
  }

  pop() {
    let size = this._size
    let deletedData
    if(size) {
      deletedData = this._storage[size]
      delete this._storage[size]
      this._size --

      return deletedData
    }
  }
}

test('Stack', ()=>{
  const stack = new Stack()
  stack.push(1)
  stack.push(2)
  expect(stack._storage).toEqual({1: 1, 2: 2})
  stack.pop()
  expect(stack._storage).toEqual({1: 1})
})