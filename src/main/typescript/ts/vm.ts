//Util
const __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const __empty = {};

type Locals = { [key: string]: any }

type Option = {
  sourceURL?: string
  sourceMappingURL?: string
}

export const global = __global;

export function compile(jscode: string, options?: Option): (locals?: Locals) => any {
  options = options || __empty;
  let fnWithContext: Function;
  let fnNoContext: Function;
  let sourceURL = options.sourceURL;
  let sourceMappingURL = options.sourceMappingURL;
  
  if (sourceURL) {
    //Firebug and Webkit annotation
    jscode += "\n//# sourceURL=" + sourceURL;
  }
  
  if (sourceURL) {
    jscode += "\n//# sourceMappingURL=" + sourceMappingURL;
  }
  
  return function (locals) {
    let returnValue;
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

export function eval(jscode: string, locals?: Locals, options?: Option): any {
  return compile(jscode, options)(locals);
}

