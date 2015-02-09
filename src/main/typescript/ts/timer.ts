module timer {
  var __global: Window = (new Function("return this;")).call(null);
  var __setTimeout = __global.setTimeout;
  var __clearTimeout = __global.clearTimeout;
  var __setInterval = __global.setInterval;
  var __clearInterval = __global.clearInterval;
  var __setImmediate: any = __global.setImmediate || __setTimeout;
  var __clearImmediate: any = __global.clearImmediate || __clearTimeout;
  
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