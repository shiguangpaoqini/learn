/**
 * 如同数组一样，链表也是按照顺序存储数据元素，但却不是通过维护索引实现，链表是通过指向其他节点的指针实现。
 * Redux与Express等中间件都以链表的形式实现
 */
class Node {
  constructor(value) {
    this.value = value
    this.next = null
    this.prev = null
  }
}

class SinglyList {
  constructor() {
    this.head = null
    this._length = 0
  }

  add(value) {
    const node = new Node(value)
    let currentNode = this.head
    if(!currentNode) {
      this.head = node
      this._length++
      return node
    }
    while(currentNode.next) {
      currentNode = currentNode.next
    }
    currentNode.next = node
    this._length++
    return node
  }

  remove(position) {
    let currentNode = this.head
    let deletedNode
    const length = this._length
    const message = {failure: 'Failure: non-existent node in this list.'}
    if(position < 1 || position > length) {
        throw new Error(message.failure)
    }
    if(position === 1) {
      this.head = currentNode.next
      deletedNode = currentNode
      currentNode = null
      this._length--
      return deletedNode
    }
    for (let i = 1; i < position - 1; i++) {
      currentNode = currentNode.next
    }
    deletedNode = currentNode.next
    currentNode.next = currentNode.next.next
    this._length--
    return deletedNode
  }

  searchNodeAt(position) {
    let currentNode = this.head
    const length = this._length
    const message = {failure: 'Failure: non-existent node in this list.'}
    if(position < 1 || position > length) {
        throw new Error(message.failure)
    }
    for(let i = 1; i < position; i++) {
        currentNode = currentNode.next
    }

    return currentNode
  }
}

class DoublyList {
  constructor(){
    this.head = null
    this.tail = null
    this._length = 0
  }

  add(value){
    const node = new Node(value)
    if(!this._length) {
      this.head = node
      this.tail = node
      this._length ++

      return node
    }
    this.tail.next = node
    node.prev = this.tail
    this.tail = node
    this._length++;

    return node
  }

  remove(position){
    let currentNode = this.head
    let deletedNode
    const length = this._length
    const message = {failure: 'Failure: non-existent node in this list.'}
    if(position < 1 || position > length) {
        throw new Error(message.failure)
    }
    if(position === 1) {
      this.head = currentNode.next
      if(this._length === 1) {
        this.tail = null
      } else {
        this.head.prev = null
      }
      deletedNode = currentNode
      currentNode = null
    } else if(position === this._length) {
      deletedNode = this.tail
      this.tail = this.tail.prev
      this.tail.next = null
    } else {
      for (let i = 1; i < position - 1; i++) {
        currentNode = currentNode.next
      }
      deletedNode = currentNode.next
      currentNode.next = currentNode.next.next
      currentNode.next.next.prev = currentNode
    }
    
    this._length--
    return deletedNode
  }

  searchNodeAt(position){
    let currentNode = this.head
    const length = this._length
    const message = {failure: 'Failure: non-existent node in this list.'}
    if(position < 1 || position > length) {
        throw new Error(message.failure)
    }
    for(let i = 1; i < position; i++) {
        currentNode = currentNode.next
    }

    return currentNode
  }
}

test('LinkList', ()=>{
  const singlylist = new SinglyList()
  singlylist.add(1)
  singlylist.add(2)
  singlylist.add(3)
  expect(singlylist.searchNodeAt(1).value).toEqual(1)
  singlylist.remove(1)
  expect(singlylist.searchNodeAt(1).value).toEqual(2)
  singlylist.remove(2)
  expect(singlylist.searchNodeAt(1).value).toEqual(2)

  const doublylist = new DoublyList()
  doublylist.add(1)
  doublylist.add(2)
  doublylist.add(3)
  expect(doublylist.searchNodeAt(1).value).toEqual(1)
  doublylist.remove(1)
  expect(doublylist.searchNodeAt(1).value).toEqual(2)
  doublylist.remove(2)
  expect(doublylist.searchNodeAt(1).value).toEqual(2)
  expect(doublylist.searchNodeAt(1).prev).toEqual(null)
  expect(doublylist.searchNodeAt(1).next).toEqual(null)
})
