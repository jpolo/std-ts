// Util
const Global: Window = typeof window !== "undefined" ? window : (function() { return this; }());

type Locals = { [key: string]: any }

type Option = {
  sourceURL?: string
  sourceMappingURL?: string
}

const OptionEmpty = {
  sourceURL: null,
  sourceMappingURL: null
};

/**
 * The global object (either ```window``` or ```global```)
 */
export const global = Global;

/**
 * Parse ```jscode``` and return a function
 *
 * @param jscode The script code that will be evaluated
 * @param options The options of evaluation
 * @returns The evaluable function
 */
export function compile(jscode: string, options: Option = OptionEmpty): (local?: Locals) => any {
  let fnWithContext: Function;
  let fnNoContext: Function;
  let evalCode = jscode;
  const { sourceURL, sourceMappingURL } = options;

  if (sourceURL) {
    // Firebug and Webkit annotation
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
  };
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
