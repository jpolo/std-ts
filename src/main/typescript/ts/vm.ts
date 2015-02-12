module vm {
  var __empty = {};
  var __global: Window = (new Function("return this;")).call(null);

  export interface IOption {
    sourceURL?: string
    sourceMappingURL?: string
  }

  export var global = __global;

  export function compile(jscode: string, options?: IOption): (context?: { [key: string]: any }) => any {
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
    
    return function (context) {
      var returnValue;
      if (context) {
        fnWithContext = fnWithContext || new Function("__context__", "with(__context__) {" + jscode + "}");
        returnValue = fnWithContext.call(context, context);
      } else {
        fnNoContext = fnNoContext || new Function(jscode);
        returnValue = fnNoContext();
      }
      return returnValue;
    }
  }

  export function eval(jscode: string, context?: { [key: string]: any }, options?: IOption): any {
    return compile(jscode, options)(context);
  }
}

export = vm;
