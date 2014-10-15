module inspect {

  export class Inspect {
    public maxDepth = 6
    public maxElements = 7
    public maxString = 15
    
    PREFIX = 'stringify_'
    
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
      var depth = maxDepth == null ? this.maxDepth : maxDepth
      var typeName = this._type(o)
      var methodName = this.PREFIX + typeName
      var s = ''
      if (typeof this[methodName] === 'function') {
        s = this[methodName](o, maxDepth)
      } else {
        if (o != null) {
          if (o && o.inspect) {
            s = o.inspect()//TODO inject this or depth
          } else {
            s = String(o)
          }
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
      return String(o)
    }
    
    stringify_Date(o: Date, maxDepth: number) {
      return 'Date(' + o.toISOString() + ')'
    }
    
    stringify_Number(o: number, maxDepth: number) {
      return String(o)
    }
    
    stringify_RegExp(o: RegExp, maxDepth: number) {
      return String(o)
    }
    
    stringify_String(o: string, maxDepth: number) {
      var maxString = this.maxString
      return '"' + 
        (o.length > maxString ? o.slice(0, maxString) + '...' : o).replace(/"/g, '\\"' ) + 
      '"'
    }
    
    stringify_Function(o: Function, maxDepth: number) {
      var s = String(o)
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
      var s = '{'
      var keys = Object.keys(o)
      var keyc = keys.length
      var truncate = false
      if (keyc > this.maxElements) {
        keyc = this.maxElements
        truncate = true
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
      s += '}'
      return s
    }

    _type(o: any): string {
      var s = ''
      if (o === null) {
        s = 'Null'
      } else {
        switch(typeof o) {
          case 'undefined': s = 'Undefined'; break
          case 'boolean': s = 'Boolean'; break
          case 'number': s = 'Number'; break
          case 'string': s = 'String'; break
          default: s = Object.prototype.toString.call(o).slice(8, -1)
        }
      }
      return s
    }
    
  }
  
}
export = inspect