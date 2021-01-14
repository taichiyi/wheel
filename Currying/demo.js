'use strict';

function currying(fn) {
  const args = [];
  return function f() {
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    if (args.length < fn.length) {
      return f;
    } else {
      const result = fn.apply(null, args);
      args.length = 0;
      return result;
    }
  };
}
module.exports = currying;
