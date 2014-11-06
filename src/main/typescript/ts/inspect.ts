module inspect {

  var __ostring = Object.prototype.toString
  var __isObject = function (o) { return (typeof o === 'object') && o !== null }
  var __isFunction = function (o) { return typeof o === 'function' }
  var __keys = Object.keys
  var __str = String
  var __stringTag = (o: any) => {
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
        default: /*object*/ s = __ostring.call(o).slice(8, -1)
      }
    }
    return s
  }
  
  export interface IEngine {
    stringify(o: any, maxDepth?: number): string 
  }

  export module engine {
  
    /**
     * Default engine 
     */
    var _instance: Engine
    export function get(): Engine {
      return (_instance || (_instance = new Engine()))
    }
    
    export class Engine implements IEngine {
      public maxDepth = 6
      public maxElements = 7
      public maxString = 30
      
      PREFIX = 'stringify_'
      
      private _refs: any[]
      
      constructor(
        conf?: {
          maxDepth?: number;
          maxElements?: number;
          maxString?: number
        }
      ) {
        if (conf) {
          this.maxDepth = conf.maxDepth || this.maxDepth
          this.maxElements = conf.maxElements || this.maxElements
          this.maxString = conf.maxString || this.maxString
        }
      }
      
      stringify(o: any, maxDepth?: number): string {
        var init = !this._refs
        var refs = init ? (this._refs = []) : this._refs
        var depth = maxDepth == null ? this.maxDepth : maxDepth
        var methodName = this.PREFIX + __stringTag(o)
        var s = '' 
            
        if (__isFunction(o) || __isObject(o)) {
          if (refs.indexOf(o) >= 0) {
            s = '<circular>'
          } else {
            refs.push(o)
          }
        }
        
        try {
          if (!s) {
            if (__isFunction(this[methodName])) {
              s = this[methodName](o, maxDepth)
            } else {
              if (o != null) {
                if (o && o.inspect) {
                  s = o.inspect()//TODO inject this or depth
                } else {
                  s = this.stringify_Object(o, maxDepth)
                }
              }
            }
          }
        } finally {
          if (init) {
            //reinit
            this._refs = null
          }
        }
        return s
      }
      
      stringify_Undefined(o: any, maxDepth: number) {
        return 'undefined'
      }
      
      stringify_Null(o: any, maxDepth: number) {
        return 'null'
      }
      
      stringify_Boolean(o: boolean, maxDepth: number) {
        return __str(o)
      }
      
      stringify_Date(o: Date, maxDepth: number) {
        return 'Date { ' + o.toISOString() + ' }'
      }
      
      stringify_Number(o: number, maxDepth: number) {
        return __str(o)
      }
      
      stringify_RegExp(o: RegExp, maxDepth: number) {
        return __str(o)
      }
      
      stringify_String(o: string, maxDepth: number) {
        var maxString = this.maxString
        return '"' + 
          (o.length > maxString ? o.slice(0, maxString) + '...' : o).replace(/"/g, '\\"' ) + 
        '"'
      }
      
      stringify_Function(o: Function, maxDepth: number) {
        var s = __str(o)
        s = s.slice(0, s.indexOf('{') + 1) + '...}'
        return s
      }
      
      stringify_Array(o: any[], maxDepth: number) {
        var maxElements = this.maxElements
        var length = o.length
        var truncate = length > maxElements
  
        return (
          maxDepth <= 0 && length ? '...' :
          '[' + 
            (truncate ? o.slice(0, maxElements) : o).map((v) => this.stringify(v, maxDepth - 1)).join(', ') + 
            (truncate ? ', ...' : '') + 
          ']'
        )
      }
      
      stringify_Object(o: any, maxDepth: number) {
        var s = ''
        var ctor = o.constructor
        var displayName = ctor && (ctor.displayName || ctor.name)
        var maxElements = this.maxElements
        var keys = __keys(o)
        var keyc = keys.length
        var truncate = false
        if (keyc > maxElements) {
          keyc = maxElements
          truncate = true
        }
        
        if (displayName && displayName != 'Object') {
          s += displayName + ' '
        }     
        s += '{'
        if (keyc > 0) {
          s += ' '
        }
        for (var i = 0; i < keyc; ++i) {
          var key = keys[i]
          var val = o[key]
          
          if (i !== 0) {
            s += ', '
          }
          s += key + ': ' + this.stringify(val, maxDepth -1)
        }
        if (truncate) {
          s += ', ...'
        }
        if (keyc > 0) {
          s += ' '
        }
        s += '}'
        return s
      }
    }
  }
  
  export function stringify(o: any): string {
    return engine.get().stringify(o)
  }
  
}
export = inspect