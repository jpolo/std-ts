module inspect {

  export class Inspect {
    public maxDepth = 6
    public maxElements = 7
    public maxString = 15
    
    constructor(
      conf?: {
        maxDepth?: number;
        maxElements?: number;
        maxString?: number
      }
    ) {
      if (conf) {
        this.maxDepth = conf.maxDepth
        this.maxElements = conf.maxElements
        this.maxString = conf.maxString
      }
    }
    
    inspect(o: any): string {
      return this.inspect1(o, this.maxDepth)
    }
    
    inspect1(o: any, maxDepth: number): string {
      var typeName = this._type(o)
      var methodName = 'inspect_' + typeName
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
    
    inspect_Undefined(o: any, maxDepth: number) {
      return 'undefined'
    }
    
    inspect_Null(o: any, maxDepth: number) {
      return 'null'
    }
    
    inspect_Boolean(o: boolean, maxDepth: number) {
      return String(o)
    }
    
    inspect_Date(o: Date, maxDepth: number) {
      return 'Date(' + o.toISOString() + ')'
    }
    
    inspect_Number(o: number, maxDepth: number) {
      return String(o)
    }
    
    inspect_RegExp(o: RegExp, maxDepth: number) {
      return String(o)
    }
    
    inspect_String(o: string, maxDepth: number) {
      var maxString = this.maxString
      return '"' + 
        (o.length > maxString ? o.slice(0, maxString) + '...' : o).replace(/"/g, '\\"' ) + 
      '"'
    }
    
    inspect_Function(o: Function, maxDepth: number) {
      var s = String(o)
      s = s.slice(0, s.indexOf('{') + 1) + '...}'
      return s
    }
    
    inspect_Array(o: any[], maxDepth: number) {
      var maxElements = this.maxElements
      var length = o.length
      var truncate = length > maxElements

      return (
        maxDepth <= 0 && length ? '...' :
        '[' + 
          (truncate ? o.slice(0, maxElements) : o).map((v) => this.inspect1(v, maxDepth - 1)).join(', ') + 
          (truncate ? ', ...' : '') + 
        ']'
      )
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