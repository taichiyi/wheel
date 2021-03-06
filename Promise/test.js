const promisesAplusTests = require('promises-aplus-tests');
const TestPromise = require('./');
// const TestPromise = Promise;

TestPromise.deferred = () => {
  const deferred = {};

  deferred.promise = new TestPromise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};
promisesAplusTests(TestPromise);
