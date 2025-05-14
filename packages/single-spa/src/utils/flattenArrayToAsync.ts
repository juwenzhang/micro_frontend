import { type FnsType } from "@/types/fnsType"

export function isArray<T>(data: T): boolean {
  return Array.isArray(data)
}

/**
 * realise let multi async funcs (type: Array) to single async func
 * use compose func to realise basic func 
 */
export function composeFunc<T extends Function>(fns: T) {  
  const _fns = (isArray<T>(fns) ? fns: [fns]) as T[];
  return function(...props: Parameters<FnsType[0]>) { 
    return _fns.reduce((preFn, curFn: T) => 
      preFn.then(() => curFn(...props)), Promise.resolve());
  };
}

/**
 * realise let multi async funcs (type: Array) to single async func
 * use pipe func to realise basic func 
 */
export function pipeFunc<T extends Function>(fns: T) {  
  const _fns = (isArray<T>(fns) ? fns: [fns]) as T[];
  return function(...props: Parameters<FnsType[0]>) { 
    return _fns.reduceRight((preFn, curFn: T) => 
      preFn.then(() => curFn(...props)), Promise.resolve());
  };
}

// study FP: compose func or pipe func
