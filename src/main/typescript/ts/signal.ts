// Interfaces
interface ISignalDispatcher {
  [k: string]: Signal<any>
}

interface ISignalBindingQueue<T> {
  head: ISignalBinding<T>
  length: number
}

interface ISignalBinding<T> {
  f: ISignalHandler<T> // handler
  once: boolean // once
  prev: ISignalBinding<any> // previous
  next: ISignalBinding<any> // next
}

export interface ISignalSymbol<T> extends String {}

export interface ISignalHandler<T> {
  (v: T): void
}

// Util
const Global: any = typeof window !== 'undefined' ? window : (function () { return this }())
function SymbolCreate (o: any) { return Global.Symbol ? Global.Symbol(o) : '@@' + o }
function Put (o: any, k: string, v: any) {
  const defineProperty = Object.defineProperty
  if (defineProperty) {
    defineProperty(o, k, {
      configurable: true,
      enumerable: false,
      value: v,
      writable: true
    })
  } else {
    o[k] = v
  }
}

const $$dispatcher = SymbolCreate('signal')

function GetSignalDispatcher (o: any, create: boolean): ISignalDispatcher {
  let dispatcher = o[$$dispatcher]
  if (!dispatcher && create) {
    dispatcher = {}
    Put(o, $$dispatcher, dispatcher)
  }
  return dispatcher
}

function GetSignal<T> (o: any, s: ISignalSymbol<T>, create: boolean): Signal<T> {
  const dispatcher = GetSignalDispatcher(o, create)
  const key = s as string
  let sig = dispatcher ? dispatcher[key] : null
  if (!sig && create) {
    sig = dispatcher[key] = new Signal()
  }
  return sig
}

function SignalBindingQueuePush<T> (q: ISignalBindingQueue<T>, b: ISignalBinding<T>) {
  const head = q.head
  if (head) {
    const last = head.prev
    // b as last next element
    last.next = b
    b.prev = last
    // b as prev head element
    b.next = head
    head.prev = b
  } else {
    q.head = b
    b.prev = b.next = b
  }
  q.length++
}

function SignalBindingQueueRemove<T> (q: ISignalBindingQueue<T>, b: ISignalBinding<T>) {
  const head = q.head
  const prev = b.prev
  const next = b.next

  prev.next = next
  next.prev = prev

  if (head === b) {
    q.head = next === head ? null : next
  }
  q.length--
}

function SignalBindingQueueFind<T> (q: ISignalBindingQueue<T>, f: ISignalHandler<T>, once: boolean) {
  let returnValue: ISignalBinding<T>
  const head = q.head
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

function ToSignalBindingQueue<T> (sig: Signal<T>): ISignalBindingQueue<T> {
  return sig as any
}

export default class Signal<T> {

  protected head: any = null
  protected length = 0

  size (): number {
    return this.length
  }

  clear (): void {
    this.head = null
    this.length = 0
  }

  has (f: ISignalHandler<T>, once = false): boolean {
    return !!SignalBindingQueueFind(ToSignalBindingQueue(this), f, once)
  }

  add (f: ISignalHandler<T>, once = false): void {
    const bindings = ToSignalBindingQueue(this)
    let binding = SignalBindingQueueFind(bindings, f, once)
    if (!binding) {
      binding = { f: f, next: null, once: once, prev: null }
      SignalBindingQueuePush(bindings, binding)
    }
  }

  delete (f: ISignalHandler<T>, once = false): void {
    const bindings = ToSignalBindingQueue(this)
    const binding = SignalBindingQueueFind(bindings, f, once)
    if (binding) {
      SignalBindingQueueRemove(bindings, binding)
    }
  }

  emit (v: T) {
    const bindings = ToSignalBindingQueue(this)
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

export function signal<T> (s: string): ISignalSymbol<T> {
  if (s === undefined || s === null || s.length === 0) {
    throw TypeError('signal must not be a non-empty string.')
  }
  return s
}

export function has<T> (o: any, s: ISignalSymbol<T>): boolean {
  return count(o, s) !== 0
}

export function count<T> (o: any, s: ISignalSymbol<T>): number {
  const sig = GetSignal(o, s, false)
  return sig ? sig.size() : 0
}

export function connect<T> (o: any, s: ISignalSymbol<T>, f: ISignalHandler<T>, once = false): void {
  const sig = GetSignal(o, s, true)
  sig.add(f, once)
}

export function disconnect<T> (o: any, s: ISignalSymbol<T>, f: ISignalHandler<T>, once = false): void {
  const sig = GetSignal(o, s, false)
  if (sig) {
    sig.delete(f, once)
  }
}

export function emit<T> (o: any, s: ISignalSymbol<T>, v: T): void {
  const sig = GetSignal(o, s, false)
  if (sig) {
    sig.emit(v)
  }
}
