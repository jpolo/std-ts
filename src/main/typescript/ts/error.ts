import stacktrace = require("ts/stacktrace")

module error {
  //capture stack trace shim
  // https://github.com/mattrobenolt/callsite-shim/blob/master/src/callsite.js
  
  
  var __global: any = (new Function("return this;")).call(null);
  var __isHandling = false;
  
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
  
  export interface IErrorHandler {
    (e: any): boolean  
  }
  
  export var onerror: IErrorHandler = null;

  export function handleError(e) {
    var handler: IErrorHandler = error.onerror;
    var uncaught = !handler; 
    var fatalError;
    if (!__isHandling) {
      __isHandling = true;
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
      __isHandling = false;
    } else {
      fatalError = error;
    }
    if (fatalError) {
      __handleUncaughtError(fatalError, 'Fatal ');
    }
    //return uncaught;
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
  
  export class BaseError extends Error /*HACK: global reference*/ {
    stack: string;
    
    constructor(message?: string) {
      super(message);
      this.message = message;
      __captureStackTrace(this, this.constructor);
    }
  }
  
  //util
  function __str(o: any) { return String(o); }
  function __inspect(o: any) { return __str(o); }
  function __name(f: any) { 
    return (f.displayName || f.name || (f.name = /\W*function\s+([\w\$]+)\(/.exec(__str(f))[1]))
  }
  function __handleUncaughtError(error, prefix) {
    if (console.error) {
      var str = error && (error instanceof Error) ? __str(error.stack || error) : __inspect(error);
      console.error(prefix + str);
    } else {//rethrow so it is catched by global.onerror
      throw error;
    }
  }
  function __captureStackTrace(o, stripPoint) {
    stacktrace.capture(o, stripPoint);
  }
  
}
export = error;

