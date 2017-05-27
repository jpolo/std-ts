const Global: Window = typeof window !== 'undefined' ? window : (function () { return this }())
function IsGlobal (o: any) { return o === Global }
function IsObject (o: any) { return o !== null && (typeof o === 'object' || typeof o === 'function') }
function ToStringTag (o: any): string {
  let s = ''
  if (o === null) {
    s = 'Null'
  } else {
    switch (typeof o) {
      case 'boolean': s = 'Boolean'; break
      case 'function': s = 'Function'; break
      case 'number': s = 'Number'; break
      case 'string': s = 'String'; break
      case 'undefined': s = 'Undefined'; break
      default: /*object*/ s = o.constructor.name || Object.prototype.toString.call(o).slice(8, -1)
    }
  }
  return s
}
function ArraySlice<T> (a: { [k: number]: T; length: number }, start?: number, end?: number): T[] {
  const returnValue = []
  const l = returnValue.length
  start = start === undefined ? 0 : start
  end = end === undefined || l < end ? l : end
  for (let i = start; i < end; ++i) {
    returnValue.push(a[i])
  }
  return returnValue
}

enum Browser { IE, Chrome, Safari, Firefox, Opera, Other }

function ErrorCreate () {
  try {
    window['$$undef$$']()
  } catch (e) {
    return e
  }
}
function ErrorToString (name: string, message: string) {
  let returnValue = ''
  if (name !== undefined) {
    returnValue += name
  }
  if (message !== undefined) {
    returnValue += ': ' + message
  }
  return returnValue
}

/*
namespace errorParser {
  const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
  const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

  interface IParserData {

  }

  interface IParser {
    test(e: any): boolean;
    parse(e: any): CallSite;
  }

  function parseLocation(urlLike: string): [string, string, string] {
    // Fail-fast but return locations like "(native)"
    if (urlLike.indexOf(":") === -1) {
      return [urlLike, undefined, undefined];
    }

    let locationParts = urlLike.replace(/[\(\)\s]/g, "").split(":");
    let lastNumber = locationParts.pop();
    let possibleNumber = parseFloat(locationParts[locationParts.length - 1]);
    if (!isNaN(possibleNumber) && isFinite(possibleNumber)) {
        let lineNumber = locationParts.pop();
        return [locationParts.join(":"), lineNumber, lastNumber];
    } else {
        return [locationParts.join(":"), lastNumber, undefined];
    }
  }

  const parser_Opera: IParser = {
    test(e: any) {
      return typeof e.stacktrace !== "undefined" || typeof e["opera#sourceloc"] !== "undefined";
    },
    parse(e: any) {
      return null;
    }
  };

  const parser_V8_IE = {
    REGEXP: /^\s*at .*(\S+\:\d+|\(native\))/m,
    test(e: any) {
      return !!(e.stack && e.stack.match(parser_V8_IE.REGEXP));
    },
    parse(e: any) {
      let filtered = _filter(e.stack.split('\n'), function(line) {
        return !!line.match(parser_V8_IE.REGEXP);
      });

      return _map(filtered, function (line) {
          if (line.indexOf('(eval ') > -1) {
            line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
          }
          var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
          var locationParts = this.extractLocation(tokens.pop());
          var functionName = tokens.join(' ') || undefined;
          var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

          return {
            functionName: functionName,
            fileName: fileName
          }; locationParts[1], locationParts[2], line);
      });
    }
  };

  const parser_FF_Safari: IParser = {
    test(e: any) {
      return !!e.stack;
    },
    parse(e: any) {
      return null;
    }
  };

}*/

const ErrorParse = (function () {

  // Sniff browser
  const browser: Browser = (function (e: any) {
    let returnValue = Browser.Other
    if (e.arguments && e.stack) {
      returnValue = Browser.Chrome
    } else if (e.stack && e.sourceURL) {
      returnValue = Browser.Safari
    } else if (e.stack && e.number) {
      returnValue = Browser.IE
    } else if (e.stack && e.fileName) {
      returnValue = Browser.Firefox
    } else if (e.message && e.stack && e.stacktrace) {
      returnValue = Browser.Opera // use e.stacktrace, format differs from "opera10a", "opera10b"
    } else if (e.stack && !e.fileName) {
      // Chrome 27 does not have e.arguments as earlier versions,
      // but still does not have e.fileName as Firefox
      returnValue = Browser.Chrome
    }
    return returnValue
  }(ErrorCreate()))

  // Parse error line
  let __errorParseLines: (error: Error) => string[] = __errorParseLines_Other
  switch (browser) {
    case Browser.IE: __errorParseLines = __errorParseLines_IE; break
    case Browser.Chrome: __errorParseLines = __errorParseLines_Chrome; break
    case Browser.Firefox: __errorParseLines = __errorParseLines_Firefox; break
    case Browser.Opera: __errorParseLines = __errorParseLines_Opera; break
    case Browser.Safari: __errorParseLines = __errorParseLines_Safari; break
    default: __errorParseLines = __errorParseLines_Other; break
  }

  function __errorParseLines_Chrome (error: any): string[] {
    return (error.stack + '\n')
        .replace(/eval code/g, 'eval')
        .replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '')
        .replace(/^[\s\S]+?\s+at\s+/, ' at ') // remove message
        .replace(/^\s+(at eval )?at\s+/gm, '') // remove "at" and indentation
        .replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
        .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
        .replace(/^(.+) \((.+)\)$/gm, '$1@$2')
        .split('\n')
        .slice(0, -1)
  }

  function __errorParseLines_Firefox (error: any): string[] {
    return (error.stack)
      .replace(/(?:\n@:0)?\s+$/m, '')
      .replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@')
      .split('\n')
  }

  function __errorParseLines_IE (error: any): string[] {
    return (error.stack)
      .replace(/^\s*at\s+(.*)$/gm, '$1')
      .replace(/^Anonymous function\s+/gm, '{anonymous}() ')
      .replace(/^(.+)\s+\((.+)\)$/gm, '$1@$2')
      .split('\n')
      .slice(1)
  }

  function __errorParseLines_Opera (error: any): string[] {
    const ANON = '{anonymous}'
    const lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/
    const lines = error.stacktrace.split('\n')
    const result = []

    for (let i = 0, len = lines.length; i < len; i += 2) {
      const match = lineRE.exec(lines[i])
      if (match) {
        const location = match[4] + ':' + match[1] + ':' + match[2]
        const fnName = (match[3] || 'global code')
          .replace(/<anonymous function: (\S+)>/, '$1')
          .replace(/<anonymous function>/, ANON)
        result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''))
      }
    }
    return result
  }

  function __errorParseLines_Safari (error: any): string[] {
    return (error.stack)
      .replace(/\[native code\]\n/m, '')
      .replace(/^(?=\w+Error\:).*$\n/m, '')
      .replace(/^@/gm, '{anonymous}()@')
      .split('\n')
  }

  function __errorParseLines_Other (curr: any): string[] {
    const ANON = '{anonymous}'
    const fnRE = /function(?:\s+([\w$]+))?\s*\(/
    const stack = []
    let fn, args
    const maxStackSize = 10
    while (curr && stack.length < maxStackSize) {
      fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON
      try {
        args = ArraySlice(curr.arguments || [])
      } catch (e) {
        args = ['Cannot access arguments: ' + e]
      }
      stack[stack.length] = fn + '(' + _stringifyArguments(args) + ')'
      try {
        curr = curr.caller
      } catch (e) {
        stack[stack.length] = 'Cannot access caller: ' + e
        break
      }
    }
    return stack
  }

  function _stringifyArguments (args: any[]) {
    const argc = args.length
    const result = new Array(argc)
    for (let i = 0; i < argc; ++i) {
      const arg = args[i]
      switch (ToStringTag(arg)) {
        case 'Undefined':
          result[i] = 'undefined'
          break
        case 'Null':
          result[i] = 'null'
          break
        case 'Array':
          if (arg.length < 3) {
            result[i] = '[' + _stringifyArguments(arg) + ']'
          } else {
            result[i] = '[' +
              _stringifyArguments(ArraySlice(arg, 0, 1)) +
              '...' +
              _stringifyArguments(ArraySlice(arg, -1)) +
              ']'
          }
          break
        case 'Object':
          result[i] = '#object'
          break
        case 'Function':
          result[i] = '#function'
          break
        case 'String':
          result[i] = `"${args}"`
          break
        case 'Number':
          result[i] = arg
          break
        default:
          result[i] = '?'
      }
    }
    return result.join(',')
  }

  return function ErrorParse (error: any, offset = 0): CallSite[] {
    let items = __errorParseLines(error)
    if (offset > 0) {
      // shift from offset
      items = items.slice(offset)
    }

    const itemc = items.length
    const parsed = new Array(itemc)
    const parseCallSite = CallSite.parse
    for (let i = 0; i < itemc; ++i) {
      parsed[i] = parseCallSite(items[i])
    }
    return parsed
  }
}())
const __prepareStackTrace = (Error as any).prepareStackTrace || function (errorString: string, frames: ICallSite[]): string {

  // Adapted from V8 source:
  // https://github.com/v8/v8/blob/1613b7/src/messages.js#L1051-L1070
  const lines = []
  let frame: ICallSite
  let line
  lines.push(errorString)
  for (let i = 0, l = frames.length; i < l; i++) {
    frame = frames[i]
    try {
      line = CallSite.stringify(frame) // __str(frame);
    } catch (e) {
      try {
        line = '<error: ' + e + '>'
      } catch (ee) {
        // Any code that reaches this point is seriously nasty!
        line = '<error>'
      }
    }
    lines.push('    at ' + line)
  }
  return lines.join('\n')
}
const ErrorFrames = (function () {
  const GlobalError = (Error as any)
  const prepareStackTrace = GlobalError.prepareStackTrace
  const stackSink = function (_: any, stack: any) { return stack }
  return (GlobalError.captureStackTrace ?
    // v8
    function (offset) {
      GlobalError.prepareStackTrace = stackSink
      const stack = (new GlobalError() as any).stack.slice(1 + offset)
      if (prepareStackTrace === undefined) {
        delete GlobalError.prepareStackTrace
      } else {
        GlobalError.prepareStackTrace = prepareStackTrace
      }
      return stack
    } :
    function (offset) {
      return ErrorParse(ErrorCreate(), offset + 2)
    }
  ) as (offset: number) => ICallSite[]
}())
const __captureStackTrace = (Error as any).captureStackTrace || function (e: any, topLevel?: Function): void {

  // Simultaneously traverse the frames in error.stack and the arguments.caller
  // to build a list of CallSite objects
  // let factory = makeCallSiteFactory(e);
  const frames = ErrorParse(e)
  const errorString = ErrorToString(e.name, e.message)

  // Explicitly set back the error.name and error.message
  // e.name = frames.name;
  // e.message = frames.message;

  // Pass the raw callsite objects through and get back a formatted stack trace
  e.stack = __prepareStackTrace(errorString, frames)
}

// https://github.com/mattrobenolt/callsite-shim/blob/master/src/callsite.js
// https://github.com/stacktracejs/stacktrace.js/
// https://github.com/tj/callsite

// export interface ICallStack extends Array<ICallSite> {}

export interface ICallSite {
  getThis (): any
  getTypeName (): string
  getFunction (): Function
  getFunctionName (): string
  getMethodName (): string
  getFileName (): string
  getLineNumber (): number
  getColumnNumber (): number
  getEvalOrigin (): any
  isTopLevel (): boolean
  isEval (): boolean
  isNative (): boolean
  isConstructor (): boolean
  getArguments (): any // {[key: number]: any; length: number}
  toString (): string
}

type CallSiteData = {
  this: any;
  typeName: string;
  function: any;
  functionName: string;
  methodName: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  isTopLevel: boolean;
  isEval: boolean;
  isNative: boolean;
  isConstructor: boolean;
}

class CallSite implements ICallSite {

  protected '@@data': CallSiteData

  static parse (s: string): CallSite {
    return new CallSite(() => {
      const parts = s.split('@', 2)
      const receiver = Global
      const fun = null
      const functionName = parts[0] || ''
      let fileName = ''
      let typeName = ''
      let methodName = ''
      let lineNumber = NaN
      let columnNumber = NaN
      const location = parts[1] || ''
      const isAnonymous = location.indexOf('{anonymous}') !== -1
      const isEval = false
      const isNative = false // location.indexOf("native") !== -1;
      if (location.indexOf(':') !== -1) {
        const locationParts = /(.*):(\d+):(\d+)/.exec(location)
        fileName = locationParts[1]
        lineNumber = parseInt(locationParts[2], 10)
        columnNumber = parseInt(locationParts[3], 10)
      } else {
        fileName = location
      }

      if (!isAnonymous) {
        const functionParts = functionName.split('.')
        typeName = functionParts[0]
        methodName = functionParts[functionParts.length - 1]
      }
      // isEval
      // isEval = false;

      // isNative
      // isNative = false;

      // isConstructor
      const ctor = IsObject(receiver) ? receiver.constructor : null
      const isConstructor = !ctor ? false : fun === ctor

      // isTopLevel
      const isTopLevel = (receiver == null) || IsGlobal(receiver)

      return {
        columnNumber: columnNumber,
        fileName: fileName,
        function: fun,
        functionName: functionName,
        isConstructor: isConstructor,
        isEval: isEval,
        isNative: isNative,
        isTopLevel: isTopLevel,
        lineNumber: lineNumber,
        methodName: methodName,
        this: receiver,
        typeName: typeName
      }
    })
  }

  static stringify (o: ICallSite): string {
    let s = ''
    if (s === undefined) {
      s = 'undefined'
    } else if (s === null) {
      s = 'null'
    } else {
      const functionName = o.getFunctionName() || '{anonymous}'
      const lineNumber = o.getLineNumber()
      const columnNumber = o.getColumnNumber()

      s += o.getFileName()
      if (lineNumber) {
        s += ':' + lineNumber
        if (columnNumber) {
          s += ':' + columnNumber
        }
      }

      s = functionName ? functionName + ' (' + s +  ')' : s
    }
    return s
  }

  constructor (private _parse: () => CallSiteData) {
  }

  getThis (): any {
    return this.getData().this
  }

  getTypeName (): string {
    return this.getData().typeName
  }

  getFunction (): Function {
    return this.getData().function
  }

  getFunctionName (): string {
    return this.getData().functionName
  }

  getMethodName (): string {
    return this.getData().methodName
  }

  getFileName (): string {
    return this.getData().fileName
  }

  getLineNumber (): number {
    const d = this.getData()
    return d.lineNumber > 0 ? d.lineNumber : null
  }

  getColumnNumber (): number {
    const d = this.getData()
    return d.columnNumber > 0 ? d.columnNumber : null
  }

  getEvalOrigin (): any {
    //
  }

  isTopLevel (): boolean {
    return this.getData().isTopLevel
  }

  isEval (): boolean {
    return this.getData().isEval
  }

  isNative (): boolean {
    return this.getData().isNative
  }

  isConstructor (): boolean {
    return this.getData().isConstructor
  }

  getArguments () {
    const d = this.getData()
    return d.function && d.function.arguments || null
  }

  toString (): string {
    return CallSite.stringify(this)
  }

  protected getData () {
    let returnValue = this['@@data']
    if (!returnValue) {
      returnValue = this['@@data'] = this._parse()
    }
    return returnValue
  }

}

export function prepare (errorString: string, frames: ICallSite[]): string {
  return __prepareStackTrace(errorString, frames)
}

export function capture (e: { stack: any }, stripPoint?: Function): void {
  __captureStackTrace(e, stripPoint)
}

export function get (error: any): ICallSite[] {
  return ErrorParse(error)
}

export function create (): ICallSite[] {
  return ErrorFrames(1)
}
