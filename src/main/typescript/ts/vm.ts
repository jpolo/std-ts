module vm {

  //Util
  var __empty = {};
  var __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());

  export interface IOption {
    sourceURL?: string
    sourceMappingURL?: string
  }

  export var global = __global;

  export function compile(jscode: string, options?: IOption): (locals?: { [key: string]: any }) => any {
    options = options || __empty;
    var fnWithContext: Function;
    var fnNoContext: Function;
    var sourceURL = options.sourceURL;
    var sourceMappingURL = options.sourceMappingURL;
    
    if (sourceURL) {
      //Firebug and Webkit annotation
      jscode += "\n//# sourceURL=" + sourceURL;
    }
    
    if (sourceURL) {
      jscode += "\n//# sourceMappingURL=" + sourceMappingURL;
    }
    
    return function (locals) {
      var returnValue;
      if (locals) {
        fnWithContext = fnWithContext || new Function("__locals__", "with(__locals__) {" + jscode + "}");
        returnValue = fnWithContext.call(locals, locals);
      } else {
        fnNoContext = fnNoContext || new Function(jscode);
        returnValue = fnNoContext();
      }
      return returnValue;
    }
  }

  export function eval(jscode: string, locals?: { [key: string]: any }, options?: IOption): any {
    return compile(jscode, options)(locals);
  }
}

export = vm;
