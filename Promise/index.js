// 不使用 es6 及以上语法

/*
约定
  state
    0: pending
    1: fulfilled
    2: rejected
    3: 采用 value 的 state
 */

'use strict';

function noop() {}

var IS_ERROR = {};
var LAST_ERROR = null;

function TcyPromise(fn) {
  this._state = 0;
  this._value = null;
  this._deferreds = [];

  if (fn === noop) return;
  doResolve(fn, this);
}

function doResolve(fn, promise) {
  var done = false;

  var result = tryCallTwo(
    fn,
    function (value) {
      if (done) return;
      done = true;
      resolve(promise, value);
    },
    function (value) {
      if (done) return;
      done = true;
      reject(promise, value);
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
  } catch (error) {
    LAST_ERROR = error;
    return IS_ERROR;
  }
}

function resolve(promise, x) {
  // 2.3.1
  if (x === promise) {
    reject(promise, new TypeError('If promise and x refer to the same object'));
    return;
  }

  // 2.3.3
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    var then = getThen(x);
    if (then === IS_ERROR) {
      reject(promise, LAST_ERROR);
      return;
    }

    // 2.3.2
    if (then === promise.then && x instanceof TcyPromise) {
      promise._state = 3;
      promise._value = x;

      finale(promise);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(x), promise);
      return;
    }
  }

  if (promise._state !== 0) return;
  promise._state = 1;
  promise._value = x;

  finale(promise);
}

function reject(promise, x) {
  if (promise._state !== 0) return;
  promise._state = 2;
  promise._value = x;

  finale(promise);
}

// 下面开始写 then 相关的代码

TcyPromise.prototype.then = function (onFulfilled, onRejected) {
  var promise2 = new TcyPromise(noop);
  handle(this, new Handler(onFulfilled, onRejected, promise2));
  return promise2;
};

function getThen(obj) {
  try {
    return obj.then;
  } catch (error) {
    LAST_ERROR = error;
    return IS_ERROR;
  }
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

function handle(promise, deferred) {
  while (promise._state === 3) {
    promise = promise._value;
  }

  if (promise._state === 0) {
    promise._deferreds.push(deferred);
    return;
  }
  handleResolved(promise, deferred);
}

function handleResolved(promise, deferred) {
  assp(function () {
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
  } catch (error) {
    LAST_ERROR = error;
    return IS_ERROR;
  }
}
function assp(fn) {
  setTimeout(fn, 0);
}

function finale(promise) {
  for (var i = 0; i < promise._deferreds.length; i++) {
    handle(promise, promise._deferreds[i]);
  }
  promise._deferreds = [];
}

module.exports = TcyPromise;
