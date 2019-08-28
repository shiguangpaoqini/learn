/**
 * 选择排序（selection-sort）
 * 2019-8-21
 * 每次循环选取一个最小的数字放到前面的有序序列中。
 * 
 * 时间复杂度: O(n^2)
 * 空间复杂度: O(1)
 */
import randomArr from './randomArr'

function selectionSort(arr){
  for(var i=0; i<arr.length-1; i++){
    let minIdx = i
    for(var j=i+1; j<arr.length; j++){
      if(arr[j]<arr[minIdx]){
        minIdx = j
      }
    }
    [arr[minIdx], arr[i]] = [arr[i], arr[minIdx]]
  }
  return arr
}

test('selection-sort', ()=>{
  let random_arr = randomArr()
  let selection_sort_arr = selectionSort(random_arr.arr)
  console.log(selection_sort_arr)
  expect(selection_sort_arr).toEqual(random_arr.sort_arr)
})

