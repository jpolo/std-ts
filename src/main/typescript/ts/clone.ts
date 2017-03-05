// Util
class ObjectConstructor {}
function ObjectCreate(proto: any, descriptors: any) {
  let returnValue;
  if (Object.create) {
    returnValue = Object.create(proto, descriptors);
  } else {
    ObjectConstructor.prototype = proto;
    const o: any = new ObjectConstructor();
    ObjectConstructor.prototype = null;
    returnValue = o;
  }
  return returnValue;
}
function GetPrototypeOf(o: any) {
  return Object.getPrototypeOf ? Object.getPrototypeOf(o) : o.__proto__;
}
function OwnDescriptors(o: any): { [k: string]: PropertyDescriptor } {
  const descriptors: any = {};
  if (Object.getOwnPropertyNames) {
    const props = Object.getOwnPropertyNames(o);
    const getDescriptor = Object.getOwnPropertyDescriptor;
    for (const prop of props) {
      descriptors[prop] = getDescriptor(o, prop);
    }
  } else {
    for (const prop in o) {
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
  const c = o.constructor;
  return c && c.name || Object.prototype.toString.call(o).slice(8, -1);
}

export interface IClone {
  clone(): any;
}

export function isIClone(o: any): o is IClone {
  return !!o && (typeof o.clone === 'function');
}

export function clone<T>(o: T): T {
  const anyVal = o as any;
  let returnValue: T = o;
  switch (typeof anyVal) {
    case 'object':
      if (anyVal !== null) {
        if (isIClone(anyVal)) {
          returnValue = anyVal.clone();
        } else {
          switch (ToStringTag(anyVal)) {
            case 'Array': returnValue = cloneArray(anyVal) as any; break;
            case 'Date': returnValue = cloneDate(anyVal) as any; break;
            // case "Map": returnValue = <any> cloneMap(anyVal); break;
            case 'RegExp': returnValue = cloneRegExp(anyVal) as any; break;
            // case "Set": returnValue = <any> cloneSet(anyVal); break;
            default: returnValue = ObjectCreate(GetPrototypeOf(anyVal), OwnDescriptors(anyVal));
          }
        }
      }
      break;
    case 'function':
      const f: any = (returnValue as any).__cloned__ = anyVal.__cloned__ || o;
      returnValue = function () {
        let r: any;
        const t = this;
        const argc = arguments.length;

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
      } as any;

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
    let flags = '';
    if (re.global) {
      flags += 'g';
    }
    if (re.ignoreCase) {
      flags += 'i';
    }
    if (re.multiline) {
      flags += 'm';
    }
    if ((re as any).sticky) {
      flags += 'y';
    }
    if ((re as any).unicode) {
      flags += 'u';
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
