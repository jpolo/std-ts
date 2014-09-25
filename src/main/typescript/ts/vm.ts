module vm {
  var _global: Window = (new Function("return this;")).call(null)
  var _objectToString = Object.prototype.toString
  var _Symbol = _global['Symbol']
  //var $$iterator = _Symbol && _Symbol.iterator
  var $$toStringTag = _Symbol && _Symbol.toStringTag


  enum Browser { IE, Chrome, Safari, Firefox, Opera, Other }

  export interface IContext { [key: string]: any }

  export interface ICallStack extends Array<ICallSite> {}

  export interface ICallSite {
    typeName: string
    functionName: string
    methodName: string
    fileName: string
    lineNumber: number
    columnNumber: number
    //isToplevel: boolean
    //isEval: boolean
    //isNative: boolean
    //isConstructor: boolean
  }

  export var global = _global

  export function typeOf(o: any): string {
    return typeof o
  }

  export function isInstanceOf(o: any, Class: Function): boolean {
    return (o != null) && o instanceof Class
  }

  export function stringTag(o: any): string {
    return $$toStringTag ? o && o[$$toStringTag] : _objectToString.call(o).slice(8, -1)
  }

  export function dump(o: any): string {
    var maxElements = 7
    var s = ''
    switch (stringTag(o)) {
      case 'Boolean':
      case 'Undefined':
      case 'Null':
      case 'Number':
      case 'RegExp':
        s = String(o)
        break
      case 'String':
        s = '"' + String(o).replace(/"/g, '\\"' ) + '"'
        break
      case 'Function':
        s = String(o)
        s = s.slice(0, s.indexOf('{')) + '...}'
        break
      case 'Array':
        var array = (<any[]>o)
        var truncate = array.length > maxElements
        if (truncate) {
          array = array.slice(0, maxElements)
        }
        s = '[' + array.map(dump).join(', ') + (truncate ? ', ...' : '') + ']'
        break
      case 'Date':
        var date = (<Date>o)
        s = 'Date(' + date.toISOString() + ')'
        break
      default:
        if (typeof o.inspect === 'function') {
          s = o.inspect()
        } else {
          s = String(o)
        }
    }
    return s
  }

  export function compile(jscode: string): (context?: IContext) => any {
    var fnWithContext: Function
    var fnNoContext: Function  
    
    return function (context) {
      var returnValue
      if (context) {
        fnWithContext = fnWithContext || new Function("__context__", "with(__context__) { " + jscode + "}")
        returnValue = fnWithContext.call(context, context)
      } else {
        fnNoContext = fnNoContext || new Function(jscode)
        returnValue = fnNoContext()
      }
      
      return returnValue
    }
  }

  export function run(jscode: string, context?: IContext): any {
    return compile(jscode)(context)
  }

  export function callstack(offset: number = 0, error?: Error): ICallStack {
    offset += (error ? 0 : 2)
    var returnValue = parseError(error || createError()).slice(offset).map(parseCallSite)
    return /*!!options.guess ? guessAnonymousFunctions(result) : */returnValue
  }

  function parseError(error: any): string[] {
    switch (parseBrowser(error)) {
      case Browser.IE: return parseError_IE(error)
      case Browser.Chrome: return parseError_Chrome(error)
      case Browser.Firefox: return parseError_Firefox(error)
      case Browser.Opera: return parseError_Opera(error)
      case Browser.Safari: return parseError_Safari(error)
      default: return parseError_Other(arguments.callee)
    }
  }

  function parseCallSite(s: string): ICallSite {
    var parts = s.split("@", 2)
    var functionName = parts[0]
    var location = parts[1]

    var typeName = ""
    var methodName = ""
    var fileName = location
    var lineNumber: number = null
    var columnNumber: number = null
    var isAnonymous = location.indexOf("{anonymous}") !== -1
    if (location.indexOf(':') !== -1) {
      var locationParts = /(.*):(\d+):(\d+)/.exec(location)
      fileName = locationParts[1]
      lineNumber = parseInt(locationParts[2])
      columnNumber = parseInt(locationParts[3])
    }

    if (!isAnonymous) {
      var functionParts = functionName.split('.')
      typeName = functionParts[0]
      methodName = functionParts[functionParts.length - 1]
    }

    return {
      typeName: typeName,
      functionName: isAnonymous ? "" : functionName,
      methodName: methodName,
      fileName: fileName,
      lineNumber: lineNumber,
      columnNumber: columnNumber
    }
  }

  function parseError_Chrome(error: any): string[] {
    return (error.stack + '\n')
        .replace(/^[\s\S]+?\s+at\s+/, ' at ') // remove message
        .replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
        .replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
        .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
        .replace(/^(.+) \((.+)\)$/gm, '$1@$2')
        .split('\n')
        .slice(0, -1)
  }

  function parseError_Firefox(error: any): string[] {
    return (error.stack)
      .replace(/(?:\n@:0)?\s+$/m, '')
      .replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@')
      .split('\n')
  }

  function parseError_IE(error: any): string[] {
    return (error.stack)
      .replace(/^\s*at\s+(.*)$/gm, '$1')
      .replace(/^Anonymous function\s+/gm, '{anonymous}() ')
      .replace(/^(.+)\s+\((.+)\)$/gm, '$1@$2')
      .split('\n')
      .slice(1)
  }

  function parseError_Opera(error: any): string[] {
    var ANON = '{anonymous}'
    var lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/
    var lines = error.stacktrace.split('\n')
    var result = []

    for (var i = 0, len = lines.length; i < len; i += 2) {
      var match = lineRE.exec(lines[i])
      if (match) {
        var location = match[4] + ':' + match[1] + ':' + match[2]
        var fnName = match[3] || "global code"
        fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON)
        result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''))
      }
    }
    return result
  }

  function parseError_Safari(error: any): string[] {
    return (error.stack)
      .replace(/\[native code\]\n/m, '')
      .replace(/^(?=\w+Error\:).*$\n/m, '')
      .replace(/^@/gm, '{anonymous}()@')
      .split('\n')
  }

  function parseError_Other(curr): string[] {
    var ANON = '{anonymous}'
    var fnRE = /function(?:\s+([\w$]+))?\s*\(/
    var stack = []
    var fn, args
    var maxStackSize = 10
    var slice = Array.prototype.slice
    while (curr && stack.length < maxStackSize) {
      fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON
      try {
        args = slice.call(curr['arguments'] || [])
      } catch (e) {
        args = ['Cannot access arguments: ' + e]
      }
      stack[stack.length] = fn + '(' + stringifyArguments(args) + ')'
      try {
        curr = curr.caller
      } catch (e) {
        stack[stack.length] = 'Cannot access caller: ' + e
        break
      }
    }
    return stack
  }

  function parseBrowser(e: any): Browser {
    var returnValue = Browser.Other
    if (e['arguments'] && e.stack) {
      returnValue = Browser.Chrome
    } else if (e.stack && e.sourceURL) {
      returnValue = Browser.Safari
    } else if (e.stack && e['number']) {
      returnValue = Browser.IE
    } else if (e.stack && e.fileName) {
      returnValue = Browser.Firefox
    } else if (e.message && e.stack && e.stacktrace) {
      returnValue = Browser.Opera // use e.stacktrace, format differs from 'opera10a', 'opera10b'
    } else if (e.stack && !e.fileName) {
      // Chrome 27 does not have e.arguments as earlier versions,
      // but still does not have e.fileName as Firefox
      returnValue = Browser.Chrome
    }
    return returnValue
  }

  function createError() {
    try {
      window['undef']()
    } catch (e) {
      return e
    }
  }

  /*instrumentFunction(context, functionName: string, callback) {
      context = context || window
      var original = context[functionName]
      context[functionName] = function instrumented() {
        callback.call(this, printStackTrace().slice(4))
        return context[functionName]._instrumented.apply(this, arguments)
      }
      context[functionName]._instrumented = original
    }

    deinstrumentFunction(context, functionName: string) {
      if (context[functionName].constructor === Function &&
        context[functionName]._instrumented &&
        context[functionName]._instrumented.constructor === Function) {
        context[functionName] = context[functionName]._instrumented
      }
    }*/

  function stringifyArguments(args: any[]) {
    var argc = args.length
    var result = []
    var slice = Array.prototype.slice
    for (var i = 0; i < args.length; ++i) {
      var arg = args[i]
      if (arg === undefined) {
        result[i] = 'undefined'
      } else if (arg === null) {
        result[i] = 'null'
      } else if (arg.constructor) {
        // TODO constructor comparison does not work for iframes
        if (arg.constructor === Array) {
          if (arg.length < 3) {
            result[i] = '[' + stringifyArguments(arg) + ']'
          } else {
            result[i] = '[' +
              stringifyArguments(slice.call(arg, 0, 1)) +
              '...' +
              stringifyArguments(slice.call(arg, -1)) +
              ']'
          }
        } else if (arg.constructor === Object) {
          result[i] = '#object'
        } else if (arg.constructor === Function) {
          result[i] = '#function'
        } else if (arg.constructor === String) {
          result[i] = '"' + arg + '"'
        } else if (arg.constructor === Number) {
          result[i] = arg
        } else {
          result[i] = '?'
        }
      }
    }
    return result.join(',')
  }
}

export = vm
