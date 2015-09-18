//Avoid import here
const global: any = typeof window !== "undefined" ? window : (function() { return this; }());

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

export const IsExtensible = Object.isExtensible || function (o: any) { return true }
export const IsFinite = isFinite
export const IsEmpty = function (o: any) { return o === undefined || o === null }
export const IsNaN = function (o: any) { return o !== o }
export const IsNumber = function (o: any) { return typeof o === 'number' }
export const IsObject = function (o: any) { return o !== null && (typeof o == "object") }
export const SameValue = Object['is'] || function (a: any, b: any) { return a === b ? (a !== 0 || 1 / a === 1 / b) : IsNaN(a) && IsNaN(b) }
export const ObjectKeys = Object.keys || function (o: any): string[] { let keys = []; for (let prop in o) { if (o.hasOwnProperty(prop)) { keys.push(prop); } } return keys; }
export const ObjectKeysSorted = function (o: any) { return ObjectKeys(o).sort() }
export const ObjectFreeze = Object.freeze || function <T>(o: T): T { return o }
export const GetPrototypeOf = Object.getPrototypeOf || function (o: any) { return o.__proto__ }
export const Type = function (o: any): string {
  let t = typeof o
  switch (t) {
  case 'undefined':
  case 'boolean':
  case 'number':
  case 'string':
  case 'symbol':
    break
  default://object
    if (o === null)  {
      t = 'null'
    } else if (o instanceof global.Symbol) {
      t = 'symbol'
    } else {
      t = "object"
    }
  }
  return t
}
export const ToString = function (o: any) { return "" + o }
export const ToStringTag = function (o: any): string {
  let s = ''
  switch (Type(o)) {
    case "null": s = 'Null'; break;
    case "boolean": s = 'Boolean'; break;
    case "function": s = 'Function'; break;
    case "number": s = 'Number'; break;
    case "string": s = 'String'; break;
    case "undefined": s = 'Undefined'; break;
    default: /*object*/
      let c = o.constructor
      s = c && c.name || Object.prototype.toString.call(o).slice(8, -1)
  }
  return s;
}

/*export const FunctionCall = function (f: Function, thisp: any, args: any[]) {
  let argc = args && args.length || 0
  switch (argc) {
    case 0: return thisp ? f.call(thisp) : f()
    case 1: return thisp ? f.call(thisp, args[0]) : f(args[0])
    case 2: return thisp ? f.call(thisp, args[0], args[1]) : f(args[0], args[1])
    default: return f.apply(thisp, args)
  }
}*/
export const FunctionToString = function (f: Function): string {
  return Function.prototype.toString.call(f)
}
export const FunctionToSource = function (f: Function): string {
  let src = FunctionToString(f)
  return src.slice(src.indexOf("{"), -1).trim()
}
export const Now = Date.now || function () { return new Date().getTime() }
