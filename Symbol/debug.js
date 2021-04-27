const Symbol2 = require('./index')

let sym1 = Symbol2()
let sym2 = Symbol2('foo')
let sym3 = Symbol2('foo')

console.log(
  Symbol2('foo') === Symbol2('foo')
);
console.log(
  Symbol2.asyncIterator
);

var globalSym = Symbol2.for('foo'); // create a new global symbol
console.log(
  Symbol2.keyFor(globalSym)
); // "foo"

var localSym = Symbol();
console.log(
  Symbol2.keyFor(localSym)
); // undefined

// well-known symbols are not symbols registered
// in the global symbol registry
console.log(
  Symbol2.keyFor(Symbol2.iterator)
); // undefined

console.dir();
