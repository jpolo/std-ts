module stacktrace {
  
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
  
  export function create(error?: Error, offset: number = 0): ICallStack {
    offset += (error ? 0 : 2)
    var items = _parseError(error || _createError())
    if (offset > 0) {
      items = items.slice(offset)
    }
    var itemc = items.length
    var parsed = new Array(itemc)
    for (var i = 0; i < itemc; ++i) {
      parsed[i] = _parseCallSite(items[i])
    }
    return parsed
  }
  
  enum Browser { IE, Chrome, Safari, Firefox, Opera, Other }
  
  var browser = null

  function _parseError(error: Error): string[] {
    if (browser == null) {
      browser = _parseBrowser(error)
    }
    switch (browser) {
      case Browser.IE: return _parseError_IE(error)
      case Browser.Chrome: return _parseError_Chrome(error)
      case Browser.Firefox: return _parseError_Firefox(error)
      case Browser.Opera: return _parseError_Opera(error)
      case Browser.Safari: return _parseError_Safari(error)
      default: return _parseError_Other(arguments.callee)
    }
  }

  function _parseCallSite(s: string): ICallSite {
    var parts = s.split("@", 2)
    var functionName = parts[0] || ""
    var location = parts[1] || ""

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

  function _parseError_Chrome(error: any): string[] {
    return (error.stack + '\n')
        .replace(/^[\s\S]+?\s+at\s+/, ' at ') // remove message
        .replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
        .replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
        .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
        .replace(/^(.+) \((.+)\)$/gm, '$1@$2')
        .split('\n')
        .slice(0, -1)
  }

  function _parseError_Firefox(error: any): string[] {
    return (error.stack)
      .replace(/(?:\n@:0)?\s+$/m, '')
      .replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@')
      .split('\n')
  }

  function _parseError_IE(error: any): string[] {
    return (error.stack)
      .replace(/^\s*at\s+(.*)$/gm, '$1')
      .replace(/^Anonymous function\s+/gm, '{anonymous}() ')
      .replace(/^(.+)\s+\((.+)\)$/gm, '$1@$2')
      .split('\n')
      .slice(1)
  }

  function _parseError_Opera(error: any): string[] {
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

  function _parseError_Safari(error: any): string[] {
    return (error.stack)
      .replace(/\[native code\]\n/m, '')
      .replace(/^(?=\w+Error\:).*$\n/m, '')
      .replace(/^@/gm, '{anonymous}()@')
      .split('\n')
  }

  function _parseError_Other(curr): string[] {
    var ANON = '{anonymous}'
    var fnRE = /function(?:\s+([\w$]+))?\s*\(/
    var stack = []
    var fn, args
    var maxStackSize = 10
    while (curr && stack.length < maxStackSize) {
      fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON
      try {
        args = __arraySlice(curr['arguments'] || [])
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

  function _parseBrowser(e: any): Browser {
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

  function _createError() {
    try {
      this['$$undef$$']()
    } catch (e) {
      return e
    }
  }

  function _stringifyArguments(args: any[]) {
    var argc = args.length
    var result = new Array(argc)
    for (var i = 0; i < argc; ++i) {
      var arg = args[i]
      switch(__stringTag(arg)) {
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
              _stringifyArguments(__arraySlice(arg, 0, 1)) +
              '...' +
              _stringifyArguments(__arraySlice(arg, -1)) +
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
          result[i] = '"' + arg + '"'
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
  
  
  
  //util
  var __ostring = Object.prototype.toString
  function __stringTag(o: any): string {
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
        default: /*object*/ s = __ostring.call(o).slice(8, -1);
      }
    }
    return s;
  }
  function __arraySlice<T>(a: { [k: number]: T; length: number }, start?: number, end?: number): T[] {
    var returnValue = [];
    var l = returnValue.length;
    start = start || 0;
    end = end == null || l < end ? l : end;
    for (var i = start; i < end; ++i) {
      returnValue.push(a[i]);
    }
    return returnValue;
  }
  
}
export = stacktrace