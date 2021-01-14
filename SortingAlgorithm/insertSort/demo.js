'use strict';

function insertSort(arr) {
  const gap = 1;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + gap; j >= 0; j -= gap) {
      if (arr[j] < arr[j - gap]) {
        [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]];
      }
    }
  }
  return arr;
}

module.exports = insertSort;
