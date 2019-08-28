/**
 * map callback => function callback(currentValue[, index[, array]]
 * parseInt(string, radix) 接收两个参数，第一个表示被处理的值（字符串），第二个表示为解析时的基数
 * parseInt('1', 0) radix为0时，且string参数不以“0x”和“0”开头时，按照10为基数处理。这个时候返回1
 * parseInt('2', 1) 基数为1 无法解析 返回NaN
 * parseInt('3', 2) 基数为2（2进制）表示的数中，最大值小于3，所以无法解析，返回NaN
 */

test('How it works?', ()=>{
  expect(['1', '2', '3'].map(parseInt)).toEqual([1,NaN,NaN])
  expect(['10', '10', '10', '10', '10', '10'].map(parseInt)).toEqual([10,NaN,2,3,4,5])
  expect(['1', '2', '3'].map(Number)).toEqual([1,2,3])
})
