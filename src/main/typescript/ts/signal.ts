module signal {
  //Constants

  
  //Util
  //var __isArray = Array.isArray;
  //var __isFunction = function (o) { return typeof o === "function"; };
  var __global: any = (new Function("return this;")).call(null);
  var __sym: (o: any) => any = typeof __global.Symbol != "undefined" ? __global.Symbol : function (o) { return "@@" + o; };
  var $$dispatcher = __sym("signal");
  
  var __signalDispatcher = function (o: any, create: boolean): { [k: string]: ISignalBindingQueue } {
    var dispatcher = o[$$dispatcher];
    if (!dispatcher && create) {
      dispatcher = o[$$dispatcher] = {};
    }
    return dispatcher;
  };
  var __signalBinding = function <T>(f: ISignalHandler<T>, once: boolean): ISignalBinding<T> {
    return { f: f, once: once, next: null, prev: null };
  };
  var __signalKey = function <T>(sig: ISignal<T>): string {
    return <string> sig;
  };
  var __qPush = function (q: ISignalBindingQueue, b: ISignalBinding<any>) {
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
  var __qRemove = function (q: ISignalBindingQueue, b: ISignalBinding<any>) {
    var head = q.head;
    var prev = b.prev;
    var next = b.next;
    
    prev.next = next;
    next.prev = prev;
    
    if (head === b) {
      if (head.next === head) {
        q.head = null;
      } else {
        q.head = next;
      }
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
    var returnValue = 0;
    var dispatcher = __signalDispatcher(o, false);
    if (dispatcher) {
      var key = __signalKey(sig);
      var bindings = dispatcher[key];
      if (bindings) {
        returnValue = bindings.length;
      }
    }
    return returnValue;
  }
  
  export function connect<T>(o: any, sig: ISignal<T>, f: ISignalHandler<T>, once = false) {
    var dispatcher = __signalDispatcher(o, true);
    var key = __signalKey(sig);
    var bindings = dispatcher[key];
    var binding = __signalBinding(f, once);
    if (!bindings) {
      dispatcher[key] = {
        head: binding,
        length: 1
      };
      binding.prev = binding;
      binding.next = binding;
    } else {
      __qPush(bindings, binding);
    }
  }
  
  export function disconnect<T>(o: any, sig: ISignal<T>, f: ISignalHandler<T>) {
    var dispatcher = __signalDispatcher(o, false);
    if (dispatcher) {
      var key = __signalKey(sig);
      var bindings = dispatcher[key];
      if (bindings) {
        var head = bindings.head;
        if (head) {
          var binding = head;
          do {
            if (binding.f === f) {
              __qRemove(bindings, binding);
            }
            binding = binding.next;
          } while (binding !== head)
        }
      }
    }
  }
  
  export function emit<T>(o: any, sig: ISignal<T>, v: T) {
    var dispatcher = __signalDispatcher(o, false);
    if (dispatcher) {
      var key = __signalKey(sig);
      var bindings = dispatcher[key];
      if (bindings) {
        var head = bindings.head;
        if (head) {
          var binding = head;
          do {
            binding.f(v);
            if (binding.once) {
              __qRemove(bindings, binding);
            }
            binding = binding.next;
          } while (binding !== head)
        }
      }
    }
  }

}
export = signal