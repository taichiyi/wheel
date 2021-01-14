const quickSort = require('./quickSort');
const bubbleSort = require('./bubbleSort');
const insertSort = require('./insertSort');
const selectSort = require('./selectSort');
const shellSort = require('./shellSort');

const data = [
  [1],
  [1, 1],
  [1, 1, 1],
  [3, 2, 1],
  [3, 2],
  [2, 1],
  [3, 1],
  [3, 1, 1],
  [3, 3, 1],
  [1, 2, 3],
  [1, 2],
  [1, 3],
  [1, 1, 3],
  [1, 1, 3],
  '1'
    .repeat(1000)
    .split('')
    .map(() => (Math.random() * 1000) | 0),
];
const testSort = (data) => (sort) => {
  data.forEach((arr) => {
    test(`name:${sort.name} length:${arr.length} data:${arr}`, () => {
      expect(JSON.stringify(sort([...arr]))).toBe(
        JSON.stringify([...arr].sort((a, b) => a - b)),
      );
    });
  });
};

const testSortData = testSort(data);

testSortData(quickSort);
testSortData(bubbleSort);
testSortData(insertSort);
testSortData(selectSort);
testSortData(shellSort);
