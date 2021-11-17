function New(fn) {
  return function () {
    var obj = Object.create(fn.prototype);
    var result = fn.apply(obj, arguments);
    return result instanceof Object ? result : obj;
  };
}

const New1 = (fn) => (...args) => {
  const obj = Object.create(fn.prototype);
  const result = fn.apply(obj, args);
  return result instanceof Object ? result : obj;
};

module.exports = New;
