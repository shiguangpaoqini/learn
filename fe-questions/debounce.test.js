import { useState } from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
/**
 * 🤚 debounce 防抖函数
 */

//   const debounce = ( fn, wait = 50, immediate = true )=>{
//     let timer = 0
//     return function ( ...args ){
//       if (timer) clearTimeout(timer)
//       timer = setTimeout(()=>{
//         fn.apply(this, args)
//       }, wait)
//     }
//  }

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    
  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    expect(timer)
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

  test('debounce test', async ()=>{
    function Foo(){
      const [count, setCount] = useState(0)
      return (
        <>
          <p data-testid='count' >{count}</p>
          <button onClick={
            debounce(()=>{
              setCount(count+1)
            }, 5000)
          }>click me</button>
        </>
      )
    }
    const { getByText, getByTestId } = render(<Foo />);
    expect(getByTestId('count').innerHTML).toEqual('0')
    fireEvent.click(getByText('click me'))
    // fireEvent.click(getByText('click me'))
    // expect(getByTestId('count').innerHTML).toEqual('1')
    // fireEvent.click(getByText('click me'))
    // expect(getByTestId('count').innerHTML).toEqual('2')
    await wait(()=>{fireEvent.click(getByText('click me'))}).then(()=>{
      expect(getByTestId('count').innerHTML).toEqual('2')
    }, 2000)
 })