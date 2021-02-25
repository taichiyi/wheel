const forOf = require('./index')



test('array forOf test', () => {
  const data = [1, 3, 2, 't', 'c', 'y']
  let tempResult = []

  function compoundStatement(element) {
    tempResult.push(element)
  }
  for (const item of data) compoundStatement(item)
  const hostForResult = tempResult

  tempResult = []

  forOf(data, compoundStatement)
  const myForResult = tempResult

  expect(hostForResult).toEqual(myForResult)
})

test('generator forOf test', () => {
  const data = function* () {
    yield* ['tt', 'cc', 'yy']
  }

  let tempResult = []

  function compoundStatement(element) {
    tempResult.push(element)
  }
  for (const item of data()) compoundStatement(item)
  const hostForResult = tempResult

  tempResult = []

  forOf(data(), compoundStatement)
  const myForResult = tempResult

  expect(hostForResult).toEqual(myForResult)
})
