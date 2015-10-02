//Util
const Global: any = typeof window !== "undefined" ? window : (function() { return this }())
//const Process = Global.process
//const IsNodeJS = {}.toString.call(Process) === "[object process]"
const SetTimeout = function (f: Function, ms: number) { return Global.setTimeout(f, ms) }
const ClearTimeout = function (id: number) { return Global.clearTimeout(id) }
const SetInterval = function (f: Function, ms: number) { return Global.setInterval(f, ms) }
const ClearInterval = function (id: number) { return Global.clearInterval(id) }

//Task
let TaskCurrentId = 1
const TaskRegistry: { [k: number]: any } = {}
const TaskGenerateId = function () {
  let returnValue = TaskCurrentId
  TaskCurrentId += 1
  return TaskCurrentId
}
const TaskCreate = function (f: any): number {
  let id = TaskGenerateId()
  TaskRegistry[id] = f
  return id
}
const TaskRemove = function (id: number): void {
  delete TaskRegistry[id]
}
const TaskRun = function (id: number) {
  let task = TaskRegistry[id]
  if (task) {
    delete TaskRegistry[id]
    task()
  }
}
const SetImmediate: (f: any) => number =
  Global.setImmediate ? Global.setImmediate :
  Global.postMessage ? (function () {
    const PREFIX = "setImmediate:" + Math.random() + ":"
    const PREFIX_LENGTH = PREFIX.length

    function onGlobalMessage(event) {
      let { source, data } = event
      if (
        source === Global &&
        typeof data === "string" &&
        data.indexOf(PREFIX) === 0
      ) {
        TaskRun(+data.slice(PREFIX_LENGTH))
      }
    }

    function setImmediate(f: any) {
      let id = TaskCreate(f)
      Global.postMessage(PREFIX + id, "*")
      return id
    }

    if (Global.addEventListener) {
      Global.addEventListener("message", onGlobalMessage, false)
    } else {
      Global.attachEvent("onmessage", onGlobalMessage)
    }
    return setImmediate
  }()) :
  function setImmediate(f: any): number { return SetTimeout(f, 0) }
const ClearImmediate =
  Global.clearImmediate ? Global.clearImmediate :
  Global.postMessage ? function (id: number) { TaskRemove(id) } :
  function (id: number): void { return ClearTimeout(id) }


export interface ITimerModule {
  setTimeout: typeof setTimeout
  clearTimeout: typeof clearTimeout
  setInterval: typeof setInterval
  clearInterval: typeof clearInterval
  setImmediate: typeof setImmediate
  clearImmediate: typeof clearImmediate
}

/**
 * Calls a function ```f(...args)``` after an undetermined delay
 *
 * @param fn the function that will be called
 * @param milliseconds the delay between two calls
 * @return the id of the task
 */
export function setTimeout<A, B, C, D, E, F, G, H, I>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): number
export function setTimeout<A, B, C, D, E, F, G, H>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): number
export function setTimeout<A, B, C, D, E, F, G>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F, g: G): number
export function setTimeout<A, B, C, D, E, F>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F): number
export function setTimeout<A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E) => void, ms: number, a: A, b: B, c: C, d: D, e: E): number
export function setTimeout<A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => void, ms: number, a: A, b: B, c: C, d: D): number
export function setTimeout<A, B, C>(fn: (a: A, b: B, c: C) => void, ms: number, a: A, b: B, c: C): number
export function setTimeout<A, B>(fn: (a: A, b: B) => void, ms: number, a: A, b: B): number
export function setTimeout<A>(fn: (a: A) => void, ms: number, a: A): number
export function setTimeout<A>(fn: () => void, ms?: number): number
export function setTimeout(fn: Function, ms: number = 0, ...args: any[]): number {
  return SetTimeout(args.length === 0 ? fn : () => { fn.apply(null, args) }, ms)
}

/**
 * Cancel a task previously created using ```setTimeout()```
 *
 * @param id The id of the task
 */
export function clearTimeout(id: number): void {
  ClearTimeout(id)
}

/**
 * Calls repeatedly a function ```f(...args)``` with a delay between each calls
 *
 * @param f the function that will be called
 * @param milliseconds the delay between two calls
 * @return the id of the task
 */
export function setInterval<A, B, C, D, E, F, G, H, I>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): number
export function setInterval<A, B, C, D, E, F, G, H>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): number
export function setInterval<A, B, C, D, E, F, G>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F, g: G): number
export function setInterval<A, B, C, D, E, F>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F): number
export function setInterval<A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E) => void, ms: number, a: A, b: B, c: C, d: D, e: E): number
export function setInterval<A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => void, ms: number, a: A, b: B, c: C, d: D): number
export function setInterval<A, B, C>(fn: (a: A, b: B, c: C) => void, ms: number, a: A, b: B, c: C): number
export function setInterval<A, B>(fn: (a: A, b: B) => void, ms: number, a: A, b: B): number
export function setInterval<A>(fn: (a: A) => void, ms: number, a: A): number
export function setInterval<A>(fn: () => void, ms: number): number
export function setInterval(fn: Function, ms: number = 0, ...args: any[]): number {
  return SetInterval(args.length === 0 ? fn : () => { fn.apply(null, args) }, ms)
}

/**
 * Cancel interval task
 *
 * @param id The id of the task
 */
export function clearInterval(id: number): void {
  ClearInterval(id)
}

/**
 * Add an immediate task
 *
 * @param f the function that will be called
 * @return the id of the task
 */
export function setImmediate<A, B, C, D, E, F, G, H, I>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => void, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): number
export function setImmediate<A, B, C, D, E, F, G, H>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => void, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): number
export function setImmediate<A, B, C, D, E, F, G>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => void, a: A, b: B, c: C, d: D, e: E, f: F, g: G): number
export function setImmediate<A, B, C, D, E, F>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => void, a: A, b: B, c: C, d: D, e: E, f: F): number
export function setImmediate<A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E) => void, a: A, b: B, c: C, d: D, e: E): number
export function setImmediate<A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => void, a: A, b: B, c: C, d: D): number
export function setImmediate<A, B, C>(fn: (a: A, b: B, c: C) => void, a: A, b: B, c: C): number
export function setImmediate<A, B>(fn: (a: A, b: B) => void, a: A, b: B): number
export function setImmediate<A>(fn: (a: A) => void, a: A): number
export function setImmediate<A>(fn: () => void): number
export function setImmediate(fn: () => void, ...args: any[]): number {
  return SetImmediate(args.length === 0 ? fn : () => { fn.apply(null, args) })
}

/**
 * Cancel immediate task
 *
 * @param id The id of the task
 */
export function clearImmediate(id: number): void {
  ClearImmediate(id)
}
