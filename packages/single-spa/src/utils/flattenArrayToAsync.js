/**
 * check data is Array
 * @param {any} data 
 */
export function isArray(data) {
  return Array.isArray(data)
}

/**
 * realise let multi async funcs (type: Array) to single async func
 * use compose func to realise basic func
 * @param {Array|Function} fns 
 */ 
export function composeFunc(fns) {
  fns = isArray(fns) ? fns : [fns]
  return function(...props) {
    return fns.reduce((preFn, curFn) => preFn.then(
      () => curFn(...props)), 
      Promise.resolve()
    )
  }
}

/**
 * realise let multi async funcs (type: Array) to single async func
 * use pipe func to realise basic func
 * @param {Array|Function} fns 
 */
export function pipeFunc (fns) {
  fns = isArray(fns) ? fns : [fns]
  return function(...props) {
    return fns.reduceRight((preFn, curFn) => preFn.then(
      () => curFn(...props)), 
      Promise.resolve()
    )
  }
}

// study FP: compose func or pipe func
