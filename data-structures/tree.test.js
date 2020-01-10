/**
 * 在计算机科学中，树是一种用节点来模拟分层数据的数据结构。每个树节点都包含他本身的数据及指向其他节点的指针。
 * 树的结点数：N>=0,N=0时为空树
 * 树适用于表示有层次结构的数据。
 * N个结点的树有N-1条边
 * 树中结点的最大度数称为树的度，度>0的点称为分支节点，度=0的点称为叶子节点（终端节点）
 * 结点层次：根节点为1，树的高度（深度）是树中结点的最大层数
 * 有序树：结点的子树从左到右是有次序的，反之为无序树
 * 两个结点的路径是由这两个结点之间所经过的结点序列构成的
 * 路径长度是路径上所经过的边的个数
 * 树的路径长度	是从根结点到每一结点路径长度的总和(不同于边的数量)
​	树中的相关性质（度为m）：
​			第i层：至多个结点
​	(重点)	按序号从上到下，每层从左到右编号满m叉树：
​			则：第 i 层节点数：
​				结点 i 的第 k 个孩子编号为：    (前i-1个节点都有了m个孩子，再加上自己)
​				结点 i 的双亲编号为: 
m叉树
至少
至多
高度h->结点n
结点n->高度h
​	 注意：结点数=边+1
​	任何一个树中的叶子节点数量为：
​	n个结点构造的不同的树的数量:
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