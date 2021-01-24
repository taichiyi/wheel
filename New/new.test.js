const New = require('./');

function Foo(name, age) {
  this.name = name;
  this.age = age;
}
Foo.prototype.getName = function () {
  return this.name;
};

const obj = {};
function Foo1() {
  return obj;
}

const NewIns1 = New(Foo)('NewIns1', 1);
const NewIns2 = New(Foo)('NewIns2', 2);
const NewIns3 = New(Foo1)();
const NewIns4 = New(Foo1)();

const newIns1 = new Foo('newIns1', 3);
const newIns2 = new Foo('newIns2', 4);
const newIns3 = new Foo1();
const newIns4 = new Foo1();

test(`Check whether ins is an instanceof Foo.`, () => {
  expect(NewIns1 instanceof Foo).toEqual(true);
  expect(newIns1 instanceof Foo).toEqual(true);
  expect(NewIns2 instanceof Foo).toEqual(true);
  expect(newIns2 instanceof Foo).toEqual(true);
});

test(`Check the __proto__ of ins are equal.`, () => {
  expect(Object.getPrototypeOf(NewIns1)).toEqual(
    Object.getPrototypeOf(newIns1),
  );
});

test(`Check method`, () => {
  expect(NewIns1.getName()).toEqual('NewIns1');
  expect(newIns1.getName()).toEqual('newIns1');
});

test(`Check return obj`, () => {
  expect(NewIns3).toEqual(newIns3);
  expect(NewIns4).toEqual(newIns4);

  expect(newIns3).toEqual(newIns4);
  expect(NewIns3).toEqual(NewIns4);
});
