import * as reflect from "../reflect"

//Constant

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

export function equalsProperties(a: any, b: any): boolean {
  return equalsObject(a, b, equalsStrict)
}

export function equalsDeep(a: any, b: any): boolean {
  return equalsAny(a, b, equalsDeep)
}

function equalsFloat(a: number, b: number, epsilon: number): boolean {
  return (
    IsNaN(b) ? IsNaN(a) :
    IsNaN(a) ? false :
    !IsFinite(b) && !IsFinite(a) ? (b > 0) == (a > 0) :
    Math.abs(a - b) <= epsilon
  )
}

function equalsDate(a: Date, b: Date) {
  return a.valueOf() === b.valueOf()
}

function equalsRegExp(a: RegExp, b: RegExp): boolean {
  return (
    // the regex itself
    a.source === b.source &&

    // and its modifiers
    a.global === b.global &&

    // (gmi) ...
    a.ignoreCase === b.ignoreCase &&
    a.multiline === b.multiline &&
    a['sticky'] === b['sticky']
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

function equalsObject(a: any, b: any, equalFn: (av: any, bv: any) => boolean): boolean {
  let akeys = ObjectKeysSorted(a)
  let bkeys = ObjectKeysSorted(b)
  let returnValue = false
  //Compare keys first to deep value
  if (equalsArray(akeys, bkeys, equalsStrict)) {
    returnValue = true
    for (let i = 0, l = akeys.length; i < l; ++i) {
      let akey = akeys[i]
      let bkey = bkeys[i]
      if (akey !== bkey || !equalFn(a[akey], b[bkey])) {
        returnValue = false
        break
      }
    }
  }
  return returnValue
}

function equalsMap(a: any, b: any, equalFn: (a: any, b: any) => boolean): boolean {
  console.warn("equalsMap() not implemented")
  return true
}

function equalsSet(a: any, b: any, equalFn: (a: any, b: any) => boolean): boolean {
  let returnValue = false
  function SetToArray(o): any[] {
    let a = []
    o.forEach((v) => a.push(v))
    return a
  }

  if (a.size() === b.size()) {
    let avalues = SetToArray(a)
    let bvalues = SetToArray(b)
    returnValue = equalsArray(avalues, bvalues, equalFn)
  }
  return returnValue
}

function equalsAny(a: any, b: any, equalFn: (a: any, b: any) => boolean) {
  if (!SameValue(a, b)) {
    let atag = ToStringTag(a)
    let btag = ToStringTag(b)
    switch (atag) {
      case 'Undefined':
      case 'Null':
      case 'Boolean':
        return false
      case 'Number':
        return (btag === atag) && equalsFloat(a, b, 0)
      case 'String':
        return (btag === atag) && (a == b)
      case 'Array':
        return (btag === atag) && equalsArray(a, b, equalFn)
      case 'Date':
        return (btag === atag) && equalsDate(a, b)
      case 'RegExp':
        return (btag === atag) && equalsRegExp(a, b)
      case 'Map':
        return (btag === atag) && equalsMap(a, b, equalFn)
      case 'Set':
        return (btag === atag) && equalsSet(a, b, equalFn)
      case 'Object':
      case 'Function':
      default:
        return equalsObject(a, b, equalFn)
    }
  }
  return true
}
