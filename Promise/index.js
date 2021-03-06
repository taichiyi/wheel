'use strict'

/*
约定

state
  0: pending
  1: fulfilled
  2: rejected
  3: 采用 value 的 state
 */

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

    let then = null
    try {
      then = value.then
    } catch (err) {
      reject(promise, err)
      return
    }
    if (then === promise.then && value instanceof PromiseA) {
      promise._state = 3
      promise._value = value
      performDeferred(promise)
      return
    } else if (typeof then === 'function') {
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
    new ChildPromiseHandler(childPromise, onFulfilled, onRejected)
  )
  return childPromise
}
function innerThenHandle(parentPromise, childPromiseElements) {
  while (parentPromise._state === 3) {
    parentPromise = parentPromise._value
  }
  if (parentPromise._state === 0) {
    parentPromise._deferreds.push(childPromiseElements)
    return
  }
  enqueueChildPromiseHandle(parentPromise, childPromiseElements)
}

function enqueueChildPromiseHandle(parentPromise, childPromiseElements) {
  asap(function childPromiseHandle() {
    const cb = parentPromise._state === 1 ? childPromiseElements.onFulfilled : childPromiseElements.onRejected
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
  })
}

function asap(fn) {
  setTimeout(fn, 0)
}

function ChildPromiseHandler(promise, onFulfilled, onRejected) {
  this.promise = promise
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
}

module.exports = PromiseA
