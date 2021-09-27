const debouncing = (fn, period) => {
  let timeOutId = null
  return function () {
    if (timeOutId !== null) {
      clearTimeout(timeOutId)
    }
    timeOutId = setTimeout(fn.bind(this), period, ...arguments)
  }
}
