module vm {
  var __global: Window = (new Function("return this;")).call(null)

  export interface IContext { [key: string]: any }

  export var global = __global

  export function compile(jscode: string, fileName?: string): (context?: IContext) => any {
    var fnWithContext: Function
    var fnNoContext: Function
        
    if (fileName) {
      //Firebug and Webkit annotation
      jscode += "\n//@ sourceURL=" + fileName
    }
    
    return function (context) {
      var returnValue
      if (context) {
        fnWithContext = fnWithContext || new Function("__context__", "with(__context__) {" + jscode + "}")
        returnValue = fnWithContext.call(context, context)
      } else {
        fnNoContext = fnNoContext || new Function(jscode)
        returnValue = fnNoContext()
      }
      return returnValue
    }
  }

  export function eval(jscode: string, context?: IContext, fileName?: string): any {
    return compile(jscode, fileName)(context)
  }


}

export = vm
