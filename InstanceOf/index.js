const instanceOf = (ins, constructor) => {
  let insProto = ins
  while (insProto = Object.getPrototypeOf(insProto)) {
    if (insProto === constructor.prototype) {
      return true
    }
  }
  return false
}

const instanceOf1 = (ins, constructor) => constructor.prototype.isPrototypeOf(ins)

function Constructor() { }
const ins = new Constructor
console.log(
  instanceOf([], Constructor)
);
console.log(
  instanceOf(ins, Constructor)
);
console.log(
  instanceOf([], Object)
);
