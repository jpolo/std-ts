module compare {
  
  //Util
  var __ostring = {}.toString;
  var __isEmpty = function (o) { return o === null  || o === undefined; };
  var __isNaN = function (o) { return o !== o; };
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
  var __comparator = function <T>(o: T): (lhs: T, rhs: T) => Ordering {
    var returnValue: (lhs: any, rhs: any) => Ordering
    var tag = __stringTag(o);
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
  }
  
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
    return (o && typeof o.compare === "function");
  }
  
  export function compare<T>(lhs: T, rhs: T): Ordering {
    var returnValue: Ordering = Ordering.None;
    var l = <any> lhs;
    var r = <any> rhs;
    var cmpFn = __comparator(lhs) || __comparator(rhs);
    
    return (
      cmpFn ? cmpFn(lhs, rhs) : 
      lhs === rhs && __isEmpty(lhs)  ? Ordering.Equal : 
      Ordering.None
    );
  }
  
  export function compareBoolean(lhs: boolean, rhs: boolean): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
      lhs === rhs ? Ordering.Equal :
      +lhs < +rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  export function compareNumber(lhs: number, rhs: number): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
      __isNaN(lhs) || __isNaN(rhs) ? Ordering.None :
      (lhs = +lhs) === (rhs = +rhs) ? Ordering.Equal :
      lhs < rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  export function compareString(lhs: string, rhs: string): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
      (lhs = __str(lhs)) === (rhs = __str(rhs)) ? Ordering.Equal :
      lhs < rhs ? Ordering.Less :
      Ordering.Greater
    );
  }
  
  export function compareICompare(lhs: ICompare, rhs: ICompare): Ordering { 
    return (
      __isEmpty(lhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
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
  
  export function compareDate(lhs: Date, rhs: Date): Ordering {
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
      compareNumber(+lhs, +rhs)
    ); 
  }
  
  export function compareRegExp(lhs: RegExp, rhs: RegExp): Ordering { 
    return (
      __isEmpty(lhs) || __isEmpty(rhs) ? (lhs === rhs ? Ordering.Equal : Ordering.None) :
      compareString(__str(lhs), __str(rhs))
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