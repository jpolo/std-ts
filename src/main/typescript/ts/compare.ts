// ECMA like
function IsEmpty (o: any): o is (null | undefined) { return o === null || o === undefined }
function IsNaN (o: any) { return o !== o }
function ToString (o: any) { return '' + o }
function ToStringTag (o: any) {
  let s = ''
  if (o === undefined) {
    s = 'Undefined'
  } else if (o === null) {
    s = 'Null'
  } else {
    const c = o.constructor
    s = c && c.name || Object.prototype.toString.call(o).slice(8, -1)
  }
  return s
}

function Comparator<T> (o: T): null|((lhs: T, rhs: T) => Ordering) {
  const tag = ToStringTag(o)
  switch (tag) {
    case 'Undefined': return null
    case 'Null': return null
    case 'Boolean': return compareBoolean as any
    case 'Number': return compareNumber as any
    case 'String': return compareString as any
    default:
      if (isICompare(o)) {
        return compareICompare as any
      } else {
        switch (tag) {
          case 'Date': return compareDate as any
          case 'RegExp': return compareRegExp as any
          default: return null
        }
      }
  }
}

export enum Ordering {
  Less = -1,
  Equal = 0,
  Greater = 1,
  None = NaN
}

export interface ICompare {
  compare (o: any): Ordering
}

export function isICompare (o: any): o is ICompare {
  return (!!o && typeof o.compare === 'function')
}

export function compare<T> (lhs: T, rhs: T): Ordering {
  const cmpFn = Comparator(lhs) || Comparator(rhs)

  return (
    cmpFn ? cmpFn(lhs, rhs) :
    lhs === rhs && IsEmpty(lhs) ? Ordering.Equal :
    Ordering.None
  )
}

export function compareBoolean (lhs: boolean, rhs: boolean): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    lhs === rhs ? Ordering.Equal :
    +lhs < +rhs ? Ordering.Less :
    Ordering.Greater
  )
}

export function compareNumber (lhs: number, rhs: number): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    IsNaN(lhs) || IsNaN(rhs) ? Ordering.None :
    (lhs = +lhs) === (rhs = +rhs) ? Ordering.Equal :
    lhs < rhs ? Ordering.Less :
    Ordering.Greater
  )
}

export function compareString (lhs: string, rhs: string): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    (lhs = ToString(lhs)) === (rhs = ToString(rhs)) ? Ordering.Equal :
    lhs < rhs ? Ordering.Less :
    Ordering.Greater
  )
}

export function compareICompare (lhs: ICompare, rhs: ICompare): Ordering {
  return (
    IsEmpty(lhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    lhs.compare(rhs)
  )
}

export function compareArray (lhs: Array<any>, rhs: Array<any>, compareFn = compare) {
  let returnValue = Ordering.Equal
  const lhslen = lhs.length
  const rhslen = rhs.length
  const l = lhslen < rhslen ? lhslen : rhslen

  for (let i = 0; i < l; ++i) {
    returnValue = compareFn(lhs[i], rhs[i])
    if (returnValue !== Ordering.Equal) {
      break
    }
  }

  return returnValue
}

export function compareDate (lhs: Date, rhs: Date): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    compareNumber(+lhs, +rhs)
  )
}

export function compareRegExp (lhs: RegExp, rhs: RegExp): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    compareString(ToString(lhs), ToString(rhs))
  )
}

export function min<T> (lhs: T, rhs: T, compareFn = compare): T {
  return compareFn(lhs, rhs) < 0 ? lhs : rhs
}

export function max<T> (lhs: T, rhs: T, compareFn = compare): T {
  return compareFn(lhs, rhs) > 0 ? lhs : rhs
}

export function equals<T> (lhs: T, rhs: T, compareFn = compare): boolean {
  return compareFn(lhs, rhs) === Ordering.Equal
}

export function notEquals<T> (lhs: T, rhs: T, compareFn = compare): boolean {
  return compareFn(lhs, rhs) !== Ordering.Equal
}

export function lessThan<T> (lhs: T, rhs: T, compareFn = compare): boolean {
  return (compareFn(lhs, rhs) === Ordering.Less)
}

export function lessOrEquals<T> (lhs: T, rhs: T, compareFn = compare): boolean {
  const result = compareFn(lhs, rhs)
  return (result === Ordering.Less || result === Ordering.Equal)
}

export function greaterThan<T> (lhs: T, rhs: T, compareFn = compare): boolean {
  return (compareFn(lhs, rhs) === Ordering.Greater)
}

export function greaterOrEquals<T> (lhs: T, rhs: T, compareFn = compare): boolean {
  const result = compareFn(lhs, rhs)
  return (result === Ordering.Greater || result === Ordering.Equal)
}
