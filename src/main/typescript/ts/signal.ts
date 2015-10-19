//Interfaces
interface ISignalDispatcher {
  [k: string]: ISignalBindingQueue<any>
}

interface ISignalBindingQueue<T> {
  head: ISignalBinding<T>
  length: number
}

interface ISignalBinding<T> {
  f: ISignalHandler<T> //handler
  once: boolean //once
  prev: ISignalBinding<any>//previous
  next: ISignalBinding<any>//next
}

export interface ISignalSymbol<T> extends String {}

export interface ISignalHandler<T> {
  (v: T): void
}

//Util
const Global: any = typeof window !== "undefined" ? window : (function() { return this; }())
function SymbolCreate(o: any) { return Global.Symbol ? Global.Symbol(o) : "@@" + o }
function Put(o: any, k: string, v: any) {
  let defineProperty = Object.defineProperty
  if (defineProperty) {
    defineProperty(o, k, {
      value: v,
      enumerable: false,
      configurable: true,
      writable: true
    })
  } else {
    o[k] = v
  }
}

const $$dispatcher = SymbolCreate("signal")

function GetSignalDispatcher(o: any, create: boolean): ISignalDispatcher {
  let dispatcher = o[$$dispatcher]
  if (!dispatcher && create) {
    dispatcher = {}
    Put(o, $$dispatcher, dispatcher)
  }
  return dispatcher
}

function GetSignalBindingQueue<T>(o: any, s: ISignalSymbol<T>, create: boolean): ISignalBindingQueue<T> {
  let dispatcher = GetSignalDispatcher(o, create)
  let key = <string> s
  let queue = dispatcher ? dispatcher[key] : null
  if (!queue && create) {
    queue = dispatcher[key] = {
      head: null,
      length: 0
    }
  }
  return queue;
}

function SignalBindingQueuePush<T>(q: ISignalBindingQueue<T>, b: ISignalBinding<T>) {
  let head = q.head
  if (head) {
    let last = head.prev
    //b as last next element
    last.next = b
    b.prev = last
    //b as prev head element
    b.next = head
    head.prev = b
  } else {
    q.head = b
    b.prev = b.next = b
  }
  q.length++
}

function SignalBindingQueueRemove<T>(q: ISignalBindingQueue<T>, b: ISignalBinding<T>) {
  let head = q.head
  let prev = b.prev
  let next = b.next

  prev.next = next
  next.prev = prev

  if (head === b) {
    q.head = next === head ? null : next
  }
  q.length--
}

function SignalBindingQueueFind<T>(q: ISignalBindingQueue<T>, f: ISignalHandler<T>, once: boolean) {
  let returnValue: ISignalBinding<T>
  let head = q.head
  if (head) {
    let binding = head
    do {
      if (binding.f === f && binding.once === once) {
        returnValue = binding
        break
      }
      binding = binding.next
    } while (binding !== head)
  }
  return returnValue
}

export function signal<T>(s: string): ISignalSymbol<T> {
  if (s === undefined || s === null || s.length === 0) {
    throw TypeError("signal must not be a non-empty string.");
  }
  return s;
}

export function has<T>(o: any, s: ISignalSymbol<T>): boolean {
  return count(o, s) !== 0
}

export function count<T>(o: any, s: ISignalSymbol<T>): number {
  let bindings = GetSignalBindingQueue(o, s, false)
  return bindings ? bindings.length : 0
}

export function connect<T>(o: any, s: ISignalSymbol<T>, f: ISignalHandler<T>, once = false): void {
  let bindings = GetSignalBindingQueue(o, s, true)
  let binding: ISignalBinding<T> = SignalBindingQueueFind(bindings, f, once)
  if (!binding) {
    binding = { f: f, once: once, next: null, prev: null }
    SignalBindingQueuePush(bindings, binding)
  }
}

export function disconnect<T>(o: any, s: ISignalSymbol<T>, f: ISignalHandler<T>, once = false): void {
  let bindings = GetSignalBindingQueue(o, s, false)
  if (bindings) {
    let binding = SignalBindingQueueFind(bindings, f, once)
    if (binding) {
      SignalBindingQueueRemove(bindings, binding)
    }
  }
}

export function emit<T>(o: any, s: ISignalSymbol<T>, v: T): void {
  let bindings = GetSignalBindingQueue(o, s, false)
  if (bindings) {
    let head = bindings.head
    if (head) {
      let binding = head
      do {
        binding.f(v)
        if (binding.once) {
          SignalBindingQueueRemove(bindings, binding)
          head = bindings.head
          if (!head) {
            break
          }
        }
        binding = binding.next
      } while (binding !== head)
    }
  }
}
