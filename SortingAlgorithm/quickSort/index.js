'use strict';

module.exports=function quickSort(arr) {
  function sort(start,end){
    if(end-start<=0)return
    const pivotIndex = partition(start,end)
    sort(start,pivotIndex-1)
    sort(pivotIndex,end)
  }
  sort(0,arr.length-1)
  return arr
}

