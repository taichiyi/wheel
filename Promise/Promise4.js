'use strict';

// 总结
// Promise 和 then 构成了一个链表
// 第一个 Promise 的 state 和 value 由 client 决定
// 其他 Promise 的
//   state 由“上一个 Promise”决定
//   value 由“上一个 Promise”和“当前 then”决定

// core.js

var asap = function (fn) {
  setTimeout(fn, 0);
};

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.

// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError("Promise constructor's argument is not a function");
  }
  this._deferredState = 0;
  this._state = 0;
  this._value = null;
  this._deferreds = null;

  // 下面这行代码意味着
  // 表达式为真时，此 Promise 为子。
  // 子 Promise 的 state 由父 Promise 决定，value 由父 Promise 和 then 决定。
  if (fn === noop) return;

  doResolve(fn, this);
}
Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;

Promise.prototype.then = function (onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  if (self._state === 0) {
    /*
      用 "_deferredState" 表示 Promise 的 deferreds 的类型和数量，关系如下表格

      | _deferredState | _deferreds |
      | -------------- | ---------- |
      | 0              | null       |
      | 1              | object     |
      | >=2            | array      |

     */
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
    }
    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  // 当 _state 等于 0 时，不会将 promise 的 deferred 添加到异步队列
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function () {
    // 这里的 self._state 不会等于 0

    // 下面的逻辑做了两件事
    // - 确定“子 Promise”的 state
    // - 确定“子 Promise”的 value
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      // 这个 then 至少一个 onRulfilled 和 onRejected 没传
      if (self._state === 1) {
        // 这个 Promise 的状态为 fulfilled
        // onFulfilled 为函数
        // onRejected 为 null
        resolve(deferred.promise, self._value);
      } else {
        // 这个 子Promise 的状态为 rejected
        // onRejected 为函数
        // onFulfilled 为 null
        reject(deferred.promise, self._value);
      }
      return;
    }
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.'),
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (then === self.then && newValue instanceof Promise) {
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._state = 1;
  self._value = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  if (Promise._onReject) {
    Promise._onReject(self, newValue);
  }
  finale(self);
}
function finale(self) {
  // 处理，在这个 Promise 完成或失败之前添加 的 deferreds
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }
  if (self._deferredState === 2) {
    for (var i = 0; i < self._deferreds.length; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(
    fn,
    function (value) {
      if (done) return;
      done = true;
      resolve(promise, value);
    },
    function (reason) {
      if (done) return;
      done = true;
      reject(promise, reason);
    },
  );
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

// done.js
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

// es6-extensions.js
(function () {
  var TRUE = valuePromise(true);
  var FALSE = valuePromise(false);
  var NULL = valuePromise(null);
  var UNDEFINED = valuePromise(undefined);
  var ZERO = valuePromise(0);
  var EMPTYSTRING = valuePromise('');

  function valuePromise(value) {
    var p = new Promise(Promise._noop);
    p._state = 1;
    p._value = value;
    return p;
  }
  Promise.resolve = function (value) {
    if (value instanceof Promise) return value;

    if (value === null) return NULL;
    if (value === undefined) return UNDEFINED;
    if (value === true) return TRUE;
    if (value === false) return FALSE;
    if (value === 0) return ZERO;
    if (value === '') return EMPTYSTRING;

    if (typeof value === 'object' || typeof value === 'function') {
      try {
        var then = value.then;
        if (typeof then === 'function') {
          return new Promise(then.bind(value));
        }
      } catch (ex) {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      }
    }
    return valuePromise(value);
  };

  var iterableToArray = function (iterable) {
    if (typeof Array.from === 'function') {
      // ES2015+, iterables exist
      iterableToArray = Array.from;
      return Array.from(iterable);
    }

    // ES5, only arrays and array-likes exist
    iterableToArray = function (x) {
      return Array.prototype.slice.call(x);
    };
    return Array.prototype.slice.call(iterable);
  };

  Promise.all = function (arr) {
    var args = iterableToArray(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;
      function res(i, val) {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          if (val instanceof Promise && val.then === Promise.prototype.then) {
            while (val._state === 3) {
              val = val._value;
            }
            if (val._state === 1) return res(i, val._value);
            if (val._state === 2) reject(val._value);
            val.then(function (val) {
              res(i, val);
            }, reject);
            return;
          } else {
            var then = val.then;
            if (typeof then === 'function') {
              var p = new Promise(then.bind(val));
              p.then(function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      }
      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      iterableToArray(values).forEach(function (value) {
        Promise.resolve(value).then(resolve, reject);
      });
    });
  };

  /* Prototype Methods */

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };
})();

// finally.js
Promise.prototype.finally = function (f) {
  return this.then(
    function (value) {
      return Promise.resolve(f()).then(function () {
        return value;
      });
    },
    function (err) {
      return Promise.resolve(f()).then(function () {
        throw err;
      });
    },
  );
};

// synchronous.js
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function () {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function () {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function () {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._state === 3) {
      return this._value.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._value;
  };

  Promise.prototype.getReason = function () {
    if (this._state === 3) {
      return this._value.getReason();
    }

    if (!this.isRejected()) {
      throw new Error(
        'Cannot get a rejection reason of a non-rejected promise.',
      );
    }

    return this._value;
  };

  Promise.prototype.getState = function () {
    if (this._state === 3) {
      return this._value.getState();
    }
    if (this._state === -1 || this._state === -2) {
      return 0;
    }

    return this._state;
  };
};

Promise.disableSynchronous = function () {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};
