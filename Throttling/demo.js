// 思路
// 1. 概念，节流是一个周期内只能触发指定次数的限制函数调用频率的高阶函数。
// 2. 重点，加锁和解锁
// 3. 有 3 个形参：被节流函数、周期、最大次数
// 4. 有 1 个内部状态：已执行次数
// 5. 有 1 个方法：重置已执行次数


// 节流
const throttling = (fn, period, max = 1) => {
  let executed = 0;
  const resetExecuted = () => executed = 0

  return function () {
    if (executed === 0) {
      setTimeout(resetExecuted, period)
    }
    executed++;
    if (executed <= max) {
      fn.apply(this, arguments)
    }
  }
}

// use
// const throttleHandleInput = throttling(handleInput, 1 * 1000)
