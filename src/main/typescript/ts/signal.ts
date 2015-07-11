//Util
const __global: any = typeof window !== "undefined" ? window : (function() { return this; }());
const __sym: (o: any) => any = __global.Symbol || function (o) { return "@@" + o; };
const __descriptor = { value: null, enumerable: false, configurable: true, writable: true };
const __def = Object.defineProperty || function (o, k, d) { o[k] = d.value; };
const __set = function (o, k, v) {
  __descriptor.value = v
  __def(o, k, __descriptor);
};


const $$dispatcher = __sym("signal");
const __signalDispatcher = function (o: any, create: boolean): { [k: string]: ISignalBindingQueue } {
  var dispatcher = o[$$dispatcher];
  if (!dispatcher && create) {
    dispatcher = {};
    __set(o, $$dispatcher, dispatcher);
  }
  return dispatcher;
};
const __signalKey = function <T>(sig: ISignal<T>): string {
  return <string> sig;
};
const __signalBindingsFor = function <T>(o: any, sig: ISignal<T>): ISignalBindingQueue {
  var dispatcher = __signalDispatcher(o, false);
  return dispatcher ? dispatcher[__signalKey(sig)] : null;
}
const __queuePush = function (q: ISignalBindingQueue, b: ISignalBinding<any>) {
  var head = q.head;
  if (head) {
    var last = head.prev;
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
const __queueRemove = function (q: ISignalBindingQueue, b: ISignalBinding<any>) {
  var head = q.head;
  var prev = b.prev;
  var next = b.next;
  
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
  var bindings = __signalBindingsFor(o, sig);
  return bindings ? bindings.length : 0;
}

export function connect<T>(o: any, sig: ISignal<T>, f: ISignalHandler<T>, once = false) {
  var dispatcher = __signalDispatcher(o, true);
  var key = __signalKey(sig);
  var bindings = dispatcher[key];
  var binding = { f: f, once: once, next: null, prev: null };
  if (!bindings) {
    dispatcher[key] = {
      head: binding,
      length: 1
    };
    binding.prev = binding;
    binding.next = binding;
  } else {
    __queuePush(bindings, binding);
  }
}

export function disconnect<T>(o: any, sig: ISignal<T>, f: ISignalHandler<T>) {
  var bindings = __signalBindingsFor(o, sig);
  if (bindings) {
    var head = bindings.head;
    if (head) {
      var binding = head;
      do {
        if (binding.f === f) {
          __queueRemove(bindings, binding);
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
  var bindings = __signalBindingsFor(o, sig);
  if (bindings) {
    var head = bindings.head;
    if (head) {
      var binding = head;
      do {
        binding.f(v);
        if (binding.once) {
          __queueRemove(bindings, binding);
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
