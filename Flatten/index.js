const flatten1 = (arr) => {
  return arr.reduce((acc, curr) => {
    if (Array.isArray(curr)) {
      return acc.concat(flatten(curr));
    } else {
      acc.push(curr);
      return acc;
    }
  }, []);
};
const flatten2 = (arr) => {
  return arr.reduce((acc, curr) => {
    const newCurr = Array.isArray(curr) ? flatten(curr) : [curr];
    return acc.concat(newCurr);
  }, []);
};
const flatten = (arr) => {
  arr.reverse();
  let curr;
  const result = [];
  while ((curr = arr.pop())) {
    if (Array.isArray(curr)) {
      for (let i = curr.length - 1; i >= 0; i--) {
        arr.push(curr[i]);
      }
    } else {
      result.push(curr);
    }
  }
  return result;
};

console.log(
  flatten([1, 2, 3]),
  flatten([1, 2, [[3], 4]]),
  flatten([1, [2, [3, [4]], 5]]),
);
