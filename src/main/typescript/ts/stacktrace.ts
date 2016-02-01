const Global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
function IsGlobal(o: any) { return o === Global; }
function IsObject(o: any) { return o !== null && (typeof o === "object" || typeof o === "function"); }
function ToStringTag(o: any): string {
  let s = "";
  if (o === null) {
    s = "Null";
  } else {
    switch (typeof o) {
      case "boolean": s = "Boolean"; break;
      case "function": s = "Function"; break;
      case "number": s = "Number"; break;
      case "string": s = "String"; break;
      case "undefined": s = "Undefined"; break;
      default: /*object*/ s = o.constructor.name || Object.prototype.toString.call(o).slice(8, -1);
    }
  }
  return s;
}
function ArraySlice<T>(a: { [k: number]: T; length: number }, start?: number, end?: number): T[] {
  let returnValue = [];
  let l = returnValue.length;
  start = start || 0;
  end = end == null || l < end ? l : end;
  for (let i = start; i < end; ++i) {
    returnValue.push(a[i]);
  }
  return returnValue;
}

enum Browser { IE, Chrome, Safari, Firefox, Opera, Other }

function ErrorCreate() {
  try {
    window["$$undef$$"]();
  } catch (e) {
    return e;
  }
}
function ErrorToString(name: string, message: string) {
  let returnValue = "";
  if (name !== undefined) {
    returnValue += name;
  }
  if (message !== undefined) {
    returnValue += ": " + message;
  }
  return returnValue;
}
const ErrorParse = (function () {

  // Sniff browser
  let browser: Browser = (function (e: any) {
    let returnValue = Browser.Other;
    if (e["arguments"] && e.stack) {
      returnValue = Browser.Chrome;
    } else if (e.stack && e.sourceURL) {
      returnValue = Browser.Safari;
    } else if (e.stack && e["number"]) {
      returnValue = Browser.IE;
    } else if (e.stack && e.fileName) {
      returnValue = Browser.Firefox;
    } else if (e.message && e.stack && e.stacktrace) {
      returnValue = Browser.Opera; // use e.stacktrace, format differs from "opera10a", "opera10b"
    } else if (e.stack && !e.fileName) {
      // Chrome 27 does not have e.arguments as earlier versions,
      // but still does not have e.fileName as Firefox
      returnValue = Browser.Chrome;
    }
    return returnValue;
  }(ErrorCreate()));

  // Parse error line
  let __errorParseLines: (error: Error) => string[] = __errorParseLines_Other;
  switch (browser) {
    case Browser.IE: __errorParseLines = __errorParseLines_IE; break;
    case Browser.Chrome: __errorParseLines = __errorParseLines_Chrome; break;
    case Browser.Firefox: __errorParseLines = __errorParseLines_Firefox; break;
    case Browser.Opera: __errorParseLines = __errorParseLines_Opera; break;
    case Browser.Safari: __errorParseLines = __errorParseLines_Safari; break;
    default: __errorParseLines = __errorParseLines_Other; break;
  }

  function __errorParseLines_Chrome(error: any): string[] {
    return (error.stack + "\n")
        .replace(/^[\s\S]+?\s+at\s+/, " at ") // remove message
        .replace(/^\s+(at eval )?at\s+/gm, "") // remove "at" and indentation
        .replace(/^([^\(]+?)([\n$])/gm, "{anonymous}() ($1)$2")
        .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}() ($1)")
        .replace(/^(.+) \((.+)\)$/gm, "$1@$2")
        .split("\n")
        .slice(0, -1);
  }

  function __errorParseLines_Firefox(error: any): string[] {
    return (error.stack)
      .replace(/(?:\n@:0)?\s+$/m, "")
      .replace(/^(?:\((\S*)\))?@/gm, "{anonymous}($1)@")
      .split("\n");
  }

  function __errorParseLines_IE(error: any): string[] {
    return (error.stack)
      .replace(/^\s*at\s+(.*)$/gm, "$1")
      .replace(/^Anonymous function\s+/gm, "{anonymous}() ")
      .replace(/^(.+)\s+\((.+)\)$/gm, "$1@$2")
      .split("\n")
      .slice(1);
  }

  function __errorParseLines_Opera(error: any): string[] {
    let ANON = "{anonymous}";
    let lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
    let lines = error.stacktrace.split("\n");
    let result = [];

    for (let i = 0, len = lines.length; i < len; i += 2) {
      let match = lineRE.exec(lines[i]);
      if (match) {
        let location = match[4] + ":" + match[1] + ":" + match[2];
        let fnName = match[3] || "global code";
        fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
        result.push(fnName + "@" + location + " -- " + lines[i + 1].replace(/^\s+/, ""));
      }
    }
    return result;
  }

  function __errorParseLines_Safari(error: any): string[] {
    return (error.stack)
      .replace(/\[native code\]\n/m, "")
      .replace(/^(?=\w+Error\:).*$\n/m, "")
      .replace(/^@/gm, "{anonymous}()@")
      .split("\n");
  }

  function __errorParseLines_Other(curr): string[] {
    let ANON = "{anonymous}";
    let fnRE = /function(?:\s+([\w$]+))?\s*\(/;
    let stack = [];
    let fn, args;
    let maxStackSize = 10;
    while (curr && stack.length < maxStackSize) {
      fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
      try {
        args = ArraySlice(curr["arguments"] || []);
      } catch (e) {
        args = ["Cannot access arguments: " + e];
      }
      stack[stack.length] = fn + "(" + _stringifyArguments(args) + ")";
      try {
        curr = curr.caller;
      } catch (e) {
        stack[stack.length] = "Cannot access caller: " + e;
        break;
      }
    }
    return stack;
  }

  function _stringifyArguments(args: any[]) {
    let argc = args.length;
    let result = new Array(argc);
    for (let i = 0; i < argc; ++i) {
      let arg = args[i];
      switch (ToStringTag(arg)) {
        case "Undefined":
          result[i] = "undefined";
          break;
        case "Null":
          result[i] = "null";
          break;
        case "Array":
          if (arg.length < 3) {
            result[i] = "[" + _stringifyArguments(arg) + "]";
          } else {
            result[i] = "[" +
              _stringifyArguments(ArraySlice(arg, 0, 1)) +
              "..." +
              _stringifyArguments(ArraySlice(arg, -1)) +
              "]";
          }
          break;
        case "Object":
          result[i] = "#object";
          break;
        case "Function":
          result[i] = "#function";
          break;
        case "String":
          result[i] = `"${args}"`;
          break;
        case "Number":
          result[i] = arg;
          break;
        default:
          result[i] = "?";
      }
    }
    return result.join(",");
  }

  return function ErrorParse(error: any, offset = 0): CallSite[] {
    let items = __errorParseLines(error);
    if (offset > 0) {
      // shift from offset
      items = items.slice(offset);
    }

    let itemc = items.length;
    let parsed = new Array(itemc);
    let parseCallSite = CallSite.parse;
    for (let i = 0; i < itemc; ++i) {
      parsed[i] = parseCallSite(items[i]);
    }
    return parsed;
  };
}());
const __prepareStackTrace = (<any>Error).prepareStackTrace || function (errorString: string, frames: ICallSite[]): string {

  // Adapted from V8 source:
  // https://github.com/v8/v8/blob/1613b7/src/messages.js#L1051-L1070
  let lines = [];
  let frame: ICallSite;
  let line;
  lines.push(errorString);
  for (let i = 0, l = frames.length; i < l; i++) {
    frame = frames[i];
    try {
      line = CallSite.stringify(frame); // __str(frame);
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
  return lines.join("\n");
};
const ErrorFrames = (function () {
  let GlobalError = (<any>Error);
  let __errorFrames: (offset: number) => ICallSite[];
  if (GlobalError.captureStackTrace) {
    // v8
    let prepareStackTrace = GlobalError.prepareStackTrace;
    let stackSink = function (_, stack) { return stack; };
    __errorFrames = function (offset) {
      GlobalError.prepareStackTrace = stackSink;
      let stack = (<any>new GlobalError()).stack.slice(1 + offset);
      if (prepareStackTrace === undefined) {
        delete GlobalError.prepareStackTrace;
      } else {
        GlobalError.prepareStackTrace = prepareStackTrace;
      }
      return stack;
    };
  } else {
    __errorFrames = function (offset) {
      return ErrorParse(ErrorCreate(), offset + 2);
    };
  }

  return __errorFrames;
}());
const __captureStackTrace = (<any>Error).captureStackTrace || function (e: any, topLevel?: Function): void {

  // Simultaneously traverse the frames in error.stack and the arguments.caller
  // to build a list of CallSite objects
  // let factory = makeCallSiteFactory(e);
  let frames = ErrorParse(e);
  let errorString = ErrorToString(e.name, e.message);

  // Explicitly set back the error.name and error.message
  // e.name = frames.name;
  // e.message = frames.message;

  // Pass the raw callsite objects through and get back a formatted stack trace
  e.stack = __prepareStackTrace(errorString, frames);
};
const $$data = "@@data";

// https://github.com/mattrobenolt/callsite-shim/blob/master/src/callsite.js
// https://github.com/stacktracejs/stacktrace.js/
// https://github.com/tj/callsite

// export interface ICallStack extends Array<ICallSite> {}

export interface ICallSite {
  getThis(): any;
  getTypeName(): string;
  getFunction(): Function;
  getFunctionName(): string;
  getMethodName(): string;
  getFileName(): string;
  getLineNumber(): number;
  getColumnNumber(): number;
  getEvalOrigin(): any;
  isTopLevel(): boolean;
  isEval(): boolean;
  isNative(): boolean;
  isConstructor(): boolean;
  getArguments(): any; // {[key: number]: any; length: number}
  toString(): string;
}

class CallSite implements ICallSite {

  static parse(s: string): CallSite {
    return new CallSite(s);
  }

  static stringify(o: ICallSite): string {
    let s = "";
    if (s === undefined) {
      s = "undefined";
    } else if (s === null) {
      s = "null";
    } else {
      let functionName = o.getFunctionName();
      let lineNumber = o.getLineNumber();
      let columnNumber = o.getColumnNumber();

      s += o.getFileName();
      if (lineNumber) {
        s += ":" + lineNumber;
        if (columnNumber) {
          s += ":" + columnNumber;
        }
      }

      s = functionName ? functionName + " (" + s +  ")" : s;
    }
    return s;
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
    let d = this._parse();
    return d._lineNumber > 0 ? d._lineNumber : null;
  }

  getColumnNumber(): number {
    let d = this._parse();
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
    let d= this._parse();
    return d._function && d._function["arguments"] || null;
  }

  toString(): string {
    return CallSite.stringify(this);
  }

  private _parse() {
    let d = this[$$data];
    if (!d) {
      let parts = this._s.split("@", 2);
      let receiver = Global;
      let fun = null;
      let functionName = parts[0] || "";
      let fileName = "";
      let typeName = "";
      let methodName = "";
      let lineNumber = NaN;
      let columnNumber = NaN;
      let location = parts[1] || "";
      let isAnonymous = location.indexOf("{anonymous}") !== -1;
      let isEval = false;
      let isNative = false; // location.indexOf("native") !== -1;
      if (location.indexOf(":") !== -1) {
        let locationParts = /(.*):(\d+):(\d+)/.exec(location);
        fileName = locationParts[1];
        lineNumber = parseInt(locationParts[2]);
        columnNumber = parseInt(locationParts[3]);
      } else {
        fileName = location;
      }

      if (!isAnonymous) {
        let functionParts = functionName.split(".");
        typeName = functionParts[0];
        methodName = functionParts[functionParts.length - 1];
      }

      // isEval
      // isEval = false;

      // isNative
      // isNative = false;

      // isConstructor
      let ctor = IsObject(receiver) ? receiver.constructor : null;
      let isConstructor = !ctor ? false : fun === ctor;

      // isTopLevel
      let isTopLevel = (receiver == null) || IsGlobal(receiver);

      d = this[$$data] = {
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

export function get(error: any): ICallSite[] {
  return ErrorParse(error);
}

export function create(): ICallSite[] {
  return ErrorFrames(1);
}
