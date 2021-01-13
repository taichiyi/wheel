// 实现 async 函数

const createAsyncFunction = require('./');

async function foo() {
  const a = await 111;
  const b = await 'abc';
  const c = await new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, 'resolve value');
    setTimeout(reject, 3000, 'reject value');
  });
  const d = await Symbol.for('sym');

  return [a, b, c, d];
}

function* foo1() {
  const a = yield 111;
  const b = yield 'abc';
  const c = yield new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, 'resolve value');
    setTimeout(reject, 3000, 'reject value');
  });
  const d = yield Symbol.for('sym');

  return [a, b, c, d];
}

console.log(
  createAsyncFunction(foo1)().then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  ),
);

console.log(
  foo().then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  ),
);
