const Promise1 = require('./Promise4');
// const Promise1 = Promise;

let foo;
foo = new Promise1((resolve, reject) => {
  reject('xxx');
  setTimeout(() => {
    console.log(foo);
    resolve(889);
    console.log(foo);
    console.log(foo);
  }, 300);
});
try {
  foo.done();
} catch (error) {
  console.log();
}
