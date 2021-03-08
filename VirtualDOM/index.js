const RESERVED_PROPS = {
  key: true,
  ref: true,
}

const ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for
  ? Symbol.for('element')
  : 0xeac7

const isValidElement = (obj) =>
  typeof obj === 'object' &&
  obj !== null &&
  obj.$$typeof === ELEMENT_TYPE

const createElementImpl = (type, key, ref, props) => ({
  $$typeof: ELEMENT_TYPE,
  type,
  key,
  ref,
  props,
})

const createElement = (type, config, ...children) => {
  let ref = null
  let key = null
  const props = {}

  if (config != null) {
    if (config.ref !== undefined) ref = config.ref
    if (config.key !== undefined) key = '' + config.key

    for (const propName in config) {
      if (
        Object.prototype.hasOwnProperty.call(config, propName) === false ||
        RESERVED_PROPS.hasOwnProperty(propName)
      ) continue;
      props[propName] = config[propName]
    }
  }

  if (children.length === 1) {
    props.children = children[0]
  } else if (children.length > 1) {
    props.children = children
  }

  return createElementImpl(type, key, ref, props)
}

module.exports = {
  createElement,
  isValidElement
}
