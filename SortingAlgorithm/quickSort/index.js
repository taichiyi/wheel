'use strict';
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
var quickSort1 = function(nums) {
  function sort(nums, l, r) {
    if (l >= r) {
      return nums;
    }
    let i = l - 1, j = r + 1;
    const mid = nums[(l + r) >> 1];
    while (i < j) {
      while (nums[++i] < mid) {};
      while (nums[--j] > mid) {};
      if (i < j) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
    }
    sort(nums, l, j);
    sort(nums, j + 1, r);
    return nums;
  }
  return sort(nums, 0, nums.length - 1);
}
module.exports = quickSort
