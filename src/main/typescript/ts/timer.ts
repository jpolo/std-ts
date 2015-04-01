module timer {
  
  //Util
  var __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
  var __setTimeout = __global.setTimeout;
  var __clearTimeout = __global.clearTimeout;
  var __setInterval = __global.setInterval;
  var __clearInterval = __global.clearInterval;
  var __setImmediate = __global.setImmediate;
  var __clearImmediate = __global.clearImmediate;
  
  //Compat
  if (!__setImmediate) {
    __setImmediate = function (f) { return __setTimeout(f, 0); };
    __clearImmediate = function (id) { return __clearTimeout(id); };
  }
  
  
  export function setTimeout(f: () => void, milliseconds: number = 0): number {
    return __setTimeout(f, milliseconds);
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
  

}
export = timer;