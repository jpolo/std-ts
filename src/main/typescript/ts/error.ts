module error {

  var __global: any = (new Function("return this;")).call(null);
  var __captureStackTrace = __global.Error.captureStackTrace || function (o, constructor) {
    if (!('stack' in o)) {
      o.stack = (new __global.Error()).stack;
    }
  };
  
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
  function __name(f: any) { 
    return (f.displayName || f.name || (f.name = /\W*function\s+([\w\$]+)\(/.exec(__str(f))[1]))
  }
  
}
export = error;

