module timer {
  var __setTimeout = window.setTimeout
  var __clearTimeout = window.clearTimeout
  var __setInterval = window.setInterval
  var __clearInterval = window.clearInterval
  var __setImmediate: any = window.setImmediate || __setTimeout
  var __clearImmediate: any = window.clearImmediate || __clearTimeout
  
  export function setTimeout(f: () => any, milliseconds: number = 0): number {
    return __setTimeout(f, milliseconds)
  }
  
  export function clearTimeout(id: number): void {
    return __clearTimeout(id)
  }
  
  export function setInterval(f: () => any, milliseconds: number = 0): number {
    return __setInterval(f, milliseconds)
  }
  
  export function clearInterval(id: number): void {
    return __clearInterval(id)
  }
  
  export function setImmediate(f: () => any): number {
    return __setImmediate(f)
  }
  
  export function clearImmediate(id: number): void {
    return __clearImmediate(id)
  }
  

}
export = timer