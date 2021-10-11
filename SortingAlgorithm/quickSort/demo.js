'use strict';

function quickSort1(arr) {
  function partition(left, right) {
    const pivot = arr[right];
    let pivotIndex = left - 1;
    for (let i = left; i < right; i++) {
      if (arr[i] < pivot) {
        pivotIndex++;
        [arr[pivotIndex], arr[i]] = [arr[i], arr[pivotIndex]];
      }
    }
    pivotIndex++;
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    return pivotIndex;
  }
  function sort(left, right) {
    if (right - left <= 0) return;
    const pivotIndex = partition(left, right);
    sort(left, pivotIndex - 1);
    sort(pivotIndex + 1, right);
  }
  sort(0, arr.length - 1);
  return arr;
}

function quickSort(arr) {
  const getPivotIndex = (left, right) => {
    const pivot = arr[right]
    let pivotIndex = left - 1
    for (let i = left; i <= right; i++) {
      if (arr[i] <= pivot) {
        pivotIndex++;
        if (pivotIndex !== i) {
          [arr[pivotIndex], arr[i]] = [arr[i], arr[pivotIndex]]
        }
      }
    }
    return pivotIndex
  }
  const partition = (left, right) => {
    if (right - left > 0) {
      const pivotIndex = getPivotIndex(left, right)
      partition(left, pivotIndex - 1)
      partition(pivotIndex + 1, right)
    }
  }
  partition(0, arr.length - 1)
  return arr;
}
module.exports = quickSort;
