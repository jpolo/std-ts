// Constant
declare var Set: any // TODO remove

// Util
function FunctionName (f: Function): string {
  return (f as any).displayName || (f as any).name || ((f as any).name = /\W*function\s+([\w\$]+)\(/.exec(ToString(f))[1])
}

function FunctionToString (f: Function) {
  return Function.prototype.toString.call(f)
}

function OwnKeys (o: any) {
  let keys: string[]
  if (Object.keys) {
    keys = Object.keys(o)
  } else {
    keys = []
    for (const prop in o) {
      if (o.hasOwnProperty(prop)) {
        keys.push(prop)
      }
    }
  }
  return keys
}

function Type (o: any) { return o === null ? 'null' : typeof o }

function ToString (o: any) { return '' + o }

function SetCreate<T> (): { has: (o: T) => boolean; add: (o: T) => void } {
  if (typeof Set !== 'undefined') {
    return new Set()
  } else {
    const d: T[] = []
    return {
      add (o) { if (d.indexOf(o) !== -1) { d.push(o) } },
      has (o) { return d.indexOf(o) !== -1 }
    }
  }
}

function StringTruncate (s: string, maxLength: number, ellipsis = '...') {
  return (s.length > maxLength ? s.slice(0, maxLength) + ellipsis : s)
}

function DumpEmpty<T> (i: Inspector, o: T, orElse?: (o: T) => string): string {
  return (
    o === null ? i.stringifyNull() :
    o === undefined ? i.stringifyUndefined() :
    orElse ? orElse(o) :
    null
  )
}

function DumpObject (constructorName: string, content: string) {
  content = ToString(content)
  const sep = content.length ? ' ' : ''
  return (
    '' +
    (constructorName && constructorName !== 'Object' ? constructorName + ' ' : '') +
    '{' + sep + content + sep + '}'
  )
}

export interface IInspect {
  inspect (maxDepth?: number): string
}

export interface IInspector {
  stringify (o: any, maxDepth?: number): string
}

export class Inspector implements IInspector {
  public maxDepth = 6
  public maxElements = 7
  public maxString = 30
  public ellipsis = '...'

  private _refs = SetCreate()

  constructor (
    conf?: {
      maxDepth?: number;
      maxElements?: number;
      maxString?: number
    }
  ) {
    if (conf) {
      const keys = OwnKeys(conf)
      for (const key of keys) {
        if (this.hasOwnProperty(key)) {
          this[key] = conf[key]
        }
      }
    }
  }

  stringify (o: any, maxDepth: number = this.maxDepth): string {
    let s = ''

    if (!s) {
      switch (Type(o)) {
        // Primitive
        case 'undefined': s = this.stringifyUndefined(); break
        case 'null': s = this.stringifyNull(); break
        case 'boolean': s = this.stringifyBoolean(o); break
        case 'number': s = this.stringifyNumber(o); break
        case 'string': s = this.stringifyString(o); break
        case 'function': s = this.stringifyFunction(o); break
        default:
          const init = !this._refs
          // let refs = init ? (this._refs = SetCreate()) : this._refs;
          const strTag = o.constructor ? FunctionName(o.constructor) : 'Object'
          switch (strTag) {
            // Special
            case 'Array': s = this.stringifyArray(o, maxDepth); break
            // case "Map": s = this.stringifyMap(o, maxDepth); break;
            // case "Set": s = this.stringifySet(o, maxDepth); break;
            case 'Date': s = this.stringifyDate(o); break
            case 'RegExp': s = this.stringifyRegExp(o); break
            default:
              try {
                if (isIInspect(o)) {
                  s = this.stringifyIInspect(o, maxDepth)
                } else {
                  s = this.stringifyObject(o, maxDepth)
                }
              } finally {
                if (init) {
                  // reinit
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

  stringifyUndefined (): string {
    return 'undefined'
  }

  stringifyNull (): string {
    return 'null'
  }

  stringifyBoolean (o: boolean|Boolean): string {
    let s = DumpEmpty(this, o)
    if (s === null) {
      s = ToString(o)
      if (typeof o === 'object') {
        s = DumpObject('Boolean', s)
      }
    }
    return s
  }

  stringifyDate (o: Date): string {
    const s = DumpEmpty(this, o)
    return s === null ? DumpObject('Date', o.toISOString()) : s
  }

  stringifyNumber (o: number|Number): string {
    let s = DumpEmpty(this, o)
    if (s === null) {
      s = ToString(o)
      if (typeof o === 'object') {
        s = DumpObject('Number', s)
      }
    }
    return s
  }

  stringifyRegExp (o: RegExp): string {
    const s = DumpEmpty(this, o)
    return s === null ? ToString(o) : s
  }

  stringifyString (o: string|String): string {
    let s = DumpEmpty(this, o)
    if (s === null) {
      s = '\"' +
        (StringTruncate(ToString(o), this.maxString, this.ellipsis)
        .replace(/"/g, '\\\"' )
        .replace(/[\n\r]/g, '↵')) + '\"'

      if (typeof o === 'object') {
        s = DumpObject('String', s)
      }
    }
    return s
  }

  stringifyFunction (o: Function): string {
    let s = DumpEmpty(this, o)
    if (s === null) {
      s = FunctionToString(o)
      const i = s.indexOf('{')
      const head = s.slice(0, i + 1)
      const content = s.slice(i + 1, -1)
      s = head + StringTruncate(content, 0, this.ellipsis) + '}'
    }
    return s
  }

  stringifyArray (a: any[], maxDepth: number = this.maxDepth): string {
    let s = DumpEmpty(this, a)
    if (s === null) {
      const { maxElements, ellipsis } = this
      const length = a.length
      const truncate = length > maxElements

      s = (
        maxDepth <= 0 && length ? ellipsis :
        '[' +
          (truncate ? a.slice(0, maxElements) : a).map((v) => this.stringify(v, maxDepth - 1)).join(', ') +
          (truncate ? ', ' + ellipsis : '') +
        ']'
      )
    }
    return s
  }

  /*
  stringifySet(o: Set<any>, maxDepth: number = this.maxDepth) {
    var s = __inspectEmpty(this, o);
    if (s === null) {
      var maxElements = this.maxElements;
      var ellipsis = this.ellipsis;
      var count = 0;
      o.forEach((v) => {
        if (count === maxElements) {
          s += ", " + ellipsis;
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
  */

  /*
  stringifyMap(o: Map<any, any>, maxDepth: number = this.maxDepth) {
    var s = __inspectEmpty(this, o);
    if (s === null) {
      var maxElements = this.maxElements;
      var ellipsis = this.ellipsis;
      var count = 0;
      o.forEach((v, k) => {
        if (count === maxElements) {
          s += ", " + ellipsis;
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
  */

  stringifyIInspect (o: IInspect, maxDepth: number = this.maxDepth) {
    let s = DumpEmpty(this, o)
    if (s === null) {
      s = o.inspect(maxDepth) // TODO catch errors?
      if (typeof s !== 'string') {
        s = this.stringify(s, maxDepth)
      }
    }
    return s
  }

  stringifyObject (o: any, maxDepth: number = this.maxDepth) {
    let s = DumpEmpty(this, o)
    if (s === null) {
      s = ''
      const ctor = o.constructor
      const ctorName = FunctionName(ctor)
      switch (ctorName) {
        // Boxed primitives
        case 'Boolean': s = this.stringifyBoolean(o); break
        case 'Number': s = this.stringifyNumber(o); break
        case 'String': s = this.stringifyString(o); break

        // Normal class
        default:
          const maxElements = this.maxElements
          const ellipsis = this.ellipsis
          const keys = OwnKeys(o)
          let keyc = keys.length
          let truncate = false
          if (keyc > maxElements) {
            keyc = maxElements
            truncate = true
          }
          for (let i = 0; i < keyc; ++i) {
            const key = keys[i]
            const val = o[key]

            if (i !== 0) {
              s += ', '
            }
            s += key + ': ' + this.stringify(val, maxDepth - 1)
          }
          if (truncate) {
            s += ', ' + ellipsis
          }
          s = DumpObject(ctorName, s)
      }
    }
    return s
  }
}

export function isIInspect (o: any): boolean {
  return (o && typeof o.inspect === 'function')
}

const $inspectorDefault = new Inspector()
export function stringify (o: any): string {
  return $inspectorDefault.stringify(o)
}
