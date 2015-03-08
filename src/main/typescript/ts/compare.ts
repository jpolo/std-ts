module compare {
  
  export enum Ordering {
    Less = -1,
    Equal = 0,
    Greater = 1
  }
  
  export interface ICompare {
    compare(o: any): Ordering;
  }
  
  function compare<T>(lhs: T, rhs: T): Ordering {
    var returnValue: Ordering = null;
    var l = <any> lhs;
    var r = <any> rhs;
    switch (__stringTag(l)) {
      case 'Undefined': returnValue = r === undefined ? Ordering.Equal : null; break;
      case 'Null': returnValue = r === null ? Ordering.Equal : null; break;
      case 'Number': returnValue = compareNumber(l, r); break;
      case 'String': returnValue = compareString(l, r); break;
      default:
        if (__isFunction(l.compare)) {
          returnValue = compareICompare(l, r);  
        }
    }
    return returnValue;
  }
  
  function compareNumber(lhs: number, rhs: number): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : null) :
      (lhs = +lhs) === (rhs = +rhs) ? Ordering.Equal :
      lhs < rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  function compareString(lhs: string, rhs: string): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : null) :
      (lhs = __str(lhs)) === (rhs = __str(rhs)) ? Ordering.Equal :
      lhs < rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  function compareICompare(lhs: ICompare, rhs: ICompare): Ordering { 
    return (
      __isEmpty(lhs) ? (lhs === rhs ? Ordering.Equal : null) :
      lhs.compare(rhs)
    ); 
  }
  
  function compareArray(l: Array<any>, r: Array<any>) { return null; }
  function compareDate(l: Date, r: Date): Ordering { return compareNumber(+l, +r); }
  function compareRegExp(l: RegExp, r: RegExp): Ordering { return compareString(__str(l), __str(r)); }
  
  function min<T>(l: T, r: T, compareFn = compare): T {
    return compareFn(l, r) < 0 ? l : r;
  }
  
  function max<T>(l: T, r: T, compareFn = compare): T {
    return compareFn(l, r) > 0 ? l : r;
  }
  
  function equals<T>(l: T, r: T, compareFn = compare): boolean {
    return compareFn(l, r) === Ordering.Equal;
  }
  
  function notEquals<T>(l: T, r: T, compareFn = compare): boolean {
    return compareFn(l, r) !== Ordering.Equal;
  }
  
  function lessThan<T>(l: T, r: T, compareFn = compare): boolean {
    return (compareFn(l, r) === Ordering.Less);
  }
  
  function lessOrEquals<T>(l: T, r: T, compareFn = compare): boolean {
    var result = compareFn(l, r);
    return (result === Ordering.Less || result === Ordering.Equal);
  }
  
  function greaterThan<T>(l: T, r: T, compareFn = compare): boolean {
    return (compareFn(l, r) === Ordering.Greater);
  }
  
  function greaterOrEquals<T>(l: T, r: T, compareFn = compare): boolean {
    var result = compareFn(l, r);
    return (result === Ordering.Greater || result === Ordering.Equal);
  }
  
  var __ostring = {}.toString;
  var __isEmpty = function (o) { return o === null  || o === undefined; };
  var __isFunction = function (o) { return typeof o === "function"; };
  var __str = String;
  var __stringTag = function (o: any) {
    var s = '';
    if (o === null) {
      s = 'Null';
    } else {
      switch(typeof o) {
        case 'boolean': s = 'Boolean'; break;
        case 'function': s = 'Function'; break;
        case 'number': s = 'Number'; break;
        case 'string': s = 'String'; break;
        case 'undefined': s = 'Undefined'; break;
        default: /*object*/ s = o.constructor.name || __ostring.call(o).slice(8, -1);
      }
    }
    return s;
  };
  
}
export = compare;