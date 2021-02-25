'use strict'

const forOf = (iterableObjects, compoundStatement) => {
  const iterator = iterableObjects[Symbol.iterator]

  if (typeof iterator !== 'function')
    throw new TypeError(`${iterator} is not iterable`)
  if (typeof iterableObjects[Symbol.iterator]() !== 'object')
    throw new TypeError('Result of the Symbol.iterator method is not an object')

  const iterableIterator = iterableObjects[Symbol.iterator]()

  if (typeof iterableIterator.next !== 'function')
    throw new TypeError(`${iterableIterator.next} is not a function`)

  while (true) {
    const iteratorResult = iterableIterator.next()

    if (typeof iteratorResult !== 'object')
      throw new TypeError(`Iterator result ${iteratorResult} is not an object`)

    if (iteratorResult.done) break
    compoundStatement(iteratorResult.value)
  }
}

module.exports = forOf
