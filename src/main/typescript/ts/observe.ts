module observe {
  //ECMA spec is here :
  // https://arv.github.io/ecmascript-object-observe
  
  
  //Constant
  var ES_COMPAT = 3;
  
  export var ADD = "add";
  export var UPDATE = "update";
  export var DELETE = "delete";
  export var RECONFIGURE = "reconfigure";
  export var SET_PROTOTYPE = "setPrototype";
  export var PREVENT_EXTENSIONS = "preventExtensions";

  var ALL = [ADD, UPDATE, DELETE, RECONFIGURE, SET_PROTOTYPE, PREVENT_EXTENSIONS];
  
  //Util
  var __global: any = typeof window !== "undefined" ? window : (function() { return this; }());
  var O = (<any>Object);
  var __observerDeliver = O.deliverChangeRecords;
  var __observe = O.observe;
  var __unobserve = O.unobserve;
  var __notifier: <T>(o: T) => INotifier<T> = O.getNotifier;
  var __setImmediate = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
  var __clearImmediate = typeof clearImmediate !== "undefined" ? clearImmediate : clearTimeout;
  var __sym: (o: string) => any = __global.Symbol;
  var __map: <K, V>() => Map<K, V>;
  var __weakMap: <K, V>() => WeakMap<K, V>;
  var __isFrozen = Object.isFrozen;

  //Compat
  if (ES_COMPAT <= 3) {
    __isFrozen = __isFrozen || function (o) { return false; };
  }
  
  if (ES_COMPAT <= 5) {
    __sym = __sym || function (s: string) { return "@@" + s; };
    __map = typeof Map !== "undefined" ? 
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
    __weakMap = typeof WeakMap !== "undefined" ? 
      function () { return new WeakMap(); } :
      <any>__map;
  }
  
  if (!__observe) {
    var __option = function (o, name) {
      return o ? o[name] : undefined;
    };
    var __assertObject = function (o: any) {
      if (typeof o !== "object" || o === null) {
        throw new TypeError(o + " must be a object");
      }
    };
    var __assertNotFrozen = function (o: any) {
      if (__isFrozen) {
        throw new TypeError(o + " must not be frozen");
      }
    };
    var __assertCallable = function (o: any) {
      if (typeof o !== "function") {
        throw new TypeError(o + " must be a callable");
      }
    };
    var $$notifier = __sym("notifier");
    var $$target = __sym("target");
    var $$pendingChangeRecords = __sym("pendingChangeRecords");
    var $$changeObservers = __sym("changeObservers");
    var $$activeChanges = __sym("activeChanges");
    
    
    var Notifier: any = (function () {
      
      function Notifier(o) {
        this[$$target] = o;
        this[$$changeObservers] = [];
        this[$$activeChanges] = {};
      }
      
      Notifier.prototype.notify = function (changeRecord) {
        
        
      };
      
      
      Notifier.prototype.performChange = function (changeType, changeFn) {
        
      };
    
      return Notifier;
    }());
    

    __observerDeliver = function (callback: IObserver<any>) {
      var changeRecords: IChangeRecord<any>[] = callback[$$pendingChangeRecords];
      callback[$$pendingChangeRecords] = [];
      var returnValue = false;
      
      var l = changeRecords.length;
      if (l > 0) {
        var array = [];
        var n = 0;
        var anyRecords = false;
        for (var i = 0; i < l; i++) {
          var record = changeRecords[i];
          if (record !== undefined) {
            anyRecords = true;
            array[n] = record;
            n += 1;
          }
        }
        callback(anyRecords ? array : null);
      }
      return returnValue;
    };
    
    var __beginChange = function (o: any, changeType: string) {
      var notifier = __notifier(o);
      var activeChanges = notifier[$$activeChanges];
    };
    
    var __endChange = function (o: any, changeType: string) {
      
    };
    
    var __observerClean = function (callback: IObserver<any>) {
      
    };
    
    var __notifiers = __weakMap<any, INotifier<any>>();
    __notifier = function <T>(o: T): INotifier<T> {
      __assertObject(o);
      var notifier: INotifier<T> = null;
      if (!__isFrozen(o)) {
        notifier = __notifiers.get(o);
        if (notifier === undefined) {
          __notifiers.set(o, notifier = new Notifier(o));
        }
      }
      return notifier;
    };
    
    __observe = function (o, callback, options?: Options) {
      __assertObject(o);
      __assertCallable(callback);
      __assertNotFrozen(callback);
      var notifier = __notifier(o);
      if (notifier) {
        var acceptTypes = options && options.acceptTypes || ALL;
        var skipRecords = !!(options && options.skipRecords);
        
      }
    };
    
    __unobserve = function (o, callback) {
      __assertObject(o);
      __assertCallable(callback);
      
      var notifier = __notifiers.get(o);
      if (notifier) {
        /*notifier.removeListener(callback);
        if (notifier.listeners().length === 0) {
          __notifiers.delete(o);
        }*/
        
        __observerClean(callback);
      }
    };
  }
  

  interface INotifier<T> {
    
    notify(c: IChangeRecord<T>)
    performChange(changeType, changeFn)
    
  }
  
  interface IObserver<T> {
    (a: IChangeRecord<T>[]): void
  }
  
  interface IChangeRecord<T> {
    type: string
    object: T
    name: string
    oldValue: any
  }
  
  type Options = { 
    acceptTypes?: string[]; 
    skipRecords?: boolean 
  };
  
  export function add<T>(o: T, callback: IObserver<T>, options?: Options) {
    return __observe(o, callback, options);
  }
  
  export function remove<T>(o: T, callback: IObserver<T>) {
    return __unobserve(o, callback);
  }
  
  export function deliver(callback: IObserver<any>): boolean {
    return __observerDeliver(callback);  
  }
  
  export function notifier<T>(o: T): INotifier<T> {
    return __notifier(o);
  }
  
}
export = observe;