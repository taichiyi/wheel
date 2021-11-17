const reduce = (arr, reducer, initialValue) => {
  let acc = initialValue
  let index = 0
  if (initialValue === undefined) {
    if (arr.length < 2) {
      throw Error('...')
    }
    acc = arr[0]
    index = 1
  }
  for (; index < arr.length; index++) {
    const curr = arr[index]
    acc = reducer(acc, curr, index, arr)
  }
  return acc
}
