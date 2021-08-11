'use strict';

function currying(func) {
  let args = []
  return function f() {
    args = [...args, ...arguments]
    if (args.length < func.length) {
      return f
    } else {
      const result = func.apply(null, args)
      args.length = 0
      return result
    }
  }
}
module.exports = currying;
