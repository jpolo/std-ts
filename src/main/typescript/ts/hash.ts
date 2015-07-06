import id = require("ts/id")

//see https://github.com/facebook/immutable-js/blob/master/src/Hash.js
module hash {
  
  //Constant
  const INT32_MASK = 0xffffffff;
  const STRING_HASH_CACHE_MIN_STRLEN = 16;

  //Util
  var __create = Object.create || function (proto) {
    var ctor = proto.constructor;
    function P() {}
    P.prototype = proto;
    return new P();
  };
  var __getId = id.id;
  var __stringHashCache = (function () {
    var _data = __create(null);
    function get(k: string) {
      return _data[k];
    }
    function set(k: string, v: number) {
      _data[k] = v;
    }
    return {
      get: get,
      set: set
    };
  }());
  var __smi = function (i32: number) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xbfffffff);
  };
  
  
  export interface IHash {
  
    hash(): number
    
  }
  
  export function hash(o: any): number {
    var returnValue = 0;
    if (o !== null && o !== undefined) {
      if (typeof o.valueOf === 'function') {
        o = o.valueOf();
      }
      switch (typeof o) {
        case "boolean":
          returnValue = hashBoolean(o);
          break;
        case "number":
          returnValue = hashNumber(o);
          break;
        case "string":
          returnValue = hashString(o);
          break;
        case "function":
          returnValue = __getId(o);
          break;
        default://object
          if (isIHash(o)) {
            returnValue = +o.hash();  
          } else if (id.hasId(o)) {
            returnValue = __getId(o);
          }
      }
    }
    return returnValue;
  }
  
  export function hashBoolean(b: boolean): number {
    return b === true ? 1 : 0;  
  }
  
  export function hashString(s: string): number {
    var hash = 0;
    if (s !== null && s !== undefined) {
      if (s.length > STRING_HASH_CACHE_MIN_STRLEN) {
        //cached
        hash = __stringHashCache.get(s);
        if (hash === undefined) {
          // This is the hash from JVM
          hash = _hashString(s);
          //write
          __stringHashCache.set(s, hash);
        }
      } else {
        hash = _hashString(s);  
      }
    }
    return hash;
  }
  
  function _hashString(s: string): number {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hash = 0;
    for (var i = 0, l = s.length; i < l; i++) {
      hash = 31 * hash + s.charCodeAt(i) | 0;
    }
    return __smi(hash);
  }
    
  export function hashNumber(n: number): number {
    var h = n | 0;
    if (h !== n) {
      h ^= n * INT32_MASK;
    }
    while (n > INT32_MASK) {
      n /= INT32_MASK;
      h ^= n;
    }
    return __smi(h);
  }
  
  function hashObject(o: any): number {
    var returnValue = 0;
    if (isIHash(o)) {
      returnValue = +o.hash();  
    } else if (id.hasId(o)) {
      returnValue = __getId(o);
    }
    return returnValue;
  }

  export function isIHash(o: any): boolean {
    return o && typeof o.hash === "function";  
  }
  

}
export = hash