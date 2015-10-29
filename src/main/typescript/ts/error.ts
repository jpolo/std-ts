// Util
const Global: any = typeof window !== "undefined" ? window : (function() { return this; }());
const GlobalConsole: Console = typeof console !== "undefined" ? Global.console : null;
const GlobalError = Global.Error;
function ToString(o) { return "" + o; }
function Dump(o) { return ToString(o); }
function FunctionName(f: Function) {
  return ((<any>f).displayName || (<any>f).name || ((<any>f).name = /\W*function\s+([\w\$]+)\(/.exec(ToString(f))[1]));
}

function CaptureStackTrace(error, stripPoint) {
  if (GlobalError.captureStackTrace) {
    GlobalError.captureStackTrace(error, stripPoint);
  } else {
    let stackString = (<any>new GlobalError()).stack;
    // Remove first calls
    let stack = stackString.split("\n").slice(1); // first is Error string, second is __captureStackTrace
    error.stack = ToString(error) + "\n" + stack.join("\n");
  }
}

module error {



  function HandleUncaughtError(error, prefix) {
    if (GlobalConsole) {
      let str = error && (error instanceof Error) ? ToString(error.stack || error) : Dump(error);
      GlobalConsole.error(prefix + str);
    } else { // rethrow so it is catched by global.onerror
      throw error;
    }
  }

  // isHandling marker to avoid infinite recursion
  let _isHandling = false;


  export interface IErrorHandler {
    (e: any): boolean;
  }

  export let onerror: IErrorHandler = null;

  export function handleError(e): boolean {
    let handler: IErrorHandler = onerror;
    let uncaught = !handler;
    let fatalError;
    if (!_isHandling) {
      _isHandling = true;
      if (!uncaught) {
        try {
          uncaught = !handler(e);
        } catch (e) {
          uncaught = true;
          fatalError = e;
        }
      }
      if (uncaught) {
        HandleUncaughtError(e, "Uncaught ");
      }
      _isHandling = false;
    } else {
      fatalError = e;
    }
    if (fatalError) {
      HandleUncaughtError(fatalError, "Fatal ");
    }
    return uncaught;
  }

  // HACK: augment __extends
  declare var __extends: any;
  __extends = (function (__extendsOld) {
    return function __extends(d, b) {
      __extendsOld(d, b);

      if (d.prototype instanceof Global.Error) {
        // class is subclass native Error
        d.prototype.name = FunctionName(d);
      }
    };
  }(__extends));

  export interface IThrowable extends Error {}

  export declare class Error {
    name: string;
    message: string;

    constructor(message?: string);
  }
  error["Error"] = Global.Error;

  export declare class EvalError extends Error {}
  error["EvalError"] = Global.EvalError;

  export declare class RangeError extends Error {}
  error["RangeError"] = Global.RangeError;

  export declare class ReferenceError extends Error {}
  error["ReferenceError"] = Global.ReferenceError;

  export declare class SyntaxError extends Error {}
  error["SyntaxError"] = Global.SyntaxError;

  export declare class TypeError extends Error {}
  error["TypeError"] = Global.TypeError;

  export declare class URIError extends Error {}
  error["URIError"] = Global.URIError;

  export class BaseError extends Error /*HACK: global reference*/ {
    stack: string;

    constructor(message?: string) {
      super(message);
      this.message = message;
      CaptureStackTrace(this, this.constructor);
    }
  }

}
export = error
