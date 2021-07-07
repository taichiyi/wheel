/*
总结
  每个 promise 只受一个 then 函数影响。

  promise 的 state 和 value 由 then 函数决定。
    state
      是根据调用 then 函数的参数 onFulFilled 或 onRejected 来决定。
    value
      根据 then 函数的来源
        自身提供的
          onFulfilled(x) => any | onRejected(x) => any
          (说明：x 值为“父 Promise”的 value)

        外部提供的
          onFulfilled(x) => x | onRejected(x) => x
          (说明：x 值是 client 传的，x 值就是 promise 的 value)

  子 promise 三要素
    promise(自身)
    onFulfilled
    onRejected

  then 函数的接口
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

  promise（称为 A）的 state 如果等于 3 则意味着 value 是个 promise（称为 B），B 将替换 A
  防止 server 的 resolve 和 reject 被多次调用。
  先完成外部提供 then 函数情况下的代码，再完成内部提供 then 函数情况下的代码。
  then 函数是 server 执行的，then 函数的两个参数是 client 提供的，server 根据 then 函数的执行情况，选择一个参数进行处理
  根据 then 函数的来源做不同的处理

  promise 和 then 函数构成了一个链表
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
  只包含 promise 核心代码

约定
  state
    0: pending
    1: fulfilled
    2: rejected
    3: 采用 value 的 state
 */

'use strict';

function PromiseA(then) {
  this._state = 0
  this._value = null
  this._deferreds = []

  if (then === isInnerThen) return

  outerThenHandle(this, then)
}


function outerThenHandle(promise, then) {
  let done = false
  try {
    then(
      function (value) {
        if (done) return
        done = true
        resolve(promise, value)
      },
      function (value) {
        if (done) return
        done = true
        reject(promise, value)
      },
    )
  } catch (error) {
    if (done) return
    done = true
    reject(promise, error)
  }
}

function resolve(promise, value) {
  if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
    if (value === promise) {
      reject(promise, new TypeError('...'))
      return
    }

    if (value instanceof PromiseA) {
      promise._state = 3
      promise._value = value
      performDeferred(promise)
      return
    }

    let then = null
    try {
      then = value.then
    } catch (err) {
      reject(promise, err)
      return
    }
    if (typeof then === 'function') {
      outerThenHandle(promise, then.bind(value))
      return
    }
  }

  promise._value = value
  promise._state = 1
  performDeferred(promise)
}

function reject(promise, value) {
  promise._value = value
  promise._state = 2

  performDeferred(promise)
}

function performDeferred(parentPromise) {
  for (let i = 0; i < parentPromise._deferreds.length; i++) {
    innerThenHandle(
      parentPromise,
      parentPromise._deferreds[i]
    )
  }
  parentPromise._deferreds = []
}

function isInnerThen() { }
PromiseA.prototype.then = function (onFulfilled, onRejected) {
  const childPromise = new PromiseA(isInnerThen)
  innerThenHandle(
    this,
    new ChildPromiseInfo(childPromise, onFulfilled, onRejected)
  )
  return childPromise
}

function innerThenHandleImpl(parentPromise, childPromiseElements) {
  const cb = parentPromise._state === 1
    ? childPromiseElements.onFulfilled
    : childPromiseElements.onRejected

  // 判断处理函数是否有传
  if (cb === null) {
    if (parentPromise._state === 1) {
      resolve(
        childPromiseElements.promise,
        parentPromise._value,
      )
      return
    } else {
      reject(
        childPromiseElements.promise,
        parentPromise._value,
      )
      return
    }
  }
  try {
    resolve(
      childPromiseElements.promise,
      cb(parentPromise._value),
    )
  } catch (err) {
    reject(
      childPromiseElements.promise,
      err,
    )
  }
}

function innerThenHandle(parentPromise, childPromiseElements) {
  while (parentPromise._state === 3) {
    parentPromise = parentPromise._value
  }
  if (parentPromise._state === 0) {
    parentPromise._deferreds.push(childPromiseElements)
    return
  }

  const bindedInnerThenHandleImpl = innerThenHandleImpl.bind(null, parentPromise, childPromiseElements)
  enqueueTask(bindedInnerThenHandleImpl)
}

function enqueueTask(task) {
  asap(task)
}

function asap(fn) {
  setTimeout(fn, 0)
}

function ChildPromiseInfo(promise, onFulfilled, onRejected) {
  this.promise = promise
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
}

module.exports = PromiseA
