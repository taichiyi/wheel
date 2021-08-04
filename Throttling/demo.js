// 思路
// 1. 概念，节流是一个周期内只能触发指定次数的限制函数调用频率的高阶函数。
// 2. 重点，加锁和解锁
// 3. 有 3 个形参，被节流函数、周期、次数
// 4. 如何实现周期解锁
// 5. 如何加锁

// 节流
const throttling = (fn, period, number = 1) => {
  let hasLock = false
  let runNumber = 0
  let isRunInterval = false

  const openLock = () => {
    hasLock = false
    runNumber = 0
  }

  return function () {
    if (isRunInterval === false) {
      isRunInterval = true
      setInterval(openLock, period)
    }
    if (hasLock === false) {
      runNumber++;
      fn.apply(this, arguments);
    }
    const isCloseLock = runNumber === number
    if (isCloseLock) {
      hasLock = true
    }
  }
}

// use
// const throttleHandleInput = throttling(handleInput, 1 * 1000)
