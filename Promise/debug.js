const Promise1 = require('./');
// const Promise1 = Promise;

let foo;
foo = new Promise1((resolve) => {
  setTimeout(() => {
    console.log(foo);
    resolve(889);
    console.log(foo);
    console.log(foo);
  }, 300);
});
