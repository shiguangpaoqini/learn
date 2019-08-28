/**
 * 快速排序（quick-sort）
 * 2019-8-21
 * 通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据比另一部分的所有数据要小，
 * 再按这种方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，使整个数据变成有序序列。
 * 
 * 时间复杂度: 平均O(nlogn)，最坏O(n^2)，实际上大多数情况下小于O(nlogn)
 * 空间复杂度: O(logn)（递归调用消耗）
 */
import randomArr from './randomArr'

 function quickSort(arr){
    let target = arr[0]
    let left=[]
    let right=[]
    if(arr.length>1) {
      for(var i=1; i<arr.length; i++){
        if(arr[i]<=target){
          left.push(arr[i])
        } else{
          right.push(arr[i])
        }
      }
      arr = [].concat(quickSort(left), arr[0], quickSort(right))
    }
    return arr
 }


test('quick-sort', ()=>{
  let random_arr = randomArr()
  let quick_sort_arr = quickSort(random_arr.arr)
  console.log(quick_sort_arr)
  expect(quick_sort_arr).toEqual(random_arr.sort_arr)
})