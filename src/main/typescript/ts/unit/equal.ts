import * as reflect from "../reflect"

//Util
const IsFinite = isFinite
const IsEmpty = function (o: any) { return o === undefined || o === null }
const IsNaN = function (o: any) { return o !== o }
const IsNumber = function (o: any) { return typeof o === 'number' }
const IsObject = function (o: any) { return o !== null && (typeof o == "object") }
const SameValue = Object['is'] || function (a: any, b: any) { return a === b ? (a !== 0 || 1 / a === 1 / b) : IsNaN(a) && IsNaN(b) }
const ObjectKeys = reflect.ownKeys
const ObjectKeysSorted = function (o: any) { return ObjectKeys(o).sort(); }
const ToStringTag = reflect.stringTag

export function is(a: any, b: any): boolean {
  return SameValue(a, b)
}

export function equals(a: any, b: any): boolean {
  return (
    SameValue(a, b) ||
    (
      !IsEmpty(a) && a.equals ? a.equals(b) :
      !IsEmpty(b) && b.equals ? b.equals(a) :
      a == b
    )
  )
}

export function equalsStrict(a: any, b: any): boolean {
  return a === b
}

export function equalsNear(a: any, b: any, epsilon: number): boolean {
  let isnum1 = IsNumber(a)
  let isnum2 = IsNumber(b)
  return (
    (isnum1 || isnum2) ? (isnum1 === isnum2) && (a == b || equalsFloat(a, b, epsilon)) :
    (!IsEmpty(a) && a.equalsNear) ? a.equalsNear(b) :
    (!IsEmpty(b) && b.equalsNear) ? b.equalsNear(a) :
    false
  )
}

export function equalsDeep(a: any, b: any): boolean {

  function equals(o1, o2) {
    if (!is(o1, o2)) {
      switch (ToStringTag(o1)) {
        case 'Undefined':
        case 'Null':
        case 'Boolean':
          return false
        case 'Number':
          return (ToStringTag(o2) === 'Number') && (IsNaN(o1) && IsNaN(o2))
        case 'String':
          return (ToStringTag(o2) === 'String') && (o1 == o2)
        case 'Array':
          return (o2 != null) && equalsArray(o1, o2, equals)
        case 'Object':
        case 'Function':
        default:
          let keys1 = ObjectKeysSorted(o1)
          let keys2 = IsObject(o2) ? ObjectKeysSorted(o2) : null
          let keyc = keys1.length
          if (keys2 && equalsArray(keys1, keys2, equalsStrict)) {
            for (let i = 0; i < keyc; ++i) {
              let key = keys1[i]
              if (!equals(o1[key], o2[key])) {
                return false
              }
            }
          }
          return true
      }
    }
    return true
  }
  return equals(a, b)
}

function equalsFloat(a: number, b: number, epsilon: number): boolean {
  return (
    IsNaN(b) ? IsNaN(a) :
    IsNaN(a) ? false :
    !IsFinite(b) && !IsFinite(a) ? (b > 0) == (a > 0) :
    Math.abs(a - b) < epsilon
  )
}

function equalsArray(a: any[], b: any[], equalFn: (av: any, bv: any) => boolean) {
  let returnValue = true
  let al = a.length
  let bl = b.length

  if (al === bl) {
    for (let i = 0, l = al; i < l; ++i) {
      if (!equalFn(a[i], b[i])) {
        returnValue = false
        break
      }
    }
  }
  return returnValue
}
