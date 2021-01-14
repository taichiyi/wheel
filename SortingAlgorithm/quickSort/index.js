'use strict';

function quickSort(arr) {
  function partition(start, end) {
    const pivot = arr[end];
    let pivotIndex = start - 1;
    for (let i = start; i < end; i++) {
      if (arr[i] < pivot) {
        pivotIndex++;
        [arr[pivotIndex], arr[i]] = [arr[i], arr[pivotIndex]];
      }
    }
    pivotIndex++;
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    return pivotIndex;
  }
  function sort(start, end) {
    if (end - start <= 0) return;
    const pivotIndex = partition(start, end);
    sort(start, pivotIndex - 1);
    sort(pivotIndex + 1, end);
  }
  sort(0, arr.length - 1);
  return arr;
}

module.exports = quickSort;
