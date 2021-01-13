'use strict';

var IS_ERROR = {};
var LAST_ERROR = null;

function Promise1(then) {
  this._state = 0;
  this._value = null;
  this._deferreds = [];

  if (then === noop) return;

  doResolve(then, this);
}

function doResolve(then, promise) {
  var done = false;

  var result = tryCallTwo(
    then,
    function (val) {
      if (done) return;
      done = true;
      resolve(promise, val);
    },
    function (val) {
      if (done) return;
      done = true;
      reject(promise, val);
    },
  );
  if (result === IS_ERROR) {
    if (done) return;
    done = true;
    reject(promise, LAST_ERROR);
  }
}

function tryCallTwo(fn, a, b) {
  try {
    return fn(a, b);
  } catch (e) {
    LAST_ERROR = e;
    return IS_ERROR;
  }
}

function resolve(promise, x) {
  if (x === promise) {
    reject(promise, new TypeError('...'));
    return;
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    var then = getThen(x);
    if (then === IS_ERROR) {
      reject(promise, LAST_ERROR);
      return;
    }

    if (then === promise.then && x instanceof Promise1) {
      promise._state = 3;
      promise._value = x;
      finale(promise);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(x), promise);
      return;
    }
  }

  promise._state = 1;
  promise._value = x;
  finale(promise);
}

function reject(promise, x) {
  promise._state = 2;
  promise._value = x;
  finale(promise);
}

// 开始写 then 相关的代码

Promise1.prototype.then = function (onFulfilled, onRejected) {
  var promise2 = new Promise1(noop);
  handle(this, new Handler(onFulfilled, onRejected, promise2));
  return promise2;
};

function handle(promise, deferred) {
  while (promise._state === 3) {
    promise = promise._value;
  }
  if (promise._state === 0) {
    promise._deferreds.push(deferred);
    return;
  }
  handleResolve(promise, deferred);
}

function handleResolve(promise, deferred) {
  asap(function () {
    var cb = promise._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (promise._state === 1) {
        resolve(deferred.promise, promise._value);
      } else {
        reject(deferred.promise, promise._value);
      }
      return;
    }
    var result = tryCallOne(cb, promise._value);
    if (result === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, result);
    }
  });
}
function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (e) {
    LAST_ERROR = e;
    return IS_ERROR;
  }
}

function asap(fn) {
  setTimeout(fn, 0);
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

function noop() {}

function getThen(obj) {
  try {
    return obj.then;
  } catch (e) {
    LAST_ERROR = e;
    return IS_ERROR;
  }
}

function finale(promise) {
  for (var i = 0; i < promise._deferreds.length; i++) {
    handle(promise, promise._deferreds[i]);
  }
  promise._deferreds = [];
}

module.exports = Promise1;
