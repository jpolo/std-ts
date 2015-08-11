//Util
const __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const __empty = {};

type Locals = { [key: string]: any }

type Option = {
  sourceURL?: string
  sourceMappingURL?: string
}

/**
 * The global object (either ```window``` or ```global```)
 */
export const global = __global;

/**
 * Parse ```jscode``` and return a function

 * @param jscode The script code that will be evaluated
 * @param options The options of evaluation
 * @returns The evaluable function
 */
export function compile(jscode: string, options?: Option): (locals?: Locals) => any {
  options = options || __empty;
  let fnWithContext: Function;
  let fnNoContext: Function;
  let evalCode = jscode;
  const sourceURL = options.sourceURL;
  const sourceMappingURL = options.sourceMappingURL;

  if (sourceURL) {
    //Firebug and Webkit annotation
    evalCode += "\n//# sourceURL=" + sourceURL;
  }

  if (sourceURL) {
    evalCode += "\n//# sourceMappingURL=" + sourceMappingURL;
  }

  return function (locals) {
    let returnValue;
    if (locals) {
      fnWithContext = fnWithContext || new Function("__locals__", "with(__locals__) {" + evalCode + "}");
      returnValue = fnWithContext.call(locals, locals);
    } else {
      fnNoContext = fnNoContext || new Function(evalCode);
      returnValue = fnNoContext();
    }
    return returnValue;
  }
}

/**
 * Evaluate ```jscode``` and return its result
 *
 * @param jscode The script code that will be evaluated
 * @param locals The local scope that will be used
 * @param options The options of evaluation
 * @returns The evaluation result
 */
export function run(jscode: string, locals?: Locals, options?: Option): any {
  return compile(jscode, options)(locals);
}
