/*
总结
  每个 promise 只有一个 then。

  promise 的 state 和 value 由 then 决定。
    state
      是根据调用 then 的参数 onFulFilled 或 onRejected 来决定。
    value
      根据 then 的来源
        自身提供的
          onFulfilled(x) => any | onRejected(x) => any，x 值为“父 Promise”的 value

        外部提供的
          onFulfilled(x) => x | onRejected(x) => x，x 值是 client 传的，x 值就是 promise 的 value

  then 三要素
    promise
    onFulfilled
    onRejected

  then 的接口
  interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
      onFulfilled?:
        ((value: T) => TResult1 | PromiseLike<TResult1>) |
        undefined |
        null,
      onRejected?:
        ((value: any) => TResult2 | PromiseLike<TResult2>) |
        undefined |
        null,
    ): Promise<TResult1 | TResult2>
  }

  promise/then 的 state 如果等于 3 则意味着 value 是个 promise/then，

  promise 和 then 构成了一个链表

 ---------
| promise |
 ---------
            \
             \  --------
               | promise |
                --------
            \
             \  --------
               | promise |
                --------
                           \
                            \  --------
                              | promise |
                               --------
                           \
                            \  --------
                              | promise |
                               --------
                           \
                            \  --------
                              | promise |
                               --------
 */

/*
说明
  不使用 es6 及以上语法
  只包含 promise 核心代码

约定
  state
    0: pending
    1: fulfilled
    2: rejected
    3: 采用 value 的 state
 */

'use strict';

var IS_ERROR = {};
var LAST_ERROR = null;

function Promise1(then) {
  this._state = 0;
  this._value = null;
  this._deferreds = [];

  /* 下面这行代码意味着

    表达式为真时，then 为 自身的 then，否则为 其他的 then
    then 的 state 由 promise 决定，value 由 promise 和 then 决定。
   */
  if (then === noop) return;

  doResolve(then, this);
}

function doResolve(then, promise) {
  var done = false;

  var result = tryCallTwo(
    then,
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
  } catch (e) {
    LAST_ERROR = e;
    return IS_ERROR;
  }
}

// 处理 promise 的 state，改为“完成/拒绝”
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

// 处理 promise 的 state，改为“拒绝”
function reject(promise, x) {
  promise._state = 2;
  promise._value = x;
  finale(promise);
}

// 下面开始写 then 相关的代码

Promise1.prototype.then = function (onFulfilled, onRejected) {
  var promise2 = new Promise1(noop);
  handle(this, new Handler(onFulfilled, onRejected, promise2));
  return promise2;
};

/*
根据 "父 promise" 的 state 处理“子 promise”
  已完成或拒绝
    则直接添加到任务队列
  等待中
    添加到 promise 的 deferreds
 */
function handle(promise, deferred) {
  while (promise._state === 3) {
    // “子 promise”更换"父 promise"
    promise = promise._value;
  }

  // 当 _state 等于 0 时，不会将 promise 的 deferred 添加到异步队列
  if (promise._state === 0) {
    promise._deferreds.push(deferred);
    return;
  }
  handleResolved(promise, deferred);
}

/*
把 then 添加到异步队列
处理 promise 的 value
 */
function handleResolved(promise, deferred) {
  // 这里的 self._state 不会等于 0

  asap(function () {
    var cb = promise._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      // 这个 then 至少一个 onRulfilled 和 onRejected 没传
      if (promise._state === 1) {
        // 这个 promise 的 stare 为 1(fulfilled)
        // onFulfilled 为 null
        resolve(deferred.promise, promise._value);
      } else {
        // 这个 promise 的状态为 2(rejected)
        // onFulfilled 为 null
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

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (e) {
    LAST_ERROR = e;
    return IS_ERROR;
  }
}
function noop() {}

function asap(fn) {
  setTimeout(fn, 0);
}

function getThen(obj) {
  try {
    return obj.then;
  } catch (e) {
    LAST_ERROR = e;
    return IS_ERROR;
  }
}
// 处理，在这个 promise 完成或拒绝之前添加的 deferreds
function finale(promise) {
  for (var i = 0; i < promise._deferreds.length; i++) {
    handle(promise, promise._deferreds[i]);
  }
  promise._deferreds = [];
}

module.exports = Promise1;
