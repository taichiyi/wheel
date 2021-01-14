const currying = require('./');

function add2(a, b) {
  return a + b;
}

function multiply2(a, b) {
  return a * b;
}

function add3(a, b, c) {
  return a + b + c;
}

function multiply3(a, b, c) {
  return a * b * c;
}

test('add2(2,3) to equal 5', () => {
  expect(add2(2, 3)).toBe(5);
});

test('add2Curry(2)(3) to equal 5', () => {
  expect(currying(add2)(2)(3)).toBe(5);
});

test('multiply2(2,3) to equal 6', () => {
  expect(multiply2(2, 3)).toBe(6);
});

test('multiply2Curry(2)(3) to equal 6', () => {
  expect(currying(multiply2)(2)(3)).toBe(6);
});

test('add3(2,3,5) to equal 10', () => {
  expect(add3(2, 3, 5)).toBe(10);
  expect(add3(2, 3, 5)).toBe(10);
});

test('add3Curry(2)(3)(5) to equal 10', () => {
  expect(currying(add3)(2)(3)(5)).toBe(10);
  expect(currying(add3)(2)(3)(5)).toBe(10);
});

test('multiply3(2,3,5) to equal 30', () => {
  expect(multiply3(2, 3, 5)).toBe(30);
  expect(multiply3(2, 3, 5)).toBe(30);
});

test('multiply3Curry(2)(3)(5) to equal 30', () => {
  expect(currying(multiply3)(2)(3)(5)).toBe(30);
  expect(currying(multiply3)(2)(3)(5)).toBe(30);
});

test('multiply3Curry = currying(multiply3); multiply3Curry(2)(3)(5) to equal 30', () => {
  const multiply3Curry = currying(multiply3);
  expect(multiply3Curry(2)(3)(5)).toBe(30);
  expect(multiply3Curry(2)(3)(5)).toBe(30);
});
