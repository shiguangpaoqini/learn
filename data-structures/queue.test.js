/**
 * 队列遵循「先进先出（First In, First Out. FIFO）」的规则
 */

export class Queue {
  constructor() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
  }

  size() {
    return this._newestIndex - this._oldestIndex
  }

  enqueue(data) {
    this._storage[this._newestIndex] = data
    this._newestIndex ++
  }

  unqueue() {
    const oldestIndex = this._oldestIndex;
    const newestIndex = this._newestIndex;
    let deletedData
    if(newestIndex !== oldestIndex) {
      deletedData = this._storage[oldestIndex]
      delete this._storage[oldestIndex]
      this._oldestIndex ++
    }
    
    return deletedData
  }
}

test('Queue', ()=>{
  const queue = new Queue()
  queue.enqueue(1)
  queue.enqueue(2)
  expect(queue._storage).toEqual({1: 1, 2: 2})
  queue.unqueue()
  expect(queue._storage).toEqual({2: 2})
})