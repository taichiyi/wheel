'use strict';

function shellSort(arr) {
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i++) {
      for (let j = i - gap; j >= 0 && arr[j] > arr[j + gap]; j -= gap) {
        [arr[j], arr[j + gap]] = [arr[j + gap], arr[j]]
      }
    }
  }
  return arr

  // 低效
  // for (
  //   let gap = Math.floor(arr.length / 2);
  //   gap > 0;
  //   gap = Math.floor(gap / 2)
  // ) {
  //   for (let i = 0; i < arr.length-1; i++) {
  //     for (let j = i + gap; j > 0; j -= gap) {
  //       if (arr[j] < arr[j - gap]) {
  //         [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]];
  //       }
  //     }
  //   }
  // }
  // return arr;
}

module.exports = shellSort;
