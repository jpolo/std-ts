//Util
const __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const __setTimeout = __global.setTimeout;
const __clearTimeout = __global.clearTimeout;
const __setInterval = __global.setInterval;
const __clearInterval = __global.clearInterval;
const __setImmediate: (f: any) => number = __global.setImmediate || function (f: any): number { return __setTimeout(f, 0); };
const __clearImmediate = __global.clearImmediate || function (id: number): void { return __clearTimeout(id); };


export function setTimeout<A>(f: (a: A) => void, ms: number, a: A): number
export function setTimeout<A>(f: () => void, ms: number): number
export function setTimeout(f: Function, ms: number = 0): number {
  let delayedFn = f
  let argc = arguments.length
  if (argc >= 3) {
    let args = []
    for (var i = 3; i < argc; i++) {
      args[i] = arguments[i];
    }
    delayedFn = function () {
      f.apply(null, args)
    }
  }
  return __setTimeout(delayedFn, ms);
}

export function clearTimeout(id: number): void {
  return __clearTimeout(id);
}

export function setInterval(f: () => void, milliseconds: number = 0): number {
  return __setInterval(f, milliseconds);
}

export function clearInterval(id: number): void {
  return __clearInterval(id);
}

export function setImmediate(f: () => void): number {
  return __setImmediate(f);
}

export function clearImmediate(id: number): void {
  return __clearImmediate(id);
}
