const Symbol2 = require('./index')

describe('Symbol2.keyFor()', () => {
  test(`Symbol2.keyFor(Symbol2.for('foo'))`, () => {
    const globalSym = Symbol2.for('foo'); // create a new global symbol
    expect(Symbol2.keyFor(globalSym)).toBe('foo');
  });
  test(`Symbol2.keyFor(Symbol2())`, () => {
    const localSym = Symbol2();
    expect(Symbol2.keyFor(localSym)).toBe(undefined)
  });
  test(`Symbol2.keyFor(Symbol2.iterator)`, () => {
    expect(Symbol2.keyFor(Symbol2.iterator)).toBe(undefined)
  });
})

describe('Symbol2.key()', () => {
  test(`Symbol2.for('bar') === Symbol2.for('bar')`, () => {
    expect(Symbol2.for('bar') === Symbol2.for('bar')).toBe(false)
  })
})

describe('Symbol2.toString()', () => {
  test(`Symbol2('desc').toString()`, () => {
    expect(Symbol2('desc').toString()).toBe('Symbol2(desc)')
  })
  test(`Symbol2.iterator.toString()`, () => {
    expect(Symbol2.iterator.toString()).toBe('Symbol2(Symbol2.iterator)')
  })
  test(`Symbol2.for('foo').toString()`, () => {
    expect(Symbol2.for('foo').toString()).toBe('Symbol2(foo)')
  })
})

describe('Symbol2.valueOf()', () => {
  const sym = Symbol2("example");
  test(`sym === sym.valueOf()`, () => {
    expect(sym === sym.valueOf()).toBe(true)
  })
})

// describe('Object.getOwnPropertySymbols()', () => {
//   const obj = {};
//   const a = Symbol2('a');
//   const b = Symbol2.for('b');

//   obj[a] = 'localSymbol';
//   obj[b] = 'globalSymbol';

//   const objectSymbols = Symbol2.ObjectGetOwnPropertySymbols(obj);
//   test(`objectSymbols.length`, () => {
//     expect(objectSymbols.length).toBe(2)
//   })
//   // test(`objectSymbols[0]`, () => {
//   //   expect(objectSymbols[0]).toBe(a)
//   // })
// })
