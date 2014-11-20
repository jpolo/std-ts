module vm {
  var __empty = {}
  var __global: Window = (new Function("return this;")).call(null)

  export interface IOption {
    fileName?: string
  }
  
  export interface IContext {
    [key: string]: any 
  }

  export var global = __global

  export function compile(jscode: string, options?: IOption): (context?: IContext) => any {
    options = options || __empty
    var fnWithContext: Function
    var fnNoContext: Function
    var fileName = options.fileName
    
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

  export function eval(jscode: string, context?: IContext, options?: IOption): any {
    return compile(jscode, options)(context)
  }


}

export = vm
