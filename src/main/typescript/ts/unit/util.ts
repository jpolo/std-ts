// Avoid import here
const global: any = typeof window !== 'undefined' ? window : (function () { return this }())
const $$is = 'is'

export const INT8_MIN_VALUE = -0x80
export const INT8_MAX_VALUE = 0x7f
export const INT16_MIN_VALUE = -0x8000
export const INT16_MAX_VALUE = 0x7fff
export const INT32_MIN_VALUE = -0x80000000
export const INT32_MAX_VALUE = 0x7fffffff
export const UINT8_MIN_VALUE = 0
export const UINT8_MAX_VALUE = 0xff
export const UINT16_MIN_VALUE = 0
export const UINT16_MAX_VALUE = 0xffff
export const UINT32_MIN_VALUE = 0
export const UINT32_MAX_VALUE = 0xffffffff
export const DATE_MAX_MILLISECONDS = 8640000000000000
export const DATE_MIN_MILLISECONDS = -DATE_MAX_MILLISECONDS
export const EPSILON = 2.220446049250313e-16

export function IsExtensible (o: any): boolean { return Object.isExtensible ? Object.isExtensible(o) : true }
export function IsFinite (o: any): boolean { return global.isFinite(o) }
export function IsEmpty (o: any): boolean { return o === undefined || o === null }
export function IsNaN (o: any): boolean { return o !== o }
export function IsNumber (o: any): o is number { return typeof o === 'number' }
export function IsFunction (o: any): o is Function { return typeof o === 'function' }
export function IsObject (o: any) { return o !== null && (typeof o === 'object') }
export function SameValue (a: any, b: any) {
  return Object[$$is] ? Object[$$is](a, b) : a === b ? (a !== 0 || 1 / a === 1 / b) : IsNaN(a) && IsNaN(b)
}
export function OwnKeys (o: any): string[] {
  let keys: string[]
  if (Object.keys) {
    keys = Object.keys(o)
  } else {
    keys = []
    for (const prop in o) { if (o.hasOwnProperty(prop)) { keys.push(prop) } }
  }
  return keys
}
export function OwnKeysSorted (o: any) { return OwnKeys(o).sort() }
export function ObjectAssign<T, U> (o: T, ext: U): T & U { for (const key of OwnKeys(ext)) { o[key] = ext[key] } return o as any }
export function ObjectFreeze<T> (o: T): T { return Object.freeze ? Object.freeze(o) : o }
export function GetPrototypeOf (o: any) { return Object.getPrototypeOf ? Object.getPrototypeOf(o) : o.__proto__ }
export function Type (o: any): string {
  const t = typeof o
  switch (t) {
    case 'undefined':
    case 'function':
    case 'boolean':
    case 'number':
    case 'string':
    case 'symbol':
      return t
    default: // object
      if (o === null) {
        return 'null'
      } else if (o instanceof global.Symbol) {
        return 'symbol'
      } else {
        return 'object'
      }
  }
}
export function ToString (o: any) { return '' + o }
export function ToStringTag (o: any): string {
  switch (Type(o)) {
    case 'null': return 'Null'
    case 'boolean': return 'Boolean'
    case 'function': return 'Function'
    case 'number': return 'Number'
    case 'string': return 'String'
    case 'undefined': return 'Undefined'
    default: /*object*/
      const c = o.constructor
      return c && c.name || Object.prototype.toString.call(o).slice(8, -1)
  }
}

export function Call (f: Function, thisp: any, args: any[]) {
  const argc = args && args.length || 0
  switch (argc) {
    case 0: return thisp ? f.call(thisp) : f()
    case 1: return thisp ? f.call(thisp, args[0]) : f(args[0])
    case 2: return thisp ? f.call(thisp, args[0], args[1]) : f(args[0], args[1])
    default: return f.apply(thisp, args)
  }
}

export function FunctionToString (f: Function): string {
  return Function.prototype.toString.call(f)
}
export function FunctionToSource (f: Function): string {
  const src = FunctionToString(f)
  return src.slice(src.indexOf('{'), -1).trim()
}
export function Now () { return Date.now ? Date.now() : new Date().getTime() }
