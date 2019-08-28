/**
 * 冒泡排序（bubble-sort）
 * 2019-8-21
 * 循环数组，比较当前元素和下一个元素，如果当前元素比下一个元素大，向上冒泡。
 * 这样一次循环之后最后一个数就是本数组最大的数。下一次循环继续上面的操作，不循环已经排序好的数。
 * 
 * 优化：
 * 假设我们现在排序ar[]={1,2,3,4,5,6,7,8,10,9}这组数据，按照上面的排序方式，
 * 第一趟排序后将10和9交换已经有序，接下来的8趟排序就是多余的，什么也没做。
 * 所以我们可以在交换的地方加一个标记，如果那一趟排序没有交换元素，说明这组数据已经有序，不用再继续下去。
 * 
 * 时间复杂度: O(n^2)
 * 空间复杂度: O(1)
 */
import randomArr from './randomArr'

function bubbleSort(arr){
  for(var i=0; i<arr.length; i++){
    let complete = true
    for(var j=0; j<arr.length-1-i; j++){
      if(arr[j]>arr[j+1]){
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
        // arr[j] = arr[j]^arr[j+1]
        // arr[j+1] = arr[j+1]^arr[j]
        // arr[j] = arr[j]^arr[j+1]
        complete = false
      }
    }
    if(complete) {
      break ;
    }
  }
  return arr
}

test('bubble-sort', ()=>{
  let random_arr = randomArr()
  let bubble_sort_arr = bubbleSort(random_arr.arr)
  console.log(bubble_sort_arr)
  expect(bubble_sort_arr).toEqual(random_arr.sort_arr)
})