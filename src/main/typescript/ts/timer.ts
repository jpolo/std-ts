//Util
const __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const __setTimeout = __global.setTimeout
const __clearTimeout = __global.clearTimeout
const __setInterval = __global.setInterval
const __clearInterval = __global.clearInterval
const __setImmediate: (f: any) => number = __global.setImmediate || function (f: any): number { return __setTimeout(f, 0); }
const __clearImmediate = __global.clearImmediate || function (id: number): void { return __clearTimeout(id); }

/**
 * Calls a function ```f(...args)``` after an undetermined delay
 *
 * @param f the function that will be called
 * @param milliseconds the delay between two calls
 * @returns the id of the task
 */
export function setTimeout<A, B, C, D>(f: (a: A, b: B, c: C, d: D) => void, ms: number, a: A, b: B, c: C, d: D): number
export function setTimeout<A, B, C>(f: (a: A, b: B, c: C) => void, ms: number, a: A, b: B, c: C): number
export function setTimeout<A, B>(f: (a: A, b: B) => void, ms: number, a: A, b: B): number
export function setTimeout<A>(f: (a: A) => void, ms: number, a: A): number
export function setTimeout<A>(f: () => void, ms: number): number
export function setTimeout(f: Function, ms: number = 0, ...args: any[]): number {
  //TODO: add more cardinalities
  return __setTimeout(args.length === 0 ? f : () => { f.apply(null, args) }, ms)
}

/**
 * Cancel a task previously created using ```setTimeout()```
 *
 * @param id The id of the task
 */
export function clearTimeout(id: number): void {
  __clearTimeout(id)
}

/**
 * Calls repeatedly a function ```f(...args)``` with a delay between each calls
 *
 * @param f the function that will be called
 * @param milliseconds the delay between two calls
 * @returns the id of the task
 */
export function setInterval(f: () => void, milliseconds: number = 0, ...args: any[]): number {
  return __setInterval(args.length === 0 ? f : () => { f.apply(null, args) }, milliseconds)
}

/**
 * Cancel interval task
 *
 * @param id The id of the task
 */
export function clearInterval(id: number): void {
  __clearInterval(id)
}

/**
 * Add an immediate task
 *
 * @param f the function that will be called
 * @returns the id of the task
 */
export function setImmediate(f: () => void, ...args: any[]): number {
  //TODO: add more cardinalities
  return __setImmediate(args.length === 0 ? f : () => { f.apply(null, args) })
}

/**
 * Cancel immediate task
 *
 * @param id The id of the task
 */
export function clearImmediate(id: number): void {
  __clearImmediate(id)
}
