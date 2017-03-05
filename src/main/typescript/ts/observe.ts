
//ECMA spec is here :
// https://arv.github.io/ecmascript-object-observe

declare const Symbol: any;
//TODO remove
declare class Map<K, V> {
  get(k: K): V;
  set(k: K, v: V): void;
};
declare class WeakMap<K, V> {
  get(k: K): V;
  set(k: K, v: V): void;
};

//Constant
const ES_COMPAT = 3;

export const ADD = 'add';
export const UPDATE = 'update';
export const DELETE = 'delete';
export const RECONFIGURE = 'reconfigure';
export const SET_PROTOTYPE = 'setPrototype';
export const PREVENT_EXTENSIONS = 'preventExtensions';

const ALL = [ADD, UPDATE, DELETE, RECONFIGURE, SET_PROTOTYPE, PREVENT_EXTENSIONS];

//Util
const O = (Object as any);
const __keys = Object.keys || function (o: any): string[] { const ks = []; for (const k in o) { if (o.hasOwnProperty(k)) { ks.push(k); } } return ks; };
let __observerDeliver = O.deliverChangeRecords;
let __observe = O.observe;
let __unobserve = O.unobserve;
let __notifier: <T>(o: T) => INotifier<T> = O.getNotifier;
const __setImmediate = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
const __clearImmediate = typeof clearImmediate !== 'undefined' ? clearImmediate : clearTimeout;
const __sym: (o: string) => any = typeof Symbol !== 'undefined' ? Symbol : function (s: string) { return '@@' + s; };
let __map: <K, V>() => Map<K, V>;
let __weakMap: <K, V>() => WeakMap<K, V>;
const __isFrozen = Object.isFrozen || function (o: any): boolean { return false; };
const __preventExtensions = Object.preventExtensions || function <T> (o: T) { return o; };

//Compat
if (ES_COMPAT <= 5) {
  __map = typeof Map !== 'undefined' ?
    function () { return new Map(); } :
    function <K, V> () {
      const _keys: K[] = [];
      const _values: V[] = [];

      return {
        has: function (k: K) {
          return _keys.indexOf(k) !== -1;
        },
        get: function (k: K) {
          const i = _keys.indexOf(k);
          return i !== -1 ? _values[i] : undefined;
        },
        set: function (k: K, v: V) {
          let i = _keys.indexOf(k);
          if (i !== -1) {
            i = _keys.length;
            _keys[i] = k;
            _values[i] = v;
          } else {
            _values[i] = v;
          }
        },
        delete: function (k: K) {
          const i = _keys.indexOf(k);
          if (i !== -1) {
            _keys.splice(i, 1);
            _values.splice(i, 1);
          }
        }
      };
    };
  __weakMap = typeof WeakMap !== 'undefined' ?
    function () { return new WeakMap(); } :
    __map as any;
}

if (!__observe) {
  const __option = function (o: any, name: string) {
    return o ? o[name] : undefined;
  };
  const __assertObject = function (o: any) {
    if (typeof o !== 'object' || o === null) {
      throw new TypeError(o + ' must be a object');
    }
  };
  const __assertNotFrozen = function (o: any) {
    if (__isFrozen(o)) {
      throw new TypeError(o + ' must not be frozen');
    }
  };
  const __assertCallable = function (o: any) {
    if (typeof o !== 'function') {
      throw new TypeError(o + ' must be a callable');
    }
  };
  const $$notifier = __sym('notifier');
  const $$target = __sym('target');
  const $$pendingChangeRecords = __sym('pendingChangeRecords');
  const $$changeObservers = __sym('changeObservers');
  const $$activeChanges = __sym('activeChanges');

  const __enqueueChangeRecord = function (o: any, changeRecord: IChangeRecord<any>) {
    const notifier = __notifier(o);
    const changeType = changeRecord.type;
    const activeChanges = notifier[$$activeChanges];
    const changeObservers = notifier[$$changeObservers];
  };

  const Notifier: any = (function () {

    function Notifier(o: any) {
      this[$$target] = o;
      this[$$changeObservers] = [];
      this[$$activeChanges] = {};
    }

    Notifier.prototype.notify = function (changeRecord: IChangeRecord<any>) {
      const o = this;
      const target = o[$$target];
      const changeType = changeRecord.type;
      const newRecord: IChangeRecord<any> = {
        object: target,
        type: changeRecord.type,
        name: changeRecord.name,
        oldValue: changeRecord.oldValue
      };
      __preventExtensions(newRecord);
      __enqueueChangeRecord(target, newRecord);
    };

    /*Notifier.prototype.performChange = function (changeType, changeFn) {

    };*/

    return Notifier;
  }());

  __observerDeliver = function (callback: IObserver<any>) {
    const changeRecords: IChangeRecord<any>[] = callback[$$pendingChangeRecords];
    callback[$$pendingChangeRecords] = [];
    const returnValue = false;

    const l = changeRecords.length;
    if (l > 0) {
      const array = [];
      let n = 0;
      let anyRecords = false;
      for (let i = 0; i < l; i++) {
        const record = changeRecords[i];
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

  const __beginChange = function (o: any, changeType: string) {
    const notifier = __notifier(o);
    const activeChanges = notifier[$$activeChanges];
  };

  const __endChange = function (o: any, changeType: string) {

  };

  const __observerClean = function (callback: IObserver<any>) {

  };

  const __notifiers = __weakMap<any, INotifier<any>>();
  __notifier = function <T> (o: T): INotifier<T> {
    __assertObject(o);
    let notifier: INotifier<T> = null;
    if (!__isFrozen(o)) {
      notifier = __notifiers.get(o);
      if (notifier === undefined) {
        __notifiers.set(o, notifier = new Notifier(o));
      }
    }
    return notifier;
  };

  __observe = function (o: any, callback: () => void, options?: IObserverOptions) {
    __assertObject(o);
    __assertCallable(callback);
    __assertNotFrozen(callback);
    const notifier = __notifier(o);
    if (notifier) {
      const acceptTypes = options && options.acceptTypes || ALL;
      const skipRecords = !!(options && options.skipRecords);

    }
  };

  __unobserve = function (o: any, callback: () => void) {
    __assertObject(o);
    __assertCallable(callback);

    const notifier = __notifiers.get(o);
    if (notifier) {
      /*notifier.removeListener(callback);
      if (notifier.listeners().length === 0) {
        __notifiers.delete(o);
      }*/

      __observerClean(callback);
    }
  };
}

export interface INotifier<T> {
  notify(c: IChangeRecord<T>): void;
  performChange(changeType: string, changeFn: () => void): void;
}

export interface IObserver<T> {
  (a: IChangeRecord<T>[]): void;
}

export interface IChangeRecord<T> {
  type: string;
  object: T;
  name: string;
  oldValue: any;
}

export interface IObserverOptions {
  acceptTypes?: string[];
  skipRecords?: boolean;
};

export function add<T>(o: T, callback: IObserver<T>, options?: IObserverOptions) {
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
