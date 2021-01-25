function _extends(subType, superType) {
  var prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = Object.assign(prototype, subType.prototype);
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
  return this.name;
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
SubType.prototype.sayAge = function () {
  return this.age;
};
_extends(SubType, SuperType);

class SuperClass {
  constructor(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
  }
  sayName() {
    return this.name;
  }
}
class SubClass extends SuperClass {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  sayAge() {
    return this.age;
  }
}

const ins1 = new SubType('uuu', 39);
const ins2 = new SubClass('kkk', 100);

console.log(SubType);
module.extends = _extends;
