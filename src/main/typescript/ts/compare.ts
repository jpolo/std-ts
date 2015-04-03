module compare {
  
  //Util
  var __ostring = {}.toString;
  var __isEmpty = function (o) { return o === null  || o === undefined; };
  var __str = function (o) { return "" + o; };
  var __stringTag = function (o: any) {
    var s = '';
    if (o === undefined) {
      s = 'Undefined';
    } else if (o === null) {
      s = 'Null';
    } else {
      var c = o.constructor;
      s = c && c.name || __ostring.call(o).slice(8, -1);
    }
    return s;
  };
  
  export enum Ordering {
    Less = -1,
    Equal = 0,
    Greater = 1
  }
  
  export interface ICompare {
    compare(o: any): Ordering;
  }
  
  export function compare<T>(lhs: T, rhs: T): Ordering {
    var returnValue: Ordering = null;
    var l = <any> lhs;
    var r = <any> rhs;
    switch (__stringTag(l)) {
      case 'Undefined': returnValue = r === undefined ? Ordering.Equal : null; break;
      case 'Null': returnValue = r === null ? Ordering.Equal : null; break;
      case 'Number': returnValue = compareNumber(l, r); break;
      case 'String': returnValue = compareString(l, r); break;
      default:
        if (typeof l.compare === "function") {
          returnValue = compareICompare(l, r);  
        }
    }
    return returnValue;
  }
  
  export function compareNumber(lhs: number, rhs: number): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : null) :
      (lhs = +lhs) === (rhs = +rhs) ? Ordering.Equal :
      lhs < rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  export function compareString(lhs: string, rhs: string): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : null) :
      (lhs = __str(lhs)) === (rhs = __str(rhs)) ? Ordering.Equal :
      lhs < rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  export function compareICompare(lhs: ICompare, rhs: ICompare): Ordering { 
    return (
      __isEmpty(lhs) ? (lhs === rhs ? Ordering.Equal : null) :
      lhs.compare(rhs)
    ); 
  }
  
  export function compareArray(lhs: Array<any>, rhs: Array<any>, compareFn = compare) {
    var returnValue = Ordering.Equal;
    var lhslen = lhs.length;
    var rhslen = rhs.length;
    
    for (var i = 0, l = lhslen < rhslen ? lhslen : rhslen; i < l; ++i) {
      returnValue = compareFn(lhs[i], rhs[i]);
      if (returnValue !== Ordering.Equal) {
        break;
      }
    }

    return returnValue; 
  }
  
  function compareDate(lhs: Date, rhs: Date): Ordering { return compareNumber(+lhs, +rhs); }
  
  function compareRegExp(lhs: RegExp, rhs: RegExp): Ordering { return compareString(__str(lhs), __str(rhs)); }
  
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
    var result = compareFn(lhs, rhs);
    return (result === Ordering.Less || result === Ordering.Equal);
  }
  
  export function greaterThan<T>(lhs: T, rhs: T, compareFn = compare): boolean {
    return (compareFn(lhs, rhs) === Ordering.Greater);
  }
  
  export function greaterOrEquals<T>(lhs: T, rhs: T, compareFn = compare): boolean {
    var result = compareFn(lhs, rhs);
    return (result === Ordering.Greater || result === Ordering.Equal);
  }
  
  
  
}
export = compare;