const Symbol2Super = Object.create(null)
Symbol2Super.toString = function () {
  return `Symbol2(${this.name})`
}
Symbol2Super.valueOf = function () {
  return this
}
const symbolMap = {}
const Symbol2 = name => {
  return Object.create(Symbol2Super, {
    name: {
      value: name,
      writable: false,
      configurable: false,
    }
  })
}
Symbol2.for = name => {
  const sym = symbolMap.name
  const hasExist = sym !== undefined
  if (hasExist) {
    return sym
  } else {
    const newSym = Symbol2(name)
    symbolMap[name] = newSym
    return newSym
  }
}
Symbol2.keyFor = sym => {
  let resultKey;
  for (const key in symbolMap) {
    const symbolElement = symbolMap[key];
    if (symbolElement === sym) {
      resultKey = key
      return resultKey
    }
  }
  return resultKey
}
// Symbol2.ObjectGetOwnPropertySymbols = obj => {
//   const result = []
//   const isObject = value => typeof value === 'object' && value !== null
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const element = obj[key];
//       console.log(element);
//       console.log(isObject(element));
//       const isSymbol2Ins = isObject(element) && element instanceof Symbol2Super
//       if (isSymbol2Ins) {
//         reuslt.push(element)
//       }
//     }
//   }
//   return result
// }
Symbol2.asyncIterator = Symbol2('Symbol2.asyncIterator')
Symbol2.iterator = Symbol2('Symbol2.iterator')


module.exports = Symbol2
