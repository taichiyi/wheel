const throttling = (fn, delay, number = 1) => {
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
      setInterval(openLock, delay)
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
