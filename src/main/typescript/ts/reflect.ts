module reflect {
  var __fidentity = function f<T>() { return function (o: T) { return o } }
  var __fapply = Function.prototype.apply
  var __fconst = function f<T>(k: T) { return function () { return k } }
  var __polyfill = function poly<T>(f: T): T { (<any>f).polyfill = true; return f; }
  var __polyfilled = function (f: any): boolean { return !!f.polyfill }
  var __str = String
  var __obj = Object
  var __create = Object.create
  var __keys = Object.keys
  var __proto = Object.getPrototypeOf || __polyfill(function (o) { return o.__proto__ })
  var __propertyDefine = Object.defineProperty
  var __propertyDescriptor = Object.getOwnPropertyDescriptor
  var __propertyNames = Object.getOwnPropertyNames || __polyfill(function (o) { return __keys(o) })
  var __propertySymbols = Object['getOwnPropertySymbols'] || __polyfill(function (o) { return [] })
  var __hasOwn = {}.hasOwnProperty
  var __isFrozen = Object.isFrozen || __polyfill(__fconst(false))
  var __isSealed = Object.isSealed ||  __polyfill(__fconst(false))
  var __isExtensible = Object.isExtensible ||  __polyfill(__fconst(true))
  var __freeze = Object.freeze || __polyfill(__fidentity())
  var __preventExtensions = Object.preventExtensions || __polyfill(__fidentity())
  var __seal = Object.seal || __polyfill(__fidentity())
  
  
  export interface IPropertyDescriptor extends PropertyDescriptor {}

  export function apply(f: Function, thisArg: any, args: any[]): any {
    return __fapply.call(f, thisArg, args)
  }
  
  export function construct(Constructor: Function, args: any[]): any {
    var proto = Constructor.prototype
    var instance = __obj(proto) === proto ? __create(proto) : {}
    var result = __fapply.call(Constructor, instance, args)
    return __obj(result) === result ? result : instance
  }
  
  export function defineProperty(o: any, propertyName: string, descriptor: IPropertyDescriptor) {
    return __propertyDefine(o, propertyName, descriptor)
  }
  
  export function deleteProperty(o: any, propertyName: string): boolean {
    var target = __obj(o)
    var descriptor = __propertyDescriptor(target, propertyName)
    var returnValue = false
    if (descriptor == null) {
      returnValue = true;
    } else if (descriptor.configurable === true) {
      delete target[propertyName]
      returnValue = true
    }
    return returnValue
  }
  
  export function enumerate(o: any) {
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
      var keys = __keys(o)
      for (var i = 0, l = keys.length; i < l; ++i) {
        var val = o[keys[i]]
        if ((typeof val === 'object') && !__isFrozen(val)) {
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
      if (_isUndefined(descriptor)) {
        var proto = __proto(o)
        if (proto != null) {
          returnValue = get(proto, propertyName, receiver)
        }
      } else if (_isDataDescriptor(descriptor)) {
        returnValue = descriptor.value
      } else {
        var getter = descriptor.get
        if (!_isUndefined(getter)) {
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
    return __hasOwn.call(o, propertyName)
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
    return __polyfilled(__propertySymbols) ? names : names.concat(__propertySymbols(o))
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

    if (_isUndefined(descriptor)) {
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
    if (_isAccessorDescriptor(descriptor)) {
      var setter = descriptor.set
      if (_isUndefined(setter)) return false
      setter.call(receiver, value) // assumes Function.prototype.call
      return true
    }
    // otherwise, _isDataDescriptor(ownDesc) must be true
    if (descriptor.writable === false) return false
    // we found an existing writable data property on the prototype chain.
    // Now update or add the data property on the receiver, depending on
    // whether the receiver already defines the property or not.
    var existingDesc = __propertyDescriptor(receiver, propertyName)
    if (!_isUndefined(existingDesc)) {
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
  
  function _isUndefined(o) {
    return typeof o === 'undefined'
  }
  
  function _isDataDescriptor(descriptor: IPropertyDescriptor) {
    return ('value' in descriptor || 'writable' in descriptor)
  }
  
  function _isAccessorDescriptor(descriptor: IPropertyDescriptor) {
    return ('get' in descriptor || 'set' in descriptor)
  }

}
export = reflect