/**
 * 归并排序（merge-sort）
 * 2019-8-21
 * 利用归并的思想实现的排序方法。
 * 
 * 分割：
 * 将数组从中点进行分割，分为左、右两个数组
 * 递归分割左、右数组，直到数组长度小于2
 * 归并：
 * 如果需要合并，那么左右两数组已经有序了。
 * 创建一个临时存储数组temp，比较两数组第一个元素，将较小的元素加入临时数组
 * 若左右数组有一个为空，那么此时另一个数组一定大于temp中的所有元素，直接将其所有元素加入temp
 * 
 * 时间复杂度: O(nlogn)
 * 空间复杂度: O(n)
 */
import randomArr from './randomArr'

function mergeSort(arr){
  if( arr.length<2 ){
    return arr
  }
  let sliceIdx = Math.floor(arr.length/2)
  let left = arr.slice(0, sliceIdx)
  let right = arr.slice(sliceIdx)

  arr = merge(mergeSort(left), mergeSort(right))

  return arr

  function merge(left, right){
    let temp = []
    while(left.length && right.length){
      if(left[0]<right[0]){
        temp.push(left.shift())
      } else {
        temp.push(right.shift())
      }
    }
    while(left.length){
      temp.push(left.shift())
    }
    while(right.length){
      temp.push(right.shift())
    }
    return temp
  }
}

test('merge-sort', ()=>{
  let random_arr = randomArr()
  let merge_sort_arr = mergeSort(random_arr.arr)
  console.log(merge_sort_arr)
  expect(merge_sort_arr).toEqual(random_arr.sort_arr)
})