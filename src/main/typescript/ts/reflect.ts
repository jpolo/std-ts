module reflect {
  //Constant
  var ES3_COMPAT = true;
  var ES5_COMPAT = ES3_COMPAT || true;
  
  //Util
  var __fidentity = function f<T>() { return function (o: T) { return o } };
  var __fapply = Function.prototype.apply;
  var __fconst = function f<T>(k: T) { return function () { return k } };
  var __polyfilled = function (f: Function): boolean { return !!(<any>f).polyfill };
  var __str = function (o) { return "" + o; };
  var __ohasown = {}.hasOwnProperty;
  var __ostring = Object.prototype.toString;
  var __okeys = Object.keys;
  var __obj = Object;
  var __apply;//Reflect API still draft
  var __construct;//Reflect API still draft
  var __create = Object.create;
  var __proto = Object.getPrototypeOf;
  var __propertyDefine = Object.defineProperty;
  var __propertyDelete;//Reflect API still draft
  var __propertyDescriptor = Object.getOwnPropertyDescriptor;
  var __propertyNames = Object.getOwnPropertyNames;
  var __propertySymbols = Object['getOwnPropertySymbols'];
  var __hasOwn;//Reflect API still draft
  var __isDataDescriptor = function (descriptor: IPropertyDescriptor) { return ('value' in descriptor || 'writable' in descriptor); };
  var __isAccessorDescriptor = function (descriptor: IPropertyDescriptor) { return ('get' in descriptor || 'set' in descriptor); };
  var __isUndefined = function (o: any) { return typeof o === 'undefined'; }
  var __isFunction = function (o: any) { return typeof o === 'function'; }
  var __isObject = function (o: any){ return o !== null && (typeof o === 'object' || typeof o === 'function'); }
  var __isFrozen = Object.isFrozen;
  var __isSealed = Object.isSealed;
  var __isExtensible = Object.isExtensible;
  var __freeze = Object.freeze;
  var __preventExtensions = Object.preventExtensions;
  var __seal = Object.seal;
  var __typeOf = function (o: any): Type { return o === null ? Type.null : Type[typeof o]; };
  
  //Compat
  if (ES5_COMPAT || ES3_COMPAT) {
    var __polyfill = function poly<T>(f: T): T { (<any>f).polyfill = true; return f; };

    if (ES3_COMPAT) {
      __okeys = __okeys || __polyfill(function (o) { var ks = []; for (var k in o) { if (__hasOwn.call(o, k)) { ks.push(k); } } return ks; });
      __create = __create|| __polyfill(function (proto) { function t() {}; t.prototype = proto.prototype; return new t(); });
      __proto = __proto || __polyfill(function (o) { return o.__proto__ });
      __propertyDefine = Object.defineProperty;
      __propertyDescriptor = Object.getOwnPropertyDescriptor;
      __propertyNames = __propertyNames || __polyfill(function (o) { return __okeys(o) });
      __isFrozen = __isFrozen || __polyfill(__fconst(false));
      __isSealed = __isSealed ||  __polyfill(__fconst(false));
      __isExtensible = __isExtensible ||  __polyfill(__fconst(true));
      __freeze = __freeze || __polyfill(__fidentity());
      __preventExtensions = __preventExtensions || __polyfill(__fidentity());
      __seal = __seal || __polyfill(__fidentity());
    }
    
    if (ES5_COMPAT) {
      __apply = __apply || __polyfill(function (f, thisArg, args) { return __fapply.call(f, thisArg, args); });
      __construct = __construct || __polyfill(function (Constructor: Function, args: any[]) { 
        var proto = Constructor.prototype
        var instance = __obj(proto) === proto ? __create(proto) : {}
        var result = __fapply.call(Constructor, instance, args)
        return __obj(result) === result ? result : instance
      });
      __hasOwn = __hasOwn || __polyfill(function (o, name) { return __ohasown.call(o, name); });
      __propertySymbols = __propertySymbols || __polyfill(function (o) { return []; });
      __propertyDelete = __propertyDelete || __polyfill(function (o: any, propertyName: string) {
        var target = __obj(o);
        var returnValue = false;
        if (!__hasOwn(target, propertyName)) {
          returnValue = true;
        } else {
          var descriptor = __propertyDescriptor(target, propertyName);
          if (descriptor && descriptor.configurable === true) {
            delete target[propertyName];
            returnValue = true;
          }
        }
        return returnValue;
      });
    }
  }
  
  export enum Type {
    null, boolean, function, number, string, undefined
  }
  
  export interface IPropertyDescriptor extends PropertyDescriptor {}

  export function apply(f: Function, thisArg: any, args: any[]): any {
    return __apply(f, thisArg, args);
  }
  
  export function construct(Constructor: Function, args: any[]): any {
    return __construct(Constructor, args);
  }
  
  export function defineProperty(o: any, propertyName: string, descriptor: IPropertyDescriptor) {
    return __propertyDefine(o, propertyName, descriptor)
  }
  
  export function deleteProperty(o: any, propertyName: string): boolean {
    return __propertyDelete(o, propertyName);
  }
  
  export function enumerate(o: any): {next: () => { done: boolean; value?: any }} {
    var returnValue = []
    for (var key in o) {
      returnValue.push(key)
    }
    var l = +returnValue.length
    var index = 0
    return {
      next: function () {
        return index === l ? { done: true } : { done: false, value: returnValue[index++] }
      }
    }
  }

  export function freeze(o: any, deep?: boolean): any {
    __freeze(o) // First freeze the object.
    if (deep && !__polyfilled(__freeze)) {
      var keys = __okeys(o)
      for (var i = 0, l = keys.length; i < l; ++i) {
        var val = o[keys[i]]
        if (__isObject(val) && !__isFrozen(val)) {
          freeze(val, deep) // Recursively call freeze().
        }
      }
    }
    return o
  }
  
  export function get(o: any, propertyName: string, receiver?: any): any {
    receiver = receiver || o
    var returnValue
    
    if (o === receiver) {
      //fast case
      returnValue = o[propertyName]
    } else {
      var descriptor = __propertyDescriptor(o, propertyName)
      if (__isUndefined(descriptor)) {
        var proto = __proto(o)
        if (proto != null) {
          returnValue = get(proto, propertyName, receiver)
        }
      } else if (__isDataDescriptor(descriptor)) {
        returnValue = descriptor.value
      } else {
        var getter = descriptor.get
        if (!__isUndefined(getter)) {
          returnValue = getter.call(receiver)
        }
      }
    }
    return returnValue
  }
  
  export function getOwnPropertyDescriptor(o: any, propertyName: string): IPropertyDescriptor {
    return __propertyDescriptor(o, propertyName)
  }
  
  export function getPrototypeOf(o: any): any {
    return __proto(o)
  }
  
  export function has(o: any, propertyName: string): boolean {
    return (propertyName in o)
  }
  
  export function hasOwn(o: any, propertyName: string) {
    return __hasOwn(o, propertyName)
  }
  
  export function isExtensible(o: any): boolean {
    return __isExtensible(o)
  }
  
  export function isFrozen(o: any): boolean {
    return __isFrozen(o)
  }
  
  export function isSealed(o: any): boolean {
    return __isSealed(o)
  }
  
  export function ownKeys(o: any): string[] {
    var names = __propertyNames(o)
    return names
    //return __polyfilled(__propertySymbols) ? names : names.concat(__propertySymbols(o))
  }
  
  export function preventExtensions(o): any {
    return __preventExtensions(o)
  }
  
  export function seal(o: any): any {
    return __seal(o)
  }
  
  export function set(o: any, propertyName: string, value: any, receiver?: any): boolean {
    receiver = receiver || o    
    /*if (o === receiver) {
      try {
        o[propertyName] = value
        return true
      } catch (e) {
        return false
      }
    }*/
    
    var descriptor = __propertyDescriptor(o, propertyName)

    if (__isUndefined(descriptor)) {
      // name is not defined in target, search target's prototype
      var proto = __proto(o)

      if (proto !== null) {
        return set(proto, propertyName, value, receiver)
      }
      descriptor = { 
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true 
      }
    }

    // we now know that ownDesc !== undefined
    if (__isAccessorDescriptor(descriptor)) {
      var setter = descriptor.set
      if (__isUndefined(setter)) return false
      setter.call(receiver, value) // assumes Function.prototype.call
      return true
    }
    // otherwise, _isDataDescriptor(ownDesc) must be true
    if (descriptor.writable === false) return false
    // we found an existing writable data property on the prototype chain.
    // Now update or add the data property on the receiver, depending on
    // whether the receiver already defines the property or not.
    var existingDesc = __propertyDescriptor(receiver, propertyName)
    if (!__isUndefined(existingDesc)) {
      __propertyDefine(receiver, propertyName, { 
        value: value,
        writable: existingDesc.writable,
        enumerable: existingDesc.enumerable,
        configurable: existingDesc.configurable
      })
    } else {
      if (!__isExtensible(receiver)) return false
      __propertyDefine(receiver, propertyName, {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true 
      })
    }
    return true
  }
  
  export function stringTag(o: any): string {
    var s = '';
    switch(__typeOf(o)) {
      case Type.null: s = 'Null'; break;
      case Type.boolean: s = 'Boolean'; break;
      case Type.function: s = 'Function'; break;
      case Type.number: s = 'Number'; break;
      case Type.string: s = 'String'; break;
      case Type.undefined: s = 'Undefined'; break;
      default: /*object*/ 
        var c = o.constructor;
        s = c && c.name || __ostring.call(o).slice(8, -1);
    }
    return s;
  }
  
  export function typeName(t: Function): string {
    return ((<any>t).displayName || (<any>t).name || ((<any>t).name = /\W*function\s+([\w\$]+)\(/.exec(__str(t))[1]))
  }
  
  export function typeOf(o: any): Type {
    return __typeOf(o);  
  }
  
  
  
  

}
export = reflect