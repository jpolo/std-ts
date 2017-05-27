/* tslint:disable:no-bitwise */

import { getId, hasId } from './id'

// see https://github.com/facebook/immutable-js/blob/master/src/Hash.js

// Constant
const INT32_MASK = 0xffffffff
const STRING_HASH_CACHE_MIN_STRLEN = 16

// ECMA Like
class ObjectConstructor {}
function ObjectCreate (proto?: any) {
  let returnValue
  if (Object.create) {
    returnValue = Object.create(proto)
  } else {
    ObjectConstructor.prototype = proto
    const o: any = new ObjectConstructor()
    ObjectConstructor.prototype = null
    returnValue = o
  }
  return returnValue
}
function DictCreate () {
  const _data = ObjectCreate(null)
  return {
    get (k: string) {
      return _data[k]
    },
    set (k: string, v: number) {
      _data[k] = v
    }
  }
}
function Int32SMI (i32: number) {
  return ((i32 >>> 1) & 0x40000000) | (i32 & 0xbfffffff)
}
const stringHashCache = DictCreate()

export interface IHash {

  hashCode (): number

}

export function hash (o: any): number {
  let returnValue = 0
  if (o !== null && o !== undefined) {
    if (typeof o.valueOf === 'function') {
      o = o.valueOf()
    }
    switch (typeof o) {
      case 'boolean':
        returnValue = hashBoolean(o)
        break
      case 'number':
        returnValue = hashNumber(o)
        break
      case 'string':
        returnValue = hashString(o)
        break
      case 'function':
        returnValue = getId(o)
        break
      default: // object
        returnValue = hashObject(o)
    }
  }
  return returnValue
}

export function hashBoolean (b: boolean): number {
  return b === true ? 1 : 0
}

export function hashString (s: string): number {
  let hash = 0
  if (s !== null && s !== undefined) {
    if (s.length > STRING_HASH_CACHE_MIN_STRLEN) {
      // cached
      hash = stringHashCache.get(s)
      if (hash === undefined) {
        // This is the hash from JVM
        hash = _hashString(s)
        // write
        stringHashCache.set(s, hash)
      }
    } else {
      hash = _hashString(s)
    }
  }
  return hash
}

function _hashString (s: string): number {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  let hash = 0
  for (let i = 0, l = s.length; i < l; i++) {
    hash = 31 * hash + s.charCodeAt(i) | 0
  }
  return Int32SMI(hash)
}

export function hashNumber (n: number): number {
  let h = n | 0
  if (h !== n) {
    h ^= n * INT32_MASK
  }
  while (n > INT32_MASK) {
    n /= INT32_MASK
    h ^= n
  }
  return Int32SMI(h)
}

function hashObject (o: any): number {
  let returnValue = 0
  if (isIHash(o)) {
    returnValue = hashIHash(o)
  } else if (hasId(o)) {
    returnValue = getId(o)
  }
  return returnValue
}

function hashIHash (o: IHash) {
  return +o.hashCode()
}

export function isIHash (o: any): o is IHash {
  return o && typeof o.hashCode === 'function'
}
