import stacktrace = require("ts/stacktrace")

module error {

  //util
  var __global: any = (new Function("return this;")).call(null);
  var __str = function (o) { return "" + o; };
  var __inspect = __str;
  var __console: Console = typeof console !== "undefined" ? __global.console : null;
  var __name = function (f: Function) {
    return ((<any>f).displayName || (<any>f).name || ((<any>f).name = /\W*function\s+([\w\$]+)\(/.exec(__str(f))[1]))
  };
  var __captureStackTrace = stacktrace.capture;
  var __handleUncaughtError = function (error, prefix) {
    if (__console) {      
      var str = error && (error instanceof Error) ? __str(error.stack || error) : __inspect(error);
      __console.error(prefix + str);
    } else {//rethrow so it is catched by global.onerror
      throw error;
    }
  };
  
  //private
  var _isHandling = false;
  
  /*
  export function apply(fn: Function, thisArg?, argArray?: any) {
    var result;
    try {
      if (argArray) {
        result = fn.apply(thisArg, argArray);
      } else if (thisArg) {
        result = fn.call(thisArg);
      } else {
        result = fn();
      }
    } catch (error) {
      handleError(error);
    }
    return result;
  }
  */
  
  export interface IErrorHandler {
    (e: any): boolean  
  }
  
  export var onerror: IErrorHandler = null;

  export function handleError(e): boolean {
    var handler: IErrorHandler = error.onerror;
    var uncaught = !handler; 
    var fatalError;
    if (!_isHandling) {
      _isHandling = true;
      if (!uncaught) {
        try {
          uncaught = !handler(error);
        } catch (e) {
          uncaught = true;
          fatalError = e;
        }
      }
      if (uncaught) {
        __handleUncaughtError(error, 'Uncaught ');
      }
      _isHandling = false;
    } else {
      fatalError = error;
    }
    if (fatalError) {
      __handleUncaughtError(fatalError, 'Fatal ');
    }
    return uncaught;
  }
  
  //HACK: augment __extends
  declare var __extends: any;
  __extends = (function (__extendsOld) {
    return function __extends(d, b) {
      __extendsOld(d, b);
      
      if (d.prototype instanceof __global.Error) {
        //class is subclass native Error
        d.prototype.name = __name(d);
      }
    };
  }(__extends));
  
  export declare class Error {
    name: string;
    message: string;
    
    constructor(message?: string);
  }
  error['Error'] = __global.Error;
  
  export declare class EvalError extends Error {}
  error['EvalError'] = __global.EvalError;
  
  export declare class RangeError extends Error {}
  error['RangeError'] = __global.RangeError;
  
  export declare class ReferenceError extends Error {}
  error['ReferenceError'] = __global.ReferenceError;
  
  export declare class SyntaxError extends Error {}
  error['SyntaxError'] = __global.SyntaxError;
  
  export declare class TypeError extends Error {}
  error['TypeError'] = __global.TypeError;
  
  export declare class URIError extends Error {}
  error['URIError'] = __global.URIError;

  
  export class BaseError extends Error /*HACK: global reference*/ {
    stack: string;
    
    constructor(message?: string) {
      super(message);
      this.message = message;
      __captureStackTrace(this, this.constructor);
    }
  }

  
}
export = error;