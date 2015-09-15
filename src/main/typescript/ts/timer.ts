//Util
const Global: any = typeof window !== "undefined" ? window : (function() { return this }())
//const Process = Global.process
//const IsNodeJS = {}.toString.call(Process) === "[object process]"
const SetTimeout = Global.setTimeout
const ClearTimeout = Global.clearTimeout
const SetInterval = Global.setInterval
const ClearInterval = Global.clearInterval


const Task = (function () {
  const registry: { [k: number]: any } = {}
  let currentId = 1
  return {
    create(f: any) {
      let id = currentId
      currentId += 1
      registry[id] = f
      return id
    },
    remove(id: number) {
      if (registry[id] !== undefined) {
        delete registry[id]
      }
    },
    run(id: number) {
      let task = registry[id]
      if (task) {
        delete registry[id]
        task()
      }
    }
  }
}())
/*
const PostMessageTimer = (function () {
  const PREFIX = "setImmediate:" + Math.random() + ":"


  function onGlobalMessage(event) {
    if (
      event.source === Global &&
      typeof event.data === "string" &&
      event.data.indexOf(PREFIX) === 0
    ) {
      //runIfPresent(+event.data.slice(PREFIX.length))
    }
  }

  if (Global.addEventListener) {
    Global.addEventListener("message", onGlobalMessage, false);
  } else {
    Global.attachEvent("onmessage", onGlobalMessage);
  }

  return {
    setImmediate(f: any): number {
      let id = createTask(f)
      //addFromSetImmediateArguments(arguments)
      Global.postMessage(PREFIX + id, "*")
      return id
    },
    clearImmediate(id: number): void {

    }
  }
}())*/

const SetImmediate: (f: any) => number =
  Global.setImmediate ? Global.setImmediate :
  function (f: any): number { return SetTimeout(f, 0) }
const ClearImmediate =
  Global.clearImmediate ? Global.clearImmediate :
  function (id: number): void { return ClearTimeout(id) }

/**
 * Calls a function ```f(...args)``` after an undetermined delay
 *
 * @param fn the function that will be called
 * @param milliseconds the delay between two calls
 * @return the id of the task
 */
export function setTimeout<A, B, C, D, E, F>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => void, ms: number, a: A, b: B, c: C, d: D, e: E, f: F): number
export function setTimeout<A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E) => void, ms: number, a: A, b: B, c: C, d: D, e: E): number
export function setTimeout<A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => void, ms: number, a: A, b: B, c: C, d: D): number
export function setTimeout<A, B, C>(fn: (a: A, b: B, c: C) => void, ms: number, a: A, b: B, c: C): number
export function setTimeout<A, B>(fn: (a: A, b: B) => void, ms: number, a: A, b: B): number
export function setTimeout<A>(fn: (a: A) => void, ms: number, a: A): number
export function setTimeout<A>(fn: () => void, ms: number): number
export function setTimeout(fn: Function, ms: number = 0, ...args: any[]): number {
  //TODO: add more cardinalities
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
export function setInterval(f: () => void, milliseconds: number = 0, ...args: any[]): number {
  return SetInterval(args.length === 0 ? f : () => { f.apply(null, args) }, milliseconds)
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
export function setImmediate(f: () => void, ...args: any[]): number {
  //TODO: add more cardinalities
  return SetImmediate(args.length === 0 ? f : () => { f.apply(null, args) })
}

/**
 * Cancel immediate task
 *
 * @param id The id of the task
 */
export function clearImmediate(id: number): void {
  ClearImmediate(id)
}
