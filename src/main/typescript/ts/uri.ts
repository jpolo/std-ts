// Util
function IsArray (o: any): o is Array<any> {
  return Array.isArray ? Array.isArray(o) : Object.prototype.toString.call(o) === '[object Array]'
}
function IsString (o: any): o is string { return typeof o === 'string' }
function IsIURI (o: any): o is IURI {
  return (o &&
    ('scheme' in o) &&
    ('userInfo' in o) &&
    ('domain' in o) &&
    ('port' in o) &&
    ('path' in o) &&
    ('query' in o) &&
    ('fragment' in o)
  )
}
function OwnKeys (o: any) {
  if (Object.keys) {
    return Object.keys(o)
  } else {
    const ks: string[] = []
    for (const k in o) {
      if (o.hasOwnProperty(k)) {
        ks.push(k)
      }
    }
    return ks
  }
}
function IsEmptyString (o: string) { return !o || o.length === 0 }
const reParser = new RegExp(
  '^' +
  '(?:' +
  '([^:/?#.]+)' +                     // scheme - ignore special characters
  // used by other URL parts such as :,
  // ?, /, #, and .
  ':)?' +
  '(?://' +
  '(?:([^/?#]*)@)?' +                 // userInfo
  '([^/#?]*?)' +                      // domain
  '(?::([0-9]+))?' +                  // port
  '(?=[/#?]|$)' +                     // authority-terminating character
  ')?' +
  '([^?#]+)?' +                         // path
  '(?:\\?([^#]*))?' +                   // query
  '(?:#(.*))?' +                        // fragment
  '$')

export interface IQueryString { [s: string]: string | string[] }

export interface IURI {
  readonly scheme: string
  readonly userInfo: string
  readonly domain: string
  readonly port: number
  readonly path: string
  readonly query: IQueryString
  readonly fragment: string
}

export class URI implements IURI {

  static cast (o: any): URI {
    if (o) {
      if (o instanceof URI) {
        return o
      } else if (IsString(o)) {
        return URI.fromString(o)
      } else if ('toURI' in o) {
        return URI.cast(o.toURI())
      } else if (IsArray(o)) {
        return URI.fromArray(o)
      } else {
        return URI.fromObject(o)
      }
    }
    throw new TypeError(o + ' cannot be coerced to URI')
  }

  static compare (a: IURI, b: IURI): number {
    const aStr = URI.stringify(a)
    const bStr = URI.stringify(b)
    return (
      aStr === bStr ? 0 :
      aStr > bStr ? 1 :
      -1
    )
  }

  static fromArray (a: any[]): URI {
    return new URI(a[0], a[1], a[2], a[3] != null ? parseInt(a[3], 10) : null, a[4], a[5], a[6])
  }

  static fromString (s: string): URI {
    const parts = s.match(reParser)
    if (parts) {
      return URI.fromArray([
        decodeComponent(parts[1]),
        decodeComponent(parts[2]),
        decodeComponent(parts[3]),
        decodeComponent(parts[4]),
        decodeComponent(parts[5]),
        decodeQuery(parts[6]),
        decodeComponent(parts[7])
      ])
    } else {
      throw new Error(s + ' is not a valid URI')
    }
  }

  static fromObject (o: IURI): URI {
    return new URI(
      o.scheme,
      o.userInfo,
      o.domain,
      o.port,
      o.path,
      o.query,
      o.fragment
    )
  }

  static isURI (o: any): boolean {
    return (o instanceof URI) || IsIURI(o)
  }

  static parse (s: string): URI {
    return URI.fromString(s)
  }

  static stringify (uri: IURI): string {
    const reDisallowedInSchemeOrUserInfo = /[#\/\?@]/g
    const reDisallowedInFragment = /#/g
    const reDisallowedInAbsolutePath = /[\#\?]/g
    const reDisallowedInRelativePath = /[\#\?:]/g

    const { scheme, userInfo, domain, port, path, query, fragment } = uri
    let s = ''

    if (scheme != null) {
      s += encodeSpecialChars(scheme, reDisallowedInSchemeOrUserInfo) + ':'
    }

    if (domain != null) {
      s += '//'

      if (userInfo != null) {
        s += encodeSpecialChars(userInfo, reDisallowedInSchemeOrUserInfo) + '@'
      }

      s += encodeComponent(domain)
      if (port != null) {
        s += ':' + port
      }
    }

    if (path != null) {
      if (domain && path.charAt(0) !== '/') {
        s += '/'
      }
      s += encodeSpecialChars(
        path,
        path.charAt(0) === '/' ?
          reDisallowedInAbsolutePath :
          reDisallowedInRelativePath
      )
    }

    if (query != null) {
      s += '?' + encodeQuery(query)
    }

    if (fragment != null) {
      s += '#' + encodeSpecialChars(fragment, reDisallowedInFragment)
    }
    return s
  }

  constructor (
    public readonly scheme: string,
    public readonly userInfo: string,
    public readonly domain: string,
    public readonly port: number,
    public readonly path: string,
    public readonly query: IQueryString,
    public readonly fragment: string
  ) {

  }

  compare (u: IURI): number {
    return URI.compare(this, u)
  }

  equals (o: any): boolean {
    return (
      this === o ||
      (
        o &&
        (o instanceof this.constructor) &&
        this.scheme === o.scheme &&
        this.domain === o.domain &&
        this.port === o.port &&
        this.path === o.path &&
        _queryEquals(this.query, o.query)
      )
    )
  }

  inspect (): string {
    const s = '' + this
    const sep = s.length > 0 ? ' ' : ''
    return 'URI {' + sep + s + sep + '}'
  }

  isAbsolute (): boolean {
    return (
      !IsEmptyString(this.scheme) &&
      !IsEmptyString(this.domain) && // port?
      !IsEmptyString(this.path)
    )
  }

  isRelative (): boolean {
    return !this.isAbsolute()
  }

  toJSON (): string {
    return this.toString()
  }

  toArray (): Array<any> {
    return [
      this.scheme,
      this.userInfo,
      this.domain,
      this.port,
      this.path,
      this.query,
      this.fragment
    ]
  }

  toString (): string {
    return URI.stringify(this)
  }

  valueOf () {
    return this.toString()
  }
}

export function encodeComponent (s: string): string {
  return encodeURIComponent(s)
}

export function decodeComponent (s: string): string {
  return decodeURIComponent(s)
}

function encodeSpecialChars (unescapedPart: string, extra: RegExp) {
  return (
    IsString(unescapedPart) ?
    encodeURI(unescapedPart).replace(extra, encodeChar) :
    null
  )
}

function encodeChar (ch: string): string {
  const n = ch.charCodeAt(0)
  return '%' + ((n >> 4) & 0xf).toString(16) + (n & 0xf).toString(16)
}

export function encodeQuery (qs: IQueryString): string {
  let s = ''
  if (qs) {
    const okeys = OwnKeys(qs)
    const okeyc = okeys.length

    for (let i = 0; i < okeyc; ++i) {
      if (i === 0) {
        s = ''
      } else {
        s += '&'
      }
      const key = okeys[i]
      const val = qs[key]

      if (IsArray(val)) {
        const valLength = val.length
        for (let valIndex = 0; valIndex < valLength; ++valIndex) {
          if (s.length > 0) {
            s += '&'
          }
          s += `${encodeComponent(key /*+ "[" + i + "]"*/)}=${encodeComponent(val[valIndex])}`
        }

      } else {
        s += `${encodeComponent(key)}=${encodeComponent(val)}`
      }
    }
  }
  return s
}

export function decodeQuery (s: string): IQueryString {
  const qs: IQueryString = {}
  if (s) {
    const pairs = s.split('&')
    const pairsLength = pairs.length
    for (let i = 0; i < pairsLength; ++i) {
      const pair = pairs[i]
      const indexOfEquals = pair.indexOf('=')
      let key = pair
      let val = null
      if (indexOfEquals >= 0) {
        key = pair.substring(0, indexOfEquals)
        val = pair.substring(indexOfEquals + 1)
      }

      // decode
      const keyDecoded = decodeComponent(key)
      const valDecoded = val ? decodeComponent(val) : ''
      const qsval = qs[keyDecoded]
      if (qsval) {
        if (!IsArray(qsval)) {
          qs[keyDecoded] = [qsval, valDecoded]
        } else {
          qsval.push(valDecoded)
        }
      } else {
        qs[keyDecoded] = valDecoded
      }
    }
  }
  return qs
}

function _queryEquals (l: any, r: any): boolean {
  if (l !== r) {
    const lkeys = OwnKeys(l)
    const rkeys = OwnKeys(r)
    const lkeyc = lkeys.length
    const rkeyc = rkeys.length

    if (lkeyc !== rkeyc) {
      return false
    } else {
      lkeys.sort()
      rkeys.sort()

      for (let i = 0; i < lkeyc; ++i) {
        const key = lkeys[i]
        if (key !== rkeys[i] || l[key] !== r[key]) {
          return false
        }
      }
    }
  }
  return true
}
