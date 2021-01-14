const createAsyncFunction = (generator) => (...args) => {
  return new Promise((resolve, reject) => {
    const gen = generator(...args);
    let result = {
      value: undefined,
      done: false,
    };

    try {
      (function f() {
        if (result.value instanceof Promise) {
          result.value.then(
            (value) => {
              result.value = value;
              f();
            },
            (err) => {
              reject(err);
            },
          );
        } else {
          result = gen.next(result.value);
          if (result.done !== false) {
            resolve(result.value);
            return;
          }
          f();
        }
      })();
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = createAsyncFunction;
