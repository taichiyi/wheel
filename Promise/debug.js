// const TestPromise = require('./');
const TestPromise = Promise;

const demo = () => {
  let resolve111 = () => {};
  let reject111 = () => {};

  // TestPromise.resolve().then()

  const promiseIns = new TestPromise((resolve, reject) => {
    resolve111 = resolve;
    reject111 = reject;
    // resolve('666')
    // setTimeout(resolve, 300, '666');
    // setTimeout(reject,0,new Error)
  })
    .then(
      (res) => {
        console.log('res1', res);
        return 'res1';
      },
      (err) => {
        console.log('err1', err);
        throw 'err1';
      },
    )
    .catch((reason) => {
      console.log('catch1', reason);
      // throw 'catch1'
    })
    .then(
      (res) => {
        console.log('res2', res);
        return 'res2';
      },
      (err) => {
        console.log('err2', err);
        throw 'err2';
      },
    )
    .catch((reason) => {
      console.log('catch2', reason);
      // throw 'catch2'
    });
  console.log(promiseIns);
  promiseIns
    .then(
      (res) => {
        console.log('res3', res);
        promiseIns.then(
          (res) => {
            console.log('res3-1', res);

            return 'res3-1';
          },
          (err) => {
            console.log('err3-1', err);
          },
        );

        return 'res3';
      },
      (err) => {
        promiseIns.then(
          (res) => {
            console.log('res3-1', res);

            return 'res3-1';
          },
          (err) => {
            console.log('err3-1', err);
          },
        );

        console.log('err3', err);
      },
    )
    .catch((reason) => {
      console.log('catch3', reason);
    })
    .catch((reason) => {
      console.log('catch4', reason);
    });
  promiseIns
    .then(
      (res) => {
        console.log('res4', res);
        return 'res4';
      },
      (err) => {
        console.log('err4', err);
        // throw 'err4'
      },
    )
    .catch((reason) => {
      console.log('catch5', reason);
    });
  // resolve111('kkk');
  reject111('kkk');
};

const demo1 = () => {
  const xx = TestPromise.reject('haha').then(
    (value) => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 300, 'kkkkk');
      });
    },
    (err) => {
      console.log(err);
    },
  );
  console.dir(xx);
  setTimeout(() => {
    console.log(xx);
    console.log(xx);
  }, 400);
};
demo1();
