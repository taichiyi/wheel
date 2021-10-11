/*
`compose(f, g, h)`
`(...args) => f(g(h(...args)))`
 */
const compose = (...funcs) => {
  if (funcs.length === 0)
    return (args) => args
  if (funcs.length === 1)
    return funcs[0]
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

const compose1 = (...funs) => {
  if (funs.length === 0) {
    return arg => arg
  }
  if (funs.length === 1) {
    return funs[0]
  }
  return funs.reduce(
    (acc, curr) => (...args) => acc(curr(...args))
  )
}

module.exports = compose
