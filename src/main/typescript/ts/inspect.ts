module inspect {

  export interface IInspect {
    
    inspect(): string;
    
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
      
      private _refs = __set()
      
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
        var refs = init ? (this._refs = __set()) : this._refs
        var depth = maxDepth == null ? this.maxDepth : maxDepth
        var s = '' 
            
        if (__isObject(o)) {
          if (refs.has(o)) {
            s = '<circular>'
          } else {
            refs.add(o)
          }
        }
        
        
        if (!s) {
          switch (__stringTag(o)) {
            case 'Undefined': s = this.stringifyUndefined(); break;
            case 'Null': s = this.stringifyNull(); break;
            case 'Boolean': s = this.stringifyBoolean(o); break;
            case 'Number': s = this.stringifyNumber(o); break;
            case 'String': s = this.stringifyString(o); break;
            case 'Function': s = this.stringifyFunction(o); break;
            default:
              try {
                var methodName = this.PREFIX + __stringTag(o)
                if (__isFunction(this[methodName])) {
                  s = this[methodName](o, maxDepth)
                } else {
                  if (o != null) {
                    if (o.inspect) {
                      s = this.stringify_IInspect(o, maxDepth);
                    } else {
                      s = this.stringify_Object(o, maxDepth);
                    }
                  }
                }
              } finally {
                if (init) {
                  //reinit
                  this._refs = null
                }
              }
          }
        }
        
        return s
      }
      
      stringifyUndefined() {
        return 'undefined';
      }
      
      stringifyNull() {
        return 'null';
      }
      
      stringifyBoolean(o: boolean) {
        var s = __strEmpty(o);
        return s === null ? __str(o) : s;
      }
      
      stringify_Date(o: Date, maxDepth: number) {
        return 'Date { ' + o.toISOString() + ' }'
      }
      
      stringifyNumber(o: number, maxDepth?: number) {
        var s = __strEmpty(o);
        return s === null ? __str(o) : s;
      }
      
      stringify_RegExp(o: RegExp, maxDepth: number) {
        var s = __strEmpty(o);
        return s === null ? __str(o) : s;
      }
      
      stringifyString(o: string) {
        var maxString = this.maxString;
        var s = __strEmpty(o);
        return (
          s === null ?
          '"' + 
            (o.length > maxString ? o.slice(0, maxString) + '...' : o)
            .replace(/"/g, '\\"' )
            .replace(/[\n\r]/g, "↵") + 
          '"':
          s
        );
      }
      
      stringifyFunction(o: Function) {
        var s = __strEmpty(o);
        if (s === null) {
          s = __str(o);
          s = s.slice(0, s.indexOf('{') + 1) + '...}';
        }
        return s;
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
      
      stringify_IInspect(o: IInspect, maxDepth: number) {
        return o.inspect();
      }
      
      stringify_Object(o: any, maxDepth: number) {
        var s = ''
        var ctor = o.constructor
        var displayName = ctor && __fnName(ctor)
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
          s += key + ': ' + this.stringify(val, maxDepth - 1)
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
  
  //util
  var __ostring = Object.prototype.toString
  function __fnName(f: any) { 
    return (f.displayName || f.name || (f.name = /\W*function\s+([\w\$]+)\(/.exec(__str(f))[1]));
  }
  function __isFunction(o: any) { return typeof o === 'function'; }
  function __isObject(o: any) { return o !== null && (typeof o === 'object' || __isFunction(o)); }
  function __keys(o: any) { return Object.keys(o); }
  function __set<T>(): { has: (o: T) => boolean; add: (o: T) => void } {
    if (typeof Set !== "undefined") {
      return new Set();
    } else {
      var d = [];
      return {
        has: function (o) { return d.indexOf(o) !== -1; },
        add: function (o) { if (d.indexOf(o) !== -1) { d.push(o); } }  
      };
    }
  }
  function __str(o: any) { return String(o); }
  function __strEmpty(o: any): string {
    return (
      o === null ? 'null' :
      o === undefined ? 'undefined' :
      null
    );
  }
  function __stringTag(o: any) {
    var s = '';
    if (o === null) {
      s = 'Null';
    } else {
      switch(typeof o) {
        case 'boolean': s = 'Boolean'; break;
        case 'function': s = 'Function'; break;
        case 'number': s = 'Number'; break;
        case 'string': s = 'String'; break;
        case 'undefined': s = 'Undefined'; break;
        default: /*object*/ s = o.constructor.name || __ostring.call(o).slice(8, -1);
      }
    }
    return s;
  }
  
  
}
export = inspect