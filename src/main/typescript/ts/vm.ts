module vm {
  var _global: Window = (new Function("return this;")).call(null)
  var _objectToString = Object.prototype.toString
  var _Symbol = _global['Symbol']
  //var $$iterator = _Symbol && _Symbol.iterator
  var $$toStringTag = _Symbol && _Symbol.toStringTag

  export interface IContext { [key: string]: any }

  export var global = _global

  export function typeOf(o: any): string {
    return typeof o
  }

  export function isInstanceOf(o: any, Class: Function): boolean {
    return (o != null) && o instanceof Class
  }

  export function stringTag(o: any): string {
    var s = ''
    if (o === null) {
      s = 'Null'
    } else {
      switch(typeof o) {
        case 'boolean': s = 'Boolean'; break
        case 'function': s = 'Function'; break
        case 'number': s = 'Number'; break
        case 'string': s = 'String'; break
        case 'undefined': s = 'Undefined'; break
        default: /*object*/ s = _objectToString.call(o).slice(8, -1)
      }
    }
    return s
  }

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
