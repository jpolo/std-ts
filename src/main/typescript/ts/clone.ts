// Util
class ObjectConstructor {}
function ObjectCreate(proto: any, descriptors: any) {
  let returnValue;
  if (Object.create) {
    returnValue = Object.create(proto, descriptors);
  } else {
    ObjectConstructor.prototype = proto;
    let o: any = new ObjectConstructor();
    ObjectConstructor.prototype = null;
    returnValue = o;
  }
  return returnValue;
}
function GetPrototypeOf(o: any) {
  return Object.getPrototypeOf ? Object.getPrototypeOf(o) : o.__proto__;
}
function OwnDescriptors(o: any): { [k: string]: PropertyDescriptor } {
  let descriptors: any = {};
  if (Object.getOwnPropertyNames) {
    let props = Object.getOwnPropertyNames(o);
    let getDescriptor = Object.getOwnPropertyDescriptor;
    for (let prop of props) {
      descriptors[prop] = getDescriptor(o, prop);
    }
  } else {
    for (let prop in o) {
      if (o.hasOwnProperty(prop)) {
        descriptors[prop] = {
          configurable: true,
          enumerable: true,
          value: o[prop],
          writable: true
        };
      }
    }
  }
  return descriptors;
}
function IsDefined(o: any) { return o !== undefined && o !== null; }
function ToStringTag(o: any) {
  let c = o.constructor;
  return c && c.name || Object.prototype.toString.call(o).slice(8, -1);
}

export interface IClone {
  clone(): any;
}

export function isIClone(o: any): boolean {
  return !!o && (typeof o.clone === "function");
}

export function clone<T>(o: T): T {
  let anyVal = <any> o;
  let returnValue: T = o;
  switch (typeof anyVal) {
  case "object":
    if (anyVal !== null) {
      if (isIClone(anyVal)) {
        returnValue = anyVal.clone();
      } else {
        switch (ToStringTag(anyVal)) {
          case "Array": returnValue = <any> cloneArray(anyVal); break;
          case "Date": returnValue = <any> cloneDate(anyVal); break;
          // case "Map": returnValue = <any> cloneMap(anyVal); break;
          case "RegExp": returnValue = <any> cloneRegExp(anyVal); break;
          // case "Set": returnValue = <any> cloneSet(anyVal); break;
          default: returnValue = ObjectCreate(GetPrototypeOf(anyVal), OwnDescriptors(anyVal));
        }
      }
    }
    break;
  case "function":
    let f: any = (<any> returnValue).__cloned__ = anyVal.__cloned__ || o;
    returnValue = <any> function () {
      let r: any;
      let t = this;
      let argc = arguments.length;

      switch (argc) {
        case 0: r = t ? f() : f.call(t); break;
        case 1: r = t ? f(arguments[0]) : f.call(t, arguments[0]); break;
        case 2: r = t ? f(arguments[0], arguments[1]) : f.call(t, arguments[0], arguments[1]); break;
        case 3: r = t ? f(arguments[0], arguments[1], arguments[2]) : f.call(t, arguments[0], arguments[1], arguments[2]); break;
        case 4: r = t ? f(
          arguments[0],
          arguments[1],
          arguments[2],
          arguments[3]) :
          f.call(t,
           arguments[0],
           arguments[1],
           arguments[2],
           arguments[3]
         );
         break;
        default: r = f.apply(t, arguments);
      }
      return r;
    };

    break;
  default: // keep value
  }
  return returnValue;
}

export function cloneBoolean(b: boolean): boolean {
  return b;
}

export function cloneNumber(n: number): number {
  return n;
}

export function cloneString(s: string): string {
  return s;
}

export function cloneArray<T>(a: T[]): T[] {
  const length = a.length;
  const returnValue = new Array(length);
  for (let i = 0; i < length; i++) {
    returnValue[i] = a[i];
  }
  return returnValue;
}

export function cloneDate(d: Date): Date {
  return new Date(d.getTime());
}

export function cloneRegExp(re: RegExp): RegExp {
  let returnValue = re;
  if (IsDefined(re)) {
    let flags = "";
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
      flags += "y";
    }
    if ((<any> re).unicode) {
      flags += "u";
    }
    returnValue = new RegExp(re.source, flags);
  }
  return returnValue;
}

/*
export function cloneMap<K, V>(m: Map<K, V>): Map<K, V> {
  let returnValue = m;
  if (__isDefined(m)) {
    returnValue = new Map<K, V>();
    m.forEach((v, k) => returnValue.set(k, v));
  }
  return returnValue;
}

export function cloneSet<T>(s: Set<T>): Set<T> {
  let returnValue = s;
  if (__isDefined(s)) {
    returnValue = new Set<T>();
    s.forEach((v) => returnValue.add(v));
  }
  return returnValue;
}
*/
