import * as iterator from "./iterator";

// Interfaces
export interface IErrorHandlerResult extends iterator.IIteratorResult<any> {}

export interface IErrorHandler {
  handleError(e: any): IErrorHandlerResult;
}

export interface IThrowable extends Error {}

// Util
declare var __extends: any; // Typescript __extends
const Global: any = typeof window !== "undefined" ? window : (function() { return this; }());
const GlobalConsole: Console = typeof console !== "undefined" ? Global.console : null;
const GlobalError = Global.Error;
const GlobalTypeError: any = Global.TypeError;
function Has(o: any, name: string) { return o && (name in o); }
function IsError(o: any): boolean { return o instanceof GlobalError; }
function ToString(o: any) { return "" + o; }
function Dump(o: any) {
  return IsError(o) && Has(o, "stack") ? ToString(o.stack) : ToString(o);
}
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

function HandleUncaughtError(error, prefix) {
  if (GlobalConsole) {
    GlobalConsole.error(prefix + Dump(error));
  } else { // rethrow so it is catched by global.onerror
    throw error;
  }
}

function PatchExtends() {
  // HACK: augment __extends
  __extends = (function (__extendsOld) {
    return function __extends(d, b) {
      __extendsOld(d, b);

      if (d.prototype instanceof Global.Error) {
        // class is subclass native Error
        d.prototype.name = FunctionName(d);
      }
    };
  }(__extends));
}

class ErrorHandler implements IErrorHandler {

  static compose(handlers: IErrorHandler[]) {
    return new ErrorHandler(function (e: any) {
      let returnValue: IErrorHandlerResult;
      for (let handler of handlers) {
        returnValue = handler.handleError(e);
        if (returnValue.done) {
          break;
        }
      }
      return returnValue || { done: false, value: e };
    });
  }

  static uncaught = new ErrorHandler(function (e: any) {
    if (e && e.name === FatalError.prototype.name) {
      let fatalError = <FatalError> e;
      HandleUncaughtError(fatalError.error, "Fatal ");
    } else {
      HandleUncaughtError(e, "Uncaught ");
    }
    return { done: true, value: undefined };
  });

  protected _isHandling = false;
  protected _handler: (e: any) => IErrorHandlerResult;

  constructor(h: (e: any) => IErrorHandlerResult) {
    this._handler = h;
  }

  handleError(e: any): IErrorHandlerResult {
    let returnValue = { done: false, value: e };
    if (this._handler) {
      if (!this._isHandling) {
        this._isHandling = true;
        try {
          returnValue = this._handler(e);
        } catch (e) {
          returnValue = { done: false, value: new FatalError(e) };
        }
        this._isHandling = false;
      } else {
        returnValue = { done: false, value: new FatalError(e) };
      }
    }
    return returnValue;
  }
}


// isHandling marker to avoid infinite recursion
let _isHandling = false;

export let onerror: (e: any) => boolean = null;

export function handleError(e): boolean {
  let handler = onerror;
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

namespace error {

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

}

// Apply path
PatchExtends();
const {
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
} = error;

export class BaseError extends Error /*HACK: global reference*/ {
  stack: string;

  constructor(message?: string) {
    super(message);
    this.message = message;
    CaptureStackTrace(this, this.constructor);
  }
}

class FatalError extends BaseError {
  error: any = null;

  constructor(e: any) {
    super(e != undefined ? ToString(e) : "");
    this.error = e;
  }
}

export { Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError, FatalError };
