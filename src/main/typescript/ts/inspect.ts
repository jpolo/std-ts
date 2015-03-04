module inspect {

  export interface IInspect {
    
    inspect(maxDepth?: number): string;
    
  }
  

  export interface IEngine {
    stringify(o: any, maxDepth?: number): string 
  }

  export module engine {
    var ignored = [];
    
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
      
      PREFIX = 'stringify'
      
      private _refs = __set()
      private _ignored = __set()
      
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
          
          switch (__typeOf(o)) {
            //Primitive
            case 'undefined': s = this.stringifyUndefined(); break;
            case 'null': s = this.stringifyNull(); break;
            case 'boolean': s = this.stringifyBoolean(o); break;
            case 'number': s = this.stringifyNumber(o); break;
            case 'string': s = this.stringifyString(o); break;
            case 'function': s = this.stringifyFunction(o); break;
            default:
              var strTag = __stringTag(o);
              switch (strTag) {
                //Special
                case 'Array': s = this.stringifyArray(o, maxDepth); break;
                case 'Map': s = this.stringifyMap(o, maxDepth); break;
                case 'Set': s = this.stringifySet(o, maxDepth); break;
                case 'Date': s = this.stringifyDate(o); break;
                case 'RegExp': s = this.stringifyRegExp(o); break;
                default:
                  try {
                    var methodName = this.PREFIX + strTag
                    if (__isFunction(this[methodName])) {
                      s = this[methodName](o, maxDepth);
                    } else {
                      var method = o.inspect;
                      if (
                        method &&
                        !this._ignored.has(method)
                      ) {
                        s = this.stringifyIInspect(o, maxDepth);
                      } else {
                        s = this.stringifyObject(o, maxDepth);
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
        }
        
        if (init) {
          //reinit
          this._refs = null
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
      
      stringifyDate(o: Date) {
        var s = __strEmpty(o);
        return s === null ? __strObject('Date', o.toISOString()) : s;
      }
      
      stringifyNumber(o: number) {
        var s = __strEmpty(o);
        return s === null ? __str(o) : s;
      }
      
      stringifyRegExp(o: RegExp) {
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
      
      stringifyArray(o: any[], maxDepth: number) {
        var s = __strEmpty(o);
        if (s === null) {
          var maxElements = this.maxElements;
          var length = o.length;
          var truncate = length > maxElements;
          
          s = (
            maxDepth <= 0 && length ? '...' :
            '[' + 
              (truncate ? o.slice(0, maxElements) : o).map((v) => this.stringify(v, maxDepth - 1)).join(', ') + 
              (truncate ? ', ...' : '') + 
            ']'
          );
        }
        return s;
      }
      
      stringifySet(o: Set<any>, maxDepth: number) {
        var s = __strEmpty(o);
        if (s === null) {
          var first = true;
          o.forEach((v) => {
            if (first) {
              first = false;
              s += ", ";
            }
            s += this.stringify(v, maxDepth - 1);
          });
          s = __strObject("Set", s);
        }
        return s;
      }
      
      stringifyMap(o: Map<any, any>, maxDepth: number) {
        var s = __strEmpty(o);
        if (s === null) {
          var first = true;
          o.forEach((v, k) => {
            if (first) {
              first = false;
              s += ", ";
            }
            s += this.stringify(k, maxDepth - 1);
            s += " => ";
            s += this.stringify(v, maxDepth - 1);
          });
          s = __strObject("Map", s);
        }
        return s;
      }
      
      stringifyIInspect(o: IInspect, maxDepth: number) {
        var s = __strEmpty(o);
        if (s === null) {
          s = o.inspect(maxDepth);
          if (!__isString(s)) {
            s = this.stringify(s, maxDepth);
          }
        }
        return s;
      }
      
      stringifyObject(o: any, maxDepth: number) {
        var s = __strEmpty(o);
        if (s === null) {
          var ctor = o.constructor
          var maxElements = this.maxElements
          var keys = __keys(o)
          var keyc = keys.length
          var truncate = false
          if (keyc > maxElements) {
            keyc = maxElements
            truncate = true
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
          s = __strObject(__fnName(ctor), s);
        }
        return s;
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
  function __isString(o: any) { return typeof o === 'string'; }
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
  
  function __strObject(constructorName: string, content: string) {
    var sep = content.length ? ' ' : '';
    return (
      "" +
      (constructorName && constructorName !== 'Object' ? constructorName + ' ' : '') +
      '{' + sep + content + sep + '}'
    );
  }
  
  function __typeOf(o) { return o === null ? 'null' : typeof o; }
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