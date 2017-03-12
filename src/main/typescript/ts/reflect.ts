// Constant
const ES_COMPAT = 3;

// Util
const __global: any = typeof window !== 'undefined' ? window : (function () { return this; }());
const Reflect = typeof __global.Reflect !== 'undefined' ? __global.Reflect : {};
const __fidentity = function f() { return function (o: any) { return o; }; };
const __fapply = Function.prototype.apply;
const __fconst = function f<T>(k: T) { return function () { return k; }; };
const __polyfill = function poly<T>(f: T): T { (f as any).polyfill = true; return f; };
const __polyfilled = function (f: Function): boolean { return !!(f as any).polyfill; };
const __str = function (o: any) { return '' + o; };
const __ohasown = {}.hasOwnProperty;
const __ostring = Object.prototype.toString;
let __okeys = Object.keys;
const __obj = Object;
let __apply = Reflect.apply; // Reflect API still draft
let __construct = Reflect.construct; // Reflect API still draft
let __create = Object.create;
let __proto = Object.getPrototypeOf;
let __propertyDefine = Object.defineProperty;
let __propertyDelete = Reflect.deleteProperty; // Reflect API still draft
let __propertyDescriptor = Object.getOwnPropertyDescriptor;
let __propertyNames = Object.getOwnPropertyNames;
let __propertySymbols = Object['getOwnPropertySymbols'];
let __has = Reflect.has; // Reflect API still draft
let __hasOwn = Reflect.hasOwn; // Reflect API still draft
const __isDataDescriptor = function (descriptor: IPropertyDescriptor) { return ('value' in descriptor || 'writable' in descriptor); };
const __isAccessorDescriptor = function (descriptor: IPropertyDescriptor) { return ('get' in descriptor || 'set' in descriptor); };
const __isUndefined = function (o: any) { return typeof o === 'undefined'; };
const __isObject = function (o: any){ return o !== null && (typeof o === 'object' || typeof o === 'function'); };
let __isFrozen = Object.isFrozen;
let __isSealed = Object.isSealed;
let __isExtensible = Object.isExtensible;
let __freeze = Object.freeze;
let __preventExtensions = Object.preventExtensions;
let __seal = Object.seal;
const __typeOf = function (o: any): string {
  const t = typeof o;
  switch (t) {
    case 'undefined':
    case 'boolean':
    case 'number':
    case 'string':
      return t;
    default: // object
      if (o === null) {
        return 'null';
      } else if (o instanceof __global.Symbol) {
        return 'symbol';
      } else {
        return 'object';
      }
  }
};

// Compat
if (ES_COMPAT <= 3) {
  __okeys = __okeys || __polyfill(function (o: any) { const ks = []; for (const k in o) { if (__hasOwn.call(o, k)) { ks.push(k); } } return ks; });
  __create = __create || __polyfill(function (proto: any) { const t = function () {}; t.prototype = proto.prototype; return new t(); });
  __proto = __proto || __polyfill(function (o: any) { return o.__proto__; });
  __propertyDefine = Object.defineProperty; // TODO polyfill this
  __propertyDescriptor = Object.getOwnPropertyDescriptor; // TODO polyfill this
  __propertyNames = __propertyNames || __polyfill(function (o: any) { return __okeys(o); });
  __isFrozen = __isFrozen || __polyfill(__fconst(false));
  __isSealed = __isSealed || __polyfill(__fconst(false));
  __isExtensible = __isExtensible || __polyfill(__fconst(true));
  __freeze = __freeze || __polyfill(__fidentity());
  __preventExtensions = __preventExtensions || __polyfill(__fidentity());
  __seal = __seal || __polyfill(__fidentity());
}

if (ES_COMPAT <= 5) {
  __apply = __apply || __polyfill(function (f: Function, thisArg?: any, args?: any[]) { return __fapply.call(f, thisArg, args); });
  __construct = __construct || __polyfill(function (Constructor: Function, args: any[]) {
    const proto = Constructor.prototype;
    const instance = __obj(proto) === proto ? __create(proto) : {};
    const result = __fapply.call(Constructor, instance, args);
    return __obj(result) === result ? result : instance;
  });
  __has = __has || function (o: any, propertyName: string) { return (propertyName in o); };
  __hasOwn = __hasOwn || __polyfill(function (o: any, name: string) { return __ohasown.call(o, name); });
  __propertySymbols = __propertySymbols || __polyfill(function (o: any): Symbol[] { return []; });
  __propertyDelete = __propertyDelete || __polyfill(function (o: any, propertyName: string) {
    const target = __obj(o);
    let returnValue = false;
    if (!__hasOwn(target, propertyName)) {
      returnValue = true;
    } else {
      const descriptor = __propertyDescriptor(target, propertyName);
      if (descriptor && descriptor.configurable === true) {
        delete target[propertyName];
        returnValue = true;
      }
    }
    return returnValue;
  });
}

export enum Type {
  null, boolean, function, number, string, undefined, symbol
}

export interface IPropertyDescriptor extends PropertyDescriptor {}

export function apply(f: Function, thisArg: any, args: any[]): any {
  return __apply(f, thisArg, args);
}

export function construct(Constructor: Function, args: any[]): any {
  return __construct(Constructor, args);
}

export function defineProperty(o: any, propertyName: string, descriptor: IPropertyDescriptor) {
  return __propertyDefine(o, propertyName, descriptor);
}

export function deleteProperty(o: any, propertyName: string): boolean {
  return __propertyDelete(o, propertyName);
}

export function enumerate(o: any): {next: () => { done: boolean; value?: any }} {
  const returnValue: string[] = [];
  for (const key in o) {
    returnValue.push(key);
  }
  const length = +returnValue.length;
  let index = 0;
  return {
    next: function () {
      return index === length ? { done: true } : { done: false, value: returnValue[index++] };
    }
  };
}

export function freeze<T>(o: T, deep?: boolean): T {
  __freeze(o); // First freeze the object.
  if (deep && !__polyfilled(__freeze)) {
    const keys = __okeys(o);
    const keyc = keys.length;
    for (let i = 0; i < keyc; ++i) {
      const val = o[keys[i]];
      if (__isObject(val) && !__isFrozen(val)) {
        freeze(val, deep); // Recursively call freeze().
      }
    }
  }
  return o;
}

export function get(o: any, propertyName: string, receiver?: any): any {
  receiver = receiver || o;
  let returnValue;

  if (o === receiver) {
    // fast case
    returnValue = o[propertyName];
  } else {
    const descriptor = __propertyDescriptor(o, propertyName);
    if (__isUndefined(descriptor)) {
      const proto = __proto(o);
      if (proto != null) {
        returnValue = get(proto, propertyName, receiver);
      }
    } else if (__isDataDescriptor(descriptor)) {
      returnValue = descriptor.value;
    } else {
      const getter = descriptor.get;
      if (!__isUndefined(getter)) {
        returnValue = getter.call(receiver);
      }
    }
  }
  return returnValue;
}

export function getOwnPropertyDescriptor(o: any, propertyName: string): IPropertyDescriptor {
  return __propertyDescriptor(o, propertyName);
}

export function getPrototypeOf(o: any): any {
  return __proto(o);
}

export function has(o: any, propertyName: string): boolean {
  return __has(o, propertyName);
}

export function hasOwn(o: any, propertyName: string): boolean {
  return __hasOwn(o, propertyName);
}

export function isExtensible(o: any): boolean {
  return __isExtensible(o);
}

export function isFrozen(o: any): boolean {
  return __isFrozen(o);
}

export function isSealed(o: any): boolean {
  return __isSealed(o);
}

export function ownKeys(o: any): string[] {
  return __propertyNames(o);
  // return __polyfilled(__propertySymbols) ? names : names.concat(__propertySymbols(o))
}

export function preventExtensions<T>(o: T): boolean {
  __preventExtensions(o);
  return true;
}

/*
export function seal<T>(o: T): T {
  return __seal(o)
}*/

export function set(o: any, propertyName: string, value: any, receiver?: any): boolean {
  receiver = receiver || o;
  /*if (o === receiver) {
    try {
      o[propertyName] = value
      return true
    } catch (e) {
      return false
    }
  }*/

  let descriptor = __propertyDescriptor(o, propertyName);

  if (__isUndefined(descriptor)) {
    // name is not defined in target, search target's prototype
    const proto = __proto(o);

    if (proto !== null) {
      return set(proto, propertyName, value, receiver);
    }
    descriptor = {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true
    };
  }

  // we now know that ownDesc !== undefined
  if (__isAccessorDescriptor(descriptor)) {
    const setter = descriptor.set;
    if (__isUndefined(setter)) return false;
    setter.call(receiver, value); // assumes Function.prototype.call
    return true;
  }
  // otherwise, _isDataDescriptor(ownDesc) must be true
  if (descriptor.writable === false) return false;
  // we found an existing writable data property on the prototype chain.
  // Now update or add the data property on the receiver, depending on
  // whether the receiver already defines the property or not.
  const existingDesc = __propertyDescriptor(receiver, propertyName);
  if (!__isUndefined(existingDesc)) {
    __propertyDefine(receiver, propertyName, {
      configurable: existingDesc.configurable,
      enumerable: existingDesc.enumerable,
      value: value,
      writable: existingDesc.writable
    });
  } else {
    if (!__isExtensible(receiver)) return false;
    __propertyDefine(receiver, propertyName, {
      configurable: true,
      enumerable: true,
      value: value,
      writable: true
    });
  }
  return true;
}

export function stringTag(o: any): string {
  let s = '';
  switch (__typeOf(o)) {
    case 'null': s = 'Null'; break;
    case 'boolean': s = 'Boolean'; break;
    case 'function': s = 'Function'; break;
    case 'number': s = 'Number'; break;
    case 'string': s = 'String'; break;
    case 'undefined': s = 'Undefined'; break;
    default: /*object*/
      const c = o.constructor;
      s = c && c.name || __ostring.call(o).slice(8, -1);
  }
  return s;
}

export function typeName(t: Function): string {
  return ((t as any).displayName || (t as any).name || ((t as any).name = /\W*function\s+([\w\$]+)\(/.exec(__str(t))[1]));
}

export function typeOf(o: any): Type {
  return Type[__typeOf(o)];
}
