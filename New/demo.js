function New(fn) {
  return function () {
    var obj = Object.create(fn.prototype);
    var result = fn.apply(obj, arguments);
    return typeof result === 'object' ? result : obj;
  };
}

module.exports = New;
