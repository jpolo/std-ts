module clone {
  
  //Util
  var __create = Object.create;
  var __protoOf = Object.getPrototypeOf;
  var __descriptors = function (o: any): { [k: string]: PropertyDescriptor } {
    var descriptors: any = {};
    var props = Object.getOwnPropertyNames(o);
    var getDescriptor = Object.getOwnPropertyDescriptor;
    for (var i = 0, l = props.length; i < l; ++i) {
      var prop = props[i];
      descriptors[prop] = getDescriptor(o, prop);
    }
    return descriptors;
  };
  var __isDefined = function (o) { return o !== undefined && o !== null; };
  var __ostring = {}.toString;
  var __stringTag = function (o: any) {
    var c = o.constructor;
    return c && c.name || __ostring.call(o).slice(8, -1);
  };
  
  //Compat
  
  export interface IClone {
    clone(): any
  }
  
  export function isIClone(o: any): boolean {
    return !!o && (typeof o.clone === "function");  
  }
  
  export function clone<T>(o: T): T {
    var anyVal = <any> o;
    var returnValue: T = o;
    switch (typeof anyVal) {
    case "object":
      if (anyVal !== null) {
        if (isIClone(anyVal)) {
          returnValue = anyVal.clone();
        } else {
          switch (__stringTag(anyVal)) {
            case "Array": returnValue = <any> cloneArray(anyVal); break;
            case "Date": returnValue = <any> cloneDate(anyVal); break;
            case "RegExp": returnValue = <any> cloneRegExp(anyVal); break;
            default: returnValue = __create(__protoOf(anyVal), __descriptors(anyVal));
          }
        }
      }  
      break;
    case "function":
      var f: any = (<any> returnValue).__cloned__ = anyVal.__cloned__ || o;
      returnValue = <any> function () {
        var r: any;
        var t = this;
        var argc = arguments.length;

        switch (argc) {
          case 0: r = t ? f() : f.call(t); break;
          case 1: r = t ? f(arguments[0]): f.call(t, arguments[0]); break;
          case 2: r = t ? f(arguments[0], arguments[1]): f.call(t, arguments[0], arguments[1]); break;
          case 3: r = t ? f(arguments[0], arguments[1], arguments[2]): f.call(t, arguments[0], arguments[1], arguments[2]); break;
          case 4: r = t ? f(arguments[0], arguments[1], arguments[2], arguments[3]): f.call(t, arguments[0], arguments[1], arguments[2], arguments[3]); break;
          default: r = f.apply(t, arguments);
        }
        return r;
      };
        
      break;
    default://keep value
    }
    return returnValue;
  }
  
  function cloneBoolean(b: boolean): boolean {
    return b;  
  }
  
  function cloneNumber(n: number): number {
    return n;  
  }
  
  function cloneString(s: string): string {
    return s;  
  }
  
  function cloneArray<T>(a: T[]): T[] {
    return __isDefined(a) ? a.slice(0) : a;  
  }
  
  function cloneDate(d: Date): Date {
    return __isDefined(d) ? new Date(d.getTime()) : d;
  }
  
  function cloneRegExp(re: RegExp): RegExp {
    var returnValue = re;
    if (__isDefined(re)) {
      var flags = "";
      if (re.global) {
        flags += "g";
      }
      if (re.ignoreCase) {
        flags += "i";
      }
      if (re.multiline) {
        flags += "m";
      }
      if ((<any> re).sticky) {
        flags += 'y';
      }
      if ((<any> re).unicode) {
        flags += 'u';
      }
      returnValue = new RegExp(re.source, flags);
    }
    return returnValue;
  }
  
  function cloneMap<K, V>(m: Map<K, V>): Map<K, V> {
    var returnValue = m;
    if (__isDefined(m)) {
      returnValue = new Map<K, V>();
      m.forEach((v, k) => returnValue.set(k, v)); 
    }
    return returnValue;
  }
  
  function cloneSet<T>(s: Set<T>): Set<T> {
    var returnValue = s;
    if (__isDefined(s)) {
      returnValue = new Set<T>();
      s.forEach((v) => returnValue.add(v)); 
    }
    return returnValue;
  }
  
}
export = clone