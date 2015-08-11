//ECMA like
const IsEmpty = function (o) { return o === null  || o === undefined; };
const IsNaN = function (o) { return o !== o; };
const ToString = function (o) { return "" + o; };
const ToStringTag = function (o: any) {
  let s = '';
  if (o === undefined) {
    s = 'Undefined';
  } else if (o === null) {
    s = 'Null';
  } else {
    let c = o.constructor;
    s = c && c.name || Object.prototype.toString.call(o).slice(8, -1);
  }
  return s;
};
const __comparator = function <T>(o: T): (lhs: T, rhs: T) => Ordering {
  let returnValue: (lhs: any, rhs: any) => Ordering
  let tag = ToStringTag(o);
  switch (tag) {
    case 'Undefined': returnValue = null; break;
    case 'Null': returnValue = null; break;
    case 'Boolean': returnValue = <any>compareBoolean; break;
    case 'Number': returnValue = <any>compareNumber; break;
    case 'String': returnValue = <any>compareString; break;
    default:
      if (isICompare(o)) {
        returnValue = compareICompare;
      } else {
        switch (tag) {
          case "Date": returnValue = <any>compareDate; break;
          case "RegExp": returnValue = <any>compareRegExp; break;
        }
      }
  }
  return returnValue;
};

export enum Ordering {
  Less = -1,
  Equal = 0,
  Greater = 1,
  None = NaN
}

export interface ICompare {
  compare(o: any): Ordering;
}

export function isICompare(o: any): boolean {
  return (!!o && typeof o.compare === "function");
}

export function compare<T>(lhs: T, rhs: T): Ordering {
  let returnValue: Ordering = Ordering.None;
  let l = <any> lhs;
  let r = <any> rhs;
  let cmpFn = __comparator(lhs) || __comparator(rhs);

  return (
    cmpFn ? cmpFn(lhs, rhs) :
    lhs === rhs && IsEmpty(lhs)  ? Ordering.Equal :
    Ordering.None
  );
}

export function compareBoolean(lhs: boolean, rhs: boolean): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    lhs === rhs ? Ordering.Equal :
    +lhs < +rhs ? Ordering.Less :
    Ordering.Greater
  );
}

export function compareNumber(lhs: number, rhs: number): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    IsNaN(lhs) || IsNaN(rhs) ? Ordering.None :
    (lhs = +lhs) === (rhs = +rhs) ? Ordering.Equal :
    lhs < rhs ? Ordering.Less :
    Ordering.Greater
  );
}

export function compareString(lhs: string, rhs: string): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    (lhs = ToString(lhs)) === (rhs = ToString(rhs)) ? Ordering.Equal :
    lhs < rhs ? Ordering.Less :
    Ordering.Greater
  );
}

export function compareICompare(lhs: ICompare, rhs: ICompare): Ordering {
  return (
    IsEmpty(lhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    lhs.compare(rhs)
  );
}

export function compareArray(lhs: Array<any>, rhs: Array<any>, compareFn = compare) {
  let returnValue = Ordering.Equal;
  let lhslen = lhs.length;
  let rhslen = rhs.length;

  for (let i = 0, l = lhslen < rhslen ? lhslen : rhslen; i < l; ++i) {
    returnValue = compareFn(lhs[i], rhs[i]);
    if (returnValue !== Ordering.Equal) {
      break;
    }
  }

  return returnValue;
}

export function compareDate(lhs: Date, rhs: Date): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    compareNumber(+lhs, +rhs)
  );
}

export function compareRegExp(lhs: RegExp, rhs: RegExp): Ordering {
  return (
    IsEmpty(lhs) || IsEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
    compareString(ToString(lhs), ToString(rhs))
  );
}

export function min<T>(lhs: T, rhs: T, compareFn = compare): T {
  return compareFn(lhs, rhs) < 0 ? lhs : rhs;
}

export function max<T>(lhs: T, rhs: T, compareFn = compare): T {
  return compareFn(lhs, rhs) > 0 ? lhs : rhs;
}

export function equals<T>(lhs: T, rhs: T, compareFn = compare): boolean {
  return compareFn(lhs, rhs) === Ordering.Equal;
}

export function notEquals<T>(lhs: T, rhs: T, compareFn = compare): boolean {
  return compareFn(lhs, rhs) !== Ordering.Equal;
}

export function lessThan<T>(lhs: T, rhs: T, compareFn = compare): boolean {
  return (compareFn(lhs, rhs) === Ordering.Less);
}

export function lessOrEquals<T>(lhs: T, rhs: T, compareFn = compare): boolean {
  let result = compareFn(lhs, rhs);
  return (result === Ordering.Less || result === Ordering.Equal);
}

export function greaterThan<T>(lhs: T, rhs: T, compareFn = compare): boolean {
  return (compareFn(lhs, rhs) === Ordering.Greater);
}

export function greaterOrEquals<T>(lhs: T, rhs: T, compareFn = compare): boolean {
  let result = compareFn(lhs, rhs);
  return (result === Ordering.Greater || result === Ordering.Equal);
}
