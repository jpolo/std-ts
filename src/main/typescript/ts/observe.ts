module observe {
  
  var O = (<any>Object)
  var __observe = O.observe;
  var __unobserve = O.unobserve;
  var __notifier: <T>(o: T) => INotifier<T> = O.getNotifier;
  
  //Compat
  if (!__observe) {
    
    var __map: <K, V>() => Map<K, V> = typeof Map !== "undefined" ? 
      function () { return new Map(); } : 
      <any> function () {
        var _keys = [];
        var _values = [];
        
        return {
          has: function (k) {
            return _keys.indexOf(k) !== -1;
          },
          get: function (k) {
            var i = _keys.indexOf(k);
            var r;
            if (i !== -1) {
              r = _values[i];
            }
            return r;
          },
          set: function (k, v) {
            var i = _keys.indexOf(k);
            if (i !== -1) {
              i = _keys.length;
              _keys[i] = k;
              _values[i] = v;
            } else {
              _values[i] = v;
            }
          },
          delete: function (k) {
            var i = _keys.indexOf(k);
            if (i !== -1) {
              _keys.splice(i, 1);
              _values.splice(i, 1);
            }
          }
        };
      };
    var __weakMap: <K, V>() => WeakMap<K, V> = typeof WeakMap !== "undefined" ? 
      function () { return new WeakMap(); } :
      <any>__map;
    
    var __notifiers = __weakMap<any, INotifier<any>>();
    
    
    __notifier = function <T>(o: T): INotifier<T> {
      var notifier = __notifiers.get(o);
      if (notifier === undefined) {
        __notifiers.set(o, notifier = null/*new Notifier(o)*/);
      }
      return notifier;
    };
    
    __observe = function (o, callback, accept) {
      //__validateArguments(o, callback, accept);
    };
    
    __unobserve = function (o, callback) {
      //__validateArguments(o, callback);
      var notifier = __notifiers.get(o);
      if (notifier) {
        notifier.removeListener(callback);
        if (notifier.listeners().length === 0) {
          __notifiers.delete(o);
        }
      }
    };
  }
  

  interface INotifier<T> {
    
    notify(c: IChangeRecord<T>)
    addListener(callback: (c: IChangeRecord<T>[]) => void, accept?: string[])
    removeListener(callback: (c: IChangeRecord<T>[]) => void)
    listeners(): Array<(c: IChangeRecord<T>[]) => void>
    
  }
  
  
  interface IChangeRecord<T> {
    type: string
    object: T
    name: string
    oldValue: any
  }
  
  export function add<T>(o: T, callback: (a: IChangeRecord<T>[]) => void, accept?: string[]) {
    return __observe(o, callback, accept);
  }
  
  export function remove<T>(o: T, callback: (a: IChangeRecord<T>[]) => void) {
    return __unobserve(o, callback);
  }
  
  export function notifier<T>(o: T): INotifier<T> {
    return __notifier(o);
  }
  
}
export = observe;