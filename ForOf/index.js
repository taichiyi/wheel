'use strict'

const forOf = (iterableObjects, compoundStatement) => {
  const iterableIterator = iterableObjects[Symbol.iterator]()
  while (true) {
    const iteratorResult = iterableIterator.next()
    if (iteratorResult.done) break
    compoundStatement(iteratorResult.value)
  }
}

module.exports = forOf
