let createElement;
let isValidElement;
let originalSymbol;
let FunctionComponent;

beforeEach(() => {
  originalSymbol = global.Symbol;
  global.Symbol = undefined;

  ({ createElement, isValidElement } = require('./index'))

  FunctionComponent = () => createElement('div', null, 'test');
});

afterEach(() => {
  global.Symbol = originalSymbol;
});

test('returns a complete element according to spec', () => {
  const element = createElement(FunctionComponent);
  expect(element.type).toBe(FunctionComponent);
  expect(element.key).toBe(null);
  expect(element.ref).toBe(null);
  expect(element.props).toEqual({});
});


test('should warn when `key` is being accessed on a host element', () => {
  const element = createElement('div', { key: '3' });
  expect(element.props).not.toHaveProperty('key');
  expect(element).toHaveProperty('key');
});

test('allows a string to be passed as the type', () => {
  const element = createElement('div');
  expect(element.type).toBe('div');
  expect(element.key).toBe(null);
  expect(element.props).toEqual({});
});

test('returns an immutable element', () => {
  const element = createElement(FunctionComponent);
  expect(() => (element.type = 'div')).not.toThrow();
});

test('does not reuse the original config object', () => {
  const config = { foo: 1 };
  const element = createElement(FunctionComponent, config);
  expect(element.props.foo).toBe(1);
  config.foo = 2;
  expect(element.props.foo).toBe(1);
});

test('does not fail if config has no prototype', () => {
  const config = Object.create(null, { foo: { value: 1, enumerable: true } });
  const element = createElement(FunctionComponent, config);
  expect(element.props.foo).toBe(1);
});

test('extracts key and ref from the config', () => {
  const element = createElement(FunctionComponent, {
    key: '12',
    ref: '34',
    foo: '56',
  });
  expect(element.type).toBe(FunctionComponent);
  expect(element.key).toBe('12');
  expect(element.ref).toBe('34');
  expect(element.props).toEqual({ foo: '56' });
});

test('extracts null key and ref', () => {
  const element = createElement(FunctionComponent, {
    key: null,
    ref: null,
    foo: '12',
  });
  expect(element.type).toBe(FunctionComponent);
  expect(element.key).toBe('null');
  expect(element.ref).toBe(null);
  expect(element.props).toEqual({ foo: '12' });
});

test('ignores undefined key and ref', () => {
  const props = {
    foo: '56',
    key: undefined,
    ref: undefined,
  };
  const element = createElement(FunctionComponent, props);
  expect(element.type).toBe(FunctionComponent);
  expect(element.key).toBe(null);
  expect(element.ref).toBe(null);
  expect(element.props).toEqual({ foo: '56' });
});

test('ignores key and ref warning getters', () => {
  const elementA = createElement('div');
  const elementB = createElement('div', elementA.props);
  expect(elementB.key).toBe(null);
  expect(elementB.ref).toBe(null);
});

test('coerces the key to a string', () => {
  const element = createElement(FunctionComponent, {
    key: 12,
    foo: '56',
  });
  expect(element.type).toBe(FunctionComponent);
  expect(element.key).toBe('12');
  expect(element.ref).toBe(null);
  expect(element.props).toEqual({ foo: '56' });
});

test('merges an additional argument onto the children prop', () => {
  const a = 1;
  const element = createElement(
    FunctionComponent,
    {
      children: 'text',
    },
    a,
  );
  expect(element.props.children).toBe(a);
});

test('does not override children if no rest args are provided', () => {
  const element = createElement(FunctionComponent, {
    children: 'text',
  });
  expect(element.props.children).toBe('text');
});

test('overrides children if null is provided as an argument', () => {
  const element = createElement(
    FunctionComponent,
    {
      children: 'text',
    },
    null,
  );
  expect(element.props.children).toBe(null);
});

test('merges rest arguments onto the children prop in an array', () => {
  const a = 1;
  const b = 2;
  const c = 3;
  const element = createElement(FunctionComponent, null, a, b, c);
  expect(element.props.children).toEqual([1, 2, 3]);
});


// NOTE: We're explicitly not using JSX here. This is intended to test
// classic JS without JSX.
test('identifies valid elements', () => {

  expect(isValidElement(createElement('div'))).toEqual(true);
  expect(isValidElement(createElement(FunctionComponent))).toEqual(true);

  expect(isValidElement(null)).toEqual(false);
  expect(isValidElement(true)).toEqual(false);
  expect(isValidElement({})).toEqual(false);
  expect(isValidElement('string')).toEqual(false);
  expect(isValidElement(FunctionComponent)).toEqual(false);
  expect(isValidElement({ type: 'div', props: {} })).toEqual(false);

  const jsonElement = JSON.stringify(createElement('div'));
  expect(isValidElement(JSON.parse(jsonElement))).toBe(true);
});

// NOTE: We're explicitly not using JSX here. This is intended to test
// classic JS without JSX.
test('is indistinguishable from a plain object', () => {
  const element = createElement('div', { className: 'foo' });
  const object = {};
  expect(element.constructor).toBe(object.constructor);
});
