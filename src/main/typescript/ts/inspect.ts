module inspect {
  
  //Util
  var __es3Compat = true;
  var __es5Compat = __es3Compat || true;
  var __ostring = Object.prototype.toString;
  var __fstring = Function.prototype.toString
  var __name = function (f: Function) { 
    return (<any>f).displayName || (<any>f).name || ((<any>f).name = /\W*function\s+([\w\$]+)\(/.exec(__str(f))[1]);
  };
  var __isString = function (o: any) { return typeof o === 'string'; };
  var __isFunction = function (o: any) { return typeof o === 'function'; };
  var __isObject = function (o: any) { return o !== null && (typeof o === 'object' || typeof o === 'function'); };
  var __keys = Object.keys;
  var __set:<T>() => { has: (o: T) => boolean; add: (o: T) => void } = typeof Set !== "undefined" ? function () { return new Set(); } : null;
  var __str = String;
  var __strTruncate = function (s: string, maxLength: number, ellipsis = "...") {
    return (s.length > maxLength ? s.slice(0, maxLength) + ellipsis : s);
  };
  var __typeOf = typeof null === "null" ? function (o) { return typeof o; } : null;
  var __stringTag = function (o: any) {
    var s = '';
    if (o === undefined) {
      s = 'Undefined';
    } else if (o === null) {
      s = 'Null';
    } else {
      var c = o.constructor;
      s = c && c.name || __ostring.call(o).slice(8, -1);
    }
    return s;
  };
  
  //Compat
  if (__es3Compat) {
    __keys = __keys || function (o) { var ks = []; for (var k in o) { if (o.hasOwnProperty(k)) { ks.push(k); } } return ks; };
  }
  if (__es5Compat) {
    __set = __set || function () {
      var d = [];
      return {
        has: function (o) { return d.indexOf(o) !== -1; },
        add: function (o) { if (d.indexOf(o) !== -1) { d.push(o); } }  
      };
    };
    __typeOf = __typeOf || function (o) { return o === null ? 'null' : typeof o; };
  }

  export interface IInspect {
    
    inspect(maxDepth?: number): string;
    
  }
  

  export interface IEngine {
    stringify(o: any, maxDepth?: number): string 
  }

  export module engine {
    var __inspectEmpty = function (i: Engine, o: any): string { 
      return (o === null ? i.stringifyNull() : o === undefined ? i.stringifyUndefined() : null); 
    };
    var __format = function (constructorName: string, content: string) {
      content = __str(content);
      var sep = content.length ? ' ' : '';
      return (
        "" +
        (constructorName && constructorName !== 'Object' ? constructorName + ' ' : '') +
        '{' + sep + content + sep + '}'
      );
    };
    
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
      public ellipsis = "..."
      
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
      
      stringify(o: any, maxDepth: number = this.maxDepth): string {
        var s = ''
            
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
              var init = !this._refs;
              var refs = init ? (this._refs = __set()) : this._refs;
              var strTag = o.constructor ? __name(o.constructor) : "Object";
              switch (strTag) {
                //Special
                case 'Array': s = this.stringifyArray(o, maxDepth); break;
                case 'Map': s = this.stringifyMap(o, maxDepth); break;
                case 'Set': s = this.stringifySet(o, maxDepth); break;
                case 'Date': s = this.stringifyDate(o); break;
                case 'RegExp': s = this.stringifyRegExp(o); break;
                default:
                  try {
                    var method = o.inspect;
                    if (
                      method &&
                      !this._ignored.has(method)
                    ) {
                      s = this.stringifyIInspect(o, maxDepth);
                    } else {
                      s = this.stringifyObject(o, maxDepth);
                    }
                  } finally {
                    if (init) {
                      //reinit
                      this._refs = null
                    }
                  }
              }
              if (init) {
                this._refs = null
              }
          }
        }
        return s
      }
      
      stringifyUndefined(): string {
        return 'undefined';
      }
      
      stringifyNull(): string {
        return 'null';
      }
      
      stringifyBoolean(o: boolean): string {
        var s = __inspectEmpty(this, o);
        return s === null ? __str(o) : s;
      }
      
      stringifyDate(o: Date): string {
        var s = __inspectEmpty(this, o);
        return s === null ? __format('Date', o.toISOString()) : s;
      }
      
      stringifyNumber(o: number): string {
        var s = __inspectEmpty(this, o);
        return s === null ? __str(o) : s;
      }
      
      stringifyRegExp(o: RegExp): string {
        var s = __inspectEmpty(this, o);
        return s === null ? __str(o) : s;
      }
      
      stringifyString(o: string): string {
        var s = __inspectEmpty(this, o);
        return (s === null ? '"' + 
          (__strTruncate(o, this.maxString, this.ellipsis)
          .replace(/"/g, '\\"' )
          .replace(/[\n\r]/g, "↵")) + '"' : s);
      }
      
      stringifyFunction(o: Function): string {
        var s = __inspectEmpty(this, o);
        if (s === null) {
          s = __fstring.call(o);
          var i = s.indexOf('{');
          var head = s.slice(0, i + 1);
          var content = s.slice(i + 1, -1);
          s = head + __strTruncate(content, 0, this.ellipsis) + '}';
        }
        return s;
      }
      
      stringifyArray(a: any[], maxDepth: number = this.maxDepth): string {
        var s = __inspectEmpty(this, a);
        if (s === null) {
          var maxElements = this.maxElements;
          var ellipsis = this.ellipsis;
          var length = a.length;
          var truncate = length > maxElements;
          
          s = (
            maxDepth <= 0 && length ? ellipsis :
            '[' + 
              (truncate ? a.slice(0, maxElements) : a).map((v) => this.stringify(v, maxDepth - 1)).join(', ') + 
              (truncate ? ', ' + ellipsis : '') + 
            ']'
          );
        }
        return s;
      }
      
      stringifySet(o: Set<any>, maxDepth: number = this.maxDepth) {
        var s = __inspectEmpty(this, o);
        if (s === null) {
          var maxElements = this.maxElements;
          var ellipsis = this.ellipsis;
          var count = 0;
          o.forEach((v) => {
            if (count === maxElements) {
              s += ', ' + ellipsis;
            } else if (count > maxElements) {
              //do nothing
            } else {
              if (count === 0) {
                s += ", ";
              }
              s += this.stringify(v, maxDepth - 1);
            }
            count++;
          });
          s = __format("Set", s);
        }
        return s;
      }
      
      stringifyMap(o: Map<any, any>, maxDepth: number = this.maxDepth) {
        var s = __inspectEmpty(this, o);
        if (s === null) {
          var maxElements = this.maxElements;
          var ellipsis = this.ellipsis;
          var count = 0;
          o.forEach((v, k) => {
            if (count === maxElements) {
              s += ', ' + ellipsis;
            } else if (count > maxElements) {
              //do nothing
            } else {
              if (count === 0) {
                s += ", ";
              }
              s += this.stringify(k, maxDepth - 1);
              s += " => ";
              s += this.stringify(v, maxDepth - 1);
            }
            
          });
          s = __format("Map", s);
        }
        return s;
      }
      
      stringifyIInspect(o: IInspect, maxDepth: number = this.maxDepth) {
        var s = __inspectEmpty(this, o);
        if (s === null) {
          s = o.inspect(maxDepth);
          if (!__isString(s)) {
            s = this.stringify(s, maxDepth);
          }
        }
        return s;
      }
      
      stringifyObject(o: any, maxDepth: number = this.maxDepth) {
        var s = __inspectEmpty(this, o);
        if (s === null) {
          s = '';
          var ctor = o.constructor;
          var ctorName = __name(ctor);
          switch(ctorName) {
            //Boxed primitives
            case 'Boolean':
              s = this.stringifyBoolean(!!o);
              break;
            case 'Number':
              s = this.stringifyNumber(+o);
              break;
            case 'String':
              s = this.stringifyString(__str(o));
              break;
              
            //Normal boxed
            default:
              var maxElements = this.maxElements;
              var ellipsis = this.ellipsis;
              var keys = __keys(o);
              var keyc = keys.length;
              var truncate = false;
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
                s += ', ' + ellipsis;
              }
          }
          
          
          s = __format(ctorName, s);
        }
        return s;
      }
    }
  }
  
  export function stringify(o: any): string {
    return engine.get().stringify(o)
  }
  
  
  
  
}
export = inspect