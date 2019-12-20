/**
 * 在计算机科学中，树是一种用节点来模拟分层数据的数据结构。每个树节点都包含他本身的数据及指向其他节点的指针。
 */
import { Queue } from './queue.test'

class Node {
  constructor(data) {
    this.data = data
    this.parent = null
    this.children = []
  }
}

class Tree {
  constructor(data) {
    const node = new Node(data);
    this._root = node
  }

  // 深度优先遍历
  traverseDF(callback) {
    (function recurse(currentNode) {
      currentNode.children.map(node => {
        recurse(node)
      })
      callback(currentNode)
    })(this._root)
  }

  // 广度优先遍历
  traverseBF(callback) {
    const queue = new Queue()
    let currentTree

    currentTree = this._root

    while (currentTree) {
      currentTree.children.map(node => {
        queue.enqueue(node)
      })
      callback(currentTree)
      currentTree = queue.unqueue();
    }
  }

  contains(callback, traversal) {
    traversal.call(this, callback);
  }

  add(data, toData, traversal) {
    let parent = null
    const child = new Node(data)
    const callback = (node)=>{
      if( node.data === toData){
        parent = node
      }
    }

    this.contains(callback, traversal)

    if(!!parent){
      parent.children.push(child)
      child.parent = parent
    } else {
      throw new Error('Cannot add node to a non-existent parent.')
    }
  }

  remove(data, traversal) {
    const tree = this;
    let parent = null;
    let childToRemove = null;

    const callback = (node)=>{
      if( node.data === data){
        parent = node.parent
      }
    }

    this.contains(callback, traversal)

    if(!!parent){
      childToRemove = parent.children.find(node => node.data === data)
      if(!!childToRemove){
        parent.children = parent.children.filter(node => node.data !== data)
      } else {
        throw new Error('Node to remove does not exist.');
      }
    } else {
      throw new Error('Parent does not exist.');
    }

    return childToRemove;
  }
}

/* 
 tree
 
 one (depth: 0)
 ├── two (depth: 1)
 │   ├── five (depth: 2)
 │   └── six (depth: 2)
 ├── three (depth: 1)
 └── four (depth: 1)
     └── seven (depth: 2)
 */
test('Tree', () => {
  const tree = new Tree('one');
  let traverseDFArr = []
  let traverseBFArr = []

  tree.add('two', 'one', tree.traverseDF);
  tree.add('three', 'one', tree.traverseDF);
  tree.add('four', 'one', tree.traverseDF);
  tree.add('five', 'two', tree.traverseDF);
  tree.add('six', 'two', tree.traverseDF);
  tree.add('seven', 'four', tree.traverseDF);

  tree.traverseDF(function(node) {
    traverseDFArr.push(node.data)
  });

  tree.remove('seven', tree.traverseBF)

  tree.traverseBF(function(node) {
    traverseBFArr.push(node.data)
  });
  
  expect(traverseDFArr).toEqual(['five', 'six', 'two', 'three', 'seven', 'four', 'one'])
  expect(traverseBFArr).toEqual(['one', 'two', 'three', 'four', 'five', 'six'])
})