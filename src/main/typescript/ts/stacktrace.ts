module stacktrace {
  var PARSED = "@@data";
  
  // https://github.com/mattrobenolt/callsite-shim/blob/master/src/callsite.js
  // https://github.com/stacktracejs/stacktrace.js/
  // https://github.com/tj/callsite
  
  //export interface ICallStack extends Array<ICallSite> {}

  export interface ICallSite {
    getThis(): any
    getTypeName(): string;
    getFunction(): Function
    getFunctionName(): string
    getMethodName(): string
    getFileName(): string
    getLineNumber(): number
    getColumnNumber(): number
    getEvalOrigin(): any
    isTopLevel(): boolean
    isEval(): boolean
    isNative(): boolean
    isConstructor(): boolean
    getArguments(): any // {[key: number]: any; length: number}
    toString(): string
  }
  
  class CallSite implements ICallSite {
    
    static parse(s: string): CallSite {
      return new CallSite(s);
    }
    
    static stringify(o: ICallSite): string {
      var s = "";
      var functionName = o.getFunctionName();
      var lineNumber = o.getLineNumber();
      var columnNumber = o.getColumnNumber();
      
      s += o.getFileName();
      if (lineNumber) {
        s += ":" + lineNumber;
        if (columnNumber) {
          s += ":" + columnNumber;
        }
      }
      return functionName ? functionName + ' (' + s +  ')' : s;
    }
    
    "@@data": {
      _this: any;
      _typeName: string;
      _function: any;
      _functionName: string;
      _methodName: string;
      _fileName: string;
      _lineNumber: number;
      _columnNumber: number;
      _isTopLevel: boolean;
      _isEval: boolean;
      _isNative: boolean;
      _isConstructor: boolean;
    };
    
    constructor(private _s: string) {
    }
    
    getThis(): any {
      return this._parse()._this;
    }
    
    getTypeName(): string {
      return this._parse()._typeName;
    }

    getFunction(): Function {
      return this._parse()._function;
    }

    getFunctionName(): string {
      return this._parse()._functionName;
    }

    getMethodName(): string {
      return this._parse()._methodName;
    }

    getFileName(): string {
      return this._parse()._fileName;
    }

    getLineNumber(): number {
      var d = this._parse();
      return d._lineNumber > 0 ? d._lineNumber : null;
    }

    getColumnNumber(): number {
      var d = this._parse();
      return d._columnNumber > 0 ? d._columnNumber : null;
    }

    getEvalOrigin(): any {
      //
    }

    isTopLevel(): boolean {
      return this._parse()._isTopLevel;
    }

    isEval(): boolean {
      return this._parse()._isEval;
    }

    isNative(): boolean {
      return this._parse()._isNative;
    }

    isConstructor(): boolean {
      return this._parse()._isConstructor;
    }

    getArguments() {
      var d= this._parse();
      return d._function && d._function['arguments'] || null;
    }

    toString(): string {
      return CallSite.stringify(this);
    }
    
    private _parse() {
      var d = this["@@data"];
      if (!d) {
        var parts = this._s.split("@", 2);
        var receiver = __global;
        var fun = null;
        var functionName = parts[0] || "";
        var fileName = "";
        var typeName = "";
        var methodName = "";
        var lineNumber = NaN;
        var columnNumber = NaN;
        var location = parts[1] || "";
        var isAnonymous = location.indexOf("{anonymous}") !== -1;
        var isNative = false; //location.indexOf("native") !== -1;
        if (location.indexOf(':') !== -1) {
          var locationParts = /(.*):(\d+):(\d+)/.exec(location);
          fileName = locationParts[1];
          lineNumber = parseInt(locationParts[2]);
          columnNumber = parseInt(locationParts[3]);
        } else {
          fileName = location;
        }

        if (!isAnonymous) {
          var functionParts = functionName.split('.');
          typeName = functionParts[0];
          methodName = functionParts[functionParts.length - 1];
        }
        
        //isEval
        var isEval = false;
        
        //isNative
        var isNative = false;
        
        //isConstructor
        var ctor = __isObject(receiver) ? receiver.constructor : null;
        var isConstructor = !ctor ? false : fun === ctor;
        
        //isTopLevel
        var isTopLevel = (receiver == null) || __isGlobal(receiver);
        
        d = this["@@data"] = {
          _this: receiver,
          _typeName: typeName,
          _function: fun,
          _functionName: functionName,
          _methodName: methodName,
          _fileName: fileName,
          _lineNumber: lineNumber,
          _columnNumber: columnNumber,
          _isTopLevel: isTopLevel,
          _isEval: isEval,
          _isNative: isNative,
          _isConstructor: isConstructor
        };
      }
      return d;
    }
  }
  
  export function prepare(errorString: string, frames: ICallSite[]): string {
    return __prepareStackTrace(errorString, frames);
  }
  
  export function capture(e: { stack: any }, stripPoint?: Function): void {
    __captureStackTrace(e, stripPoint);
  }
  
  export function create(): ICallSite[] {
    return __errorFrames(1);
  }
  
  enum Browser { IE, Chrome, Safari, Firefox, Opera, Other }
  
  var browser: Browser = (function (e: any) {

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
  }(__errorCreate()));

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
  var __global = window;
  function __isGlobal(o: any) { return o === __global; }
  function __isUndefined(o: any) { return typeof o === "undefined"; }
  function __isFunction(o: any) { return typeof o === "function"; }
  function __isObject(o: any) { return o !== null && (typeof o === "object" || __isFunction(o)); }
  function __str(o: any) { return String(o); }
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
        default: /*object*/ s = o.constructor.name || __ostring.call(o).slice(8, -1);
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
  
  function __errorCreate() {
    try {
      stacktrace['$$undef$$']();
    } catch (e) {
      return e;
    }
  }
  
  function __errorString(returnValue: string, message: string) {
    var returnValue = '';
    if (!__isUndefined(name)) {
      returnValue += name;
    }
    if (!__isUndefined(message)) {
      returnValue += ': ' + message;
    }
    return returnValue;
  }
  
  var __errorFrames = (function () {
    var _Error = (<any>Error);
    var __errorFrames: (offset: number) => ICallSite[];
    if (_Error.captureStackTrace) {
      //v8
      var prepareStackTrace = _Error.prepareStackTrace;
      var stackSink = function (_, stack) { return stack; };
      __errorFrames = function (offset) {
        _Error.prepareStackTrace = stackSink;
        var stack = (<any>new Error()).stack.slice(1 + offset);
        _Error.prepareStackTrace = prepareStackTrace;
        return stack;
      };
    } else {
      var __errorParse: (error: Error) => string[] = _parseError_Other;
      switch (browser) {
        case Browser.IE: __errorParse = _parseError_IE; break;
        case Browser.Chrome: __errorParse = _parseError_Chrome; break;
        case Browser.Firefox: __errorParse = _parseError_Firefox; break;
        case Browser.Opera: __errorParse = _parseError_Opera; break;
        case Browser.Safari: __errorParse = _parseError_Safari; break;
        default: __errorParse = _parseError_Other; break;
      }
      __errorFrames = function (offset) {
        var items = __errorParse(__errorCreate());
        if (offset > 0) {
          items = items.slice(offset);
        }
        var itemc = items.length;
        var parsed = new Array(itemc);
        var parseCallSite = CallSite.parse;
        for (var i = 0; i < itemc; ++i) {
          parsed[i] = parseCallSite(items[i]);
        }
        return parsed;
      };
    }
    
    return __errorFrames;
  }());
  
  var __prepareStackTrace = (<any>Error).prepareStackTrace || function (errorString: string, frames: ICallSite[]): string {
    var returnValue;

    // Adapted from V8 source:
    // https://github.com/v8/v8/blob/1613b7/src/messages.js#L1051-L1070
    var lines = [];
    lines.push(errorString);
    for (var i = 0; i < frames.length; i++) {
      var frame = frames[i];
      var line;
      try {
        line = __str(frame);
      } catch (e) {
        try {
          line = "<error: " + e + ">";
        } catch (ee) {
          // Any code that reaches this point is seriously nasty!
          line = "<error>";
        }
      }
      lines.push("    at " + line);
    }
    returnValue = lines.join('\n');
    
    return returnValue;
  }
  
  var __captureStackTrace = (<any>Error).captureStackTrace || function (e: any, topLevel?: Function): void {
    /*
    // Simultaneously traverse the frames in error.stack and the arguments.caller
    // to build a list of CallSite objects
    var factory = makeCallSiteFactory(e);
    var frames = factory(e, arguments.callee);
    var errorString = __errorString(frames.name, frames.message);
  
    // Explicitly set back the error.name and error.message
    //e.name = frames.name;
    //e.message = frames.message;
  
    // Pass the raw callsite objects through and get back a formatted stack trace
    e.stack = __prepareStackTrace(errorString, frames.frames);
    
    */
  }
  
}
export = stacktrace