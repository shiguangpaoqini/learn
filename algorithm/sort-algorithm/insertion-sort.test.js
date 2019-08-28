/**
 * 插入排序（insertion-sort）
 * 2019-8-21
 * 将左侧序列看成一个有序序列，每次将一个数字插入该有序序列。
 * 插入时，从有序序列最右侧开始比较，若比较的数较大，后移一位。
 * 
 * 时间复杂度: O(n^2)
 * 空间复杂度: O(1)
 */
import randomArr from './randomArr'

function insertionSort(arr){
  for(var i=1; i<arr.length; i++){
    let target = i
    for(var j=i-1; j>=0; j--){
      if(arr[target]<arr[j]){
        [arr[target], arr[j]] = [arr[j], arr[target]]
        target = j
      } else{
        break;
      }
    } 
  }
  return arr;
}

test('insertion-sort', ()=>{
  let random_arr = randomArr()
  let insertion_sort_arr = insertionSort(random_arr.arr)
  console.log(insertion_sort_arr)
  expect(insertion_sort_arr).toEqual(random_arr.sort_arr)
})