//Util
const Global: any = typeof window !== "undefined" ? window : (function() { return this; }())
const SymbolCreate: (o: any) => any = Global.Symbol || function (o) { return "@@" + o; }
const DescriptorDefault = { value: null, enumerable: false, configurable: true, writable: true }
const DefineProperty = Object.defineProperty || function (o: any, k: string, d: PropertyDescriptor) { o[k] = d.value }
const Put = function (o: any, k: string, v: any) {
  DescriptorDefault.value = v
  DefineProperty(o, k, DescriptorDefault)
}

const $$dispatcher = SymbolCreate("signal")
const GetSignalDispatcher = function (o: any, create: boolean): ISignalDispatcher {
  let dispatcher = o[$$dispatcher]
  if (!dispatcher && create) {
    dispatcher = {}
    Put(o, $$dispatcher, dispatcher)
  }
  return dispatcher
};
const SignalKey = function <T>(sig: ISignal<T>): string {
  return <string> sig;
};
const SignalBindingsFor = function <T>(o: any, sig: ISignal<T>): ISignalBindingQueue {
  let dispatcher = GetSignalDispatcher(o, false);
  return dispatcher ? dispatcher[SignalKey(sig)] : null;
};
const SignalBindingsPush = function (q: ISignalBindingQueue, b: ISignalBinding<any>) {
  let head = q.head;
  if (head) {
    let last = head.prev;
    //b as last next element
    last.next = b;
    b.prev = last;
    //b as prev head element
    b.next = head;
    head.prev = b;
  } else {
    q.head = b;
    b.prev = b.next = b;
  }
  q.length++;
};
const SignalBindingsRemove = function (q: ISignalBindingQueue, b: ISignalBinding<any>) {
  let head = q.head;
  let prev = b.prev;
  let next = b.next;

  prev.next = next;
  next.prev = prev;

  if (head === b) {
    q.head = next === head ? null : next;
  }
  q.length--;
};

export interface ISignal<T> extends String {}

export interface ISignalHandler<T> {
  (v: T): void
}

interface ISignalDispatcher {
  [k: string]: ISignalBindingQueue
}

interface ISignalBindingQueue {
  head: ISignalBinding<any>
  length: number
}

interface ISignalBinding<T> {
  f: ISignalHandler<T> //handler
  once: boolean //once
  prev: ISignalBinding<any>//previous
  next: ISignalBinding<any>//next
}


export function signal<T>(s: string): ISignal<T> {
  if (s === undefined || s === null || s.length === 0) {
    throw TypeError("signal must not be a non-empty string.");
  }
  return s;
}

export function has<T>(o: any, sig: ISignal<T>): boolean {
  return count(o, sig) !== 0;
}

export function count<T>(o: any, sig: ISignal<T>): number {
  let bindings = SignalBindingsFor(o, sig);
  return bindings ? bindings.length : 0;
}

export function connect<T>(o: any, sig: ISignal<T>, f: ISignalHandler<T>, once = false) {
  let dispatcher = GetSignalDispatcher(o, true);
  let key = SignalKey(sig);
  let bindings = dispatcher[key];
  let binding: ISignalBinding<T> = { f: f, once: once, next: null, prev: null };
  if (!bindings) {
    dispatcher[key] = {
      head: binding,
      length: 1
    };
    binding.prev = binding;
    binding.next = binding;
  } else {
    SignalBindingsPush(bindings, binding);
  }
}

export function disconnect<T>(o: any, sig: ISignal<T>, f: ISignalHandler<T>) {
  let bindings = SignalBindingsFor(o, sig);
  if (bindings) {
    let head = bindings.head;
    if (head) {
      let binding = head;
      do {
        if (binding.f === f) {
          SignalBindingsRemove(bindings, binding);
          head = bindings.head;
          if (!head) {
            break;
          }
        }
        binding = binding.next;
      } while (binding !== head)
    }
  }
}

export function emit<T>(o: any, sig: ISignal<T>, v: T) {
  let bindings = SignalBindingsFor(o, sig);
  if (bindings) {
    let head = bindings.head;
    if (head) {
      let binding = head;
      do {
        binding.f(v);
        if (binding.once) {
          SignalBindingsRemove(bindings, binding);
          head = bindings.head;
          if (!head) {
            break;
          }
        }
        binding = binding.next;
      } while (binding !== head)
    }
  }
}
