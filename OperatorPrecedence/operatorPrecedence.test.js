const operatorPrecedence = require('./index')

const answers = [
  [21, 'Grouping', 'n/a'],
  [20, 'Member Access', 'l-t-r'],
  [20, 'Computed Member Access', 'l-t-r'],
  [20, 'new (with argument list)', 'n/a'],
  [20, 'Function Call', 'l-t-r'],
  [20, 'Optional chaining', 'l-t-r'],
  [19, 'new (without argument list)', 'r-t-l'],
  [18, 'Postfix Increment', 'n/a'],
  [18, 'Postfix Decrement', 'n/a'],
  [17, 'Logical NOT', 'r-t-l'],
  [17, 'Bitwise NOT', 'r-t-l'],
  [17, 'Unary plus', 'r-t-l'],
  [17, 'Unary negation', 'r-t-l'],
  [17, 'Prefix Increment', 'r-t-l'],
  [17, 'Prefix Decrement', 'r-t-l'],
  [17, 'typeof', 'r-t-l'],
  [17, 'void', 'r-t-l'],
  [17, 'delete', 'r-t-l'],
  [17, 'await', 'r-t-l'],
  [16, 'Exponentiation', 'r-t-l'],
  [15, 'Multiplication', 'l-t-r'],
  [15, 'Division', 'l-t-r'],
  [15, 'Remainder', 'l-t-r'],
  [14, 'Addition', 'l-t-r'],
  [14, 'Subtraction', 'l-t-r'],
  [13, 'Bitwise Left Shift', 'l-t-r'],
  [13, 'Bitwise Right Shift', 'l-t-r'],
  [13, 'Bitwise Unsigned Right Shift', 'l-t-r'],
  [12, 'Less Than', 'l-t-r'],
  [12, 'Greater Than', 'l-t-r'],
  [12, 'Less Than Or Equal', 'l-t-r'],
  [12, 'Greater Than Or Equal', 'l-t-r'],
  [12, 'in', 'l-t-r'],
  [12, 'instanceof', 'l-t-r'],
  [11, 'Equality', 'l-t-r'],
  [11, 'Inequality', 'l-t-r'],
  [11, 'Strict Equality', 'l-t-r'],
  [11, 'Strict Inequality', 'l-t-r'],
  [10, 'Bitwise AND', 'l-t-r'],
  [9, 'Bitwise XOR', 'l-t-r'],
  [8, 'Bitwise OR', 'l-t-r'],
  [7, 'Logical AND', 'l-t-r'],
  [6, 'Logical OR', 'l-t-r'],
  [5, 'Nullish coalescing', 'l-t-r'],
  [4, 'Ternary ', 'r-t-l'],
  [3, 'Assignment ', 'r-t-l'],
  [2, 'yield', 'r-t-l'],
  [2, 'yield*', 'r-t-l'],
  [1, 'Comma', 'r-t-l'],
]


describe('operator precedence', () => {
  test('is array', () => {
    expect(Array.isArray(operatorPrecedence)).toBe(true)
  })

  const formatting = obj => JSON.stringify(obj).replace(/\s/g, '').toLowerCase()
  const formatAnswers = answers.map(formatting)
  const formatOperatorPrecedence = operatorPrecedence.map(formatting)

  const rightObj = {}
  test.each(formatOperatorPrecedence)(
    '%s',
    (a) => {
      const expectResult = formatAnswers.indexOf(a) !== -1
      expect(expectResult).toBe(true)

      if (expectResult) {
        rightObj[a] = true
      }
    }
  )

  test('total number', () => {
    expect(Object.keys(rightObj).length).toBe(49)
  })
})

