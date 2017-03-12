import {
  IsEmpty,
  IsNaN,
  IsNumber,
  SameValue,
  OwnKeysSorted,
  ToStringTag
} from './util';

/**
 * Return ```true``` if ```a``` is same value as ```b```
 *
 * @param a left side parameter
 * @param b right side parameter
 * @return the equality result
 */
export function equalsSame(a: any, b: any): boolean {
  return SameValue(a, b);
}

/**
 * Return ```true``` if ```a == b```
 *
 * @param a left side parameter
 * @param b right side parameter
 * @return the strict equality result
 */
export function equalsSimple(a: any, b: any): boolean {
  return a == b;
}

/**
 * Return ```true``` if ```a === b```
 *
 * @param a left side parameter
 * @param b right side parameter
 * @return the strict equality result
 */
export function equalsStrict(a: any, b: any): boolean {
  return a === b;
}

/**
 * Return ```true``` if ```a``` is ```b```
 *
 * @param a left side parameter
 * @param b right side parameter
 * @param epsilon the maximum distance between a and b
 * @return the equal near difference
 */
export function equalsNear(a: any, b: any, epsilon: number): boolean {
  const isnum1 = IsNumber(a);
  const isnum2 = IsNumber(b);
  return (
    (isnum1 || isnum2) ? (isnum1 === isnum2) && (a == b || equalsFloat(a, b, epsilon)) :
    (!IsEmpty(a) && a.equalsNear) ? a.equalsNear(b) :
    (!IsEmpty(b) && b.equalsNear) ? b.equalsNear(a) :
    false
  );
}

/**
 * Return ```true``` if all properties of ```a``` are strictly equal to ```b```
 *
 * @param a left side parameter
 * @param b right side parameter
 * @param equalsFn the property equality function
 * @return the property equality test
 */
export function equalsProperties(a: any, b: any, equalsFn = equalsStrict): boolean {
  return equalsObject(a, b, equalsFn);
}

/**
 * Return ```true``` if ```a``` is deeply equal to ```b```
 *
 * @param a left side parameter
 * @param b right side parameter
 * @return the deep equality result
 */
export function equalsDeep(a: any, b: any): boolean {
  return equalsAny(a, b, equalsDeep);
}

function equalsFloat(a: number, b: number, epsilon: number): boolean {
  return (
    IsNaN(a) || IsNaN(b) ? false :
    // !IsFinite(b) && !IsFinite(a) ? (b > 0) == (a > 0) :
    Math.abs(a - b) <= epsilon
  );
}

function equalsDate(a: Date, b: Date) {
  return a.valueOf() === b.valueOf();
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
  );
}

function equalsArray(a: any[], b: any[], equalFn: (av: any, bv: any) => boolean) {
  let returnValue = true;
  const al = a.length;
  const bl = b.length;

  if (al === bl) {
    for (let i = 0; i < al; ++i) {
      if (!equalFn(a[i], b[i])) {
        returnValue = false;
        break;
      }
    }
  }
  return returnValue;
}

function equalsObject(a: any, b: any, equalsFn: (av: any, bv: any) => boolean): boolean {
  const akeys = OwnKeysSorted(a);
  const bkeys = OwnKeysSorted(b);
  // Compare keys first to deep value
  if (equalsArray(akeys, bkeys, equalsStrict)) {
    const length = akeys.length;
    for (let i = 0; i < length; ++i) {
      const akey = akeys[i];
      const bkey = bkeys[i];
      if (akey !== bkey || !equalsFn(a[akey], b[bkey])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function equalsMap(a: any, b: any, equalsFn: (a: any, b: any) => boolean): boolean {
  console.warn('equalsMap() not implemented');
  return true;
}

function equalsSet(a: Set<any>, b: Set<any>, equalsFn: (a: any, b: any) => boolean): boolean {
  function SetHasValue<V>(s: Set<V>, value: V): boolean {
    for (const iterValue of Array.from(s.values())) {
      if (equalsFn(iterValue, value)) {
        return true;
      }
    }
    return false;
  }

  if (a.size === b.size) {
    for (const avalue of Array.from(a.values())) {
      if (!SetHasValue(b, avalue)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function equalsAny(a: any, b: any, equalsFn: (a: any, b: any) => boolean) {
  if (!SameValue(a, b)) {
    const atag = ToStringTag(a);
    const btag = ToStringTag(b);
    switch (atag) {
      case 'Undefined':
      case 'Null':
      case 'Boolean':
        return false;
      case 'Number':
        return (btag === atag) && equalsFloat(a, b, 0);
      case 'String':
        return (btag === atag) && (a == b);
      case 'Array':
        return (btag === atag) && equalsArray(a, b, equalsFn);
      case 'Date':
        return (btag === atag) && equalsDate(a, b);
      case 'RegExp':
        return (btag === atag) && equalsRegExp(a, b);
      case 'Map':
        return (btag === atag) && equalsMap(a, b, equalsFn);
      case 'Set':
        return (btag === atag) && equalsSet(a, b, equalsFn);
      case 'Object':
      case 'Function':
      default:
        return equalsObject(a, b, equalsFn);
    }
  }
  return true;
}
