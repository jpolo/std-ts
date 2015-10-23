//Util
function IsArray(o: any) {
  return Array.isArray ? Array.isArray(o) : Object.prototype.toString.call(o) === "[object Array]"
}
function IsString(o: any) { return typeof o === "string" }
function IsIURI(o: any) {
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
function OwnKeys(o: any) {
  let ks: string[]
  if (Object.keys) {
    ks = Object.keys(o)
  } else {
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        ks.push(k)
      }
    }
  }
  return ks
}
const __strIsEmpty = function (o: string) { return !o || o.length === 0; };
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
  '$');

export interface IQueryString { [s: string]: string; }

export interface IURI {
  scheme: string;
  userInfo: string;
  domain: string;
  port: number;
  path: string;
  query: IQueryString;
  fragment: string;
}

export class URI implements IURI {

  static cast(o: any): URI {
    let returnValue;
    if (o) {
      if (o instanceof URI) {
        returnValue = o;
      } else if (IsString(o)) {
        returnValue = URI.fromString(o);
      } else if ('toURI' in o) {
        returnValue = URI.cast(o.toURI());
      } else if (IsArray(o)) {
        returnValue = URI.fromArray(o);
      } else {
        returnValue = URI.fromObject(o);
      }
    }

    /*if (!returnValue) {
      throw new TypeError(o + ' cannot be coerced to URI');
    }*/
    return returnValue;
  }

  static compare(a: IURI, b: IURI): number {
    let aStr = URI.stringify(a)
    let bStr = URI.stringify(b)
    return (
      aStr === bStr ? 0 :
      aStr > bStr ? 1 :
      -1
    )
  }

  static fromArray(a: any[]): URI {
    return new URI(a[0], a[1], a[2], a[3] != null ? parseInt(a[3]) : null, a[4], a[5], a[6]);
  }

  static fromString(s: string): URI {
    let returnValue: URI;
    let parts: Array<any> = s.match(reParser);
    if (parts) {
      returnValue = URI.fromArray([
        decodeComponent(parts[1]),
        decodeComponent(parts[2]),
        decodeComponent(parts[3]),
        decodeComponent(parts[4]),
        decodeComponent(parts[5]),
        decodeQuery(parts[6]),
        decodeComponent(parts[7])
      ]);
    } else {
      throw new Error(s + ' is not a valid URI');
    }
    return returnValue;
  }

  static fromObject(o: IURI): URI {
    return new URI(
      o.scheme,
      o.userInfo,
      o.domain,
      o.port,
      o.path,
      o.query,
      o.fragment
    );
  }

  static isURI(o: any): boolean {
    return (o instanceof URI) || IsIURI(o);
  }

  static parse(s: string): URI {
    return URI.fromString(s);
  }

  static stringify(uri: IURI): string {
    let s = "";

    if (s === undefined || s === null) {
      s += uri;
    } else {
      let reDisallowedInSchemeOrUserInfo = /[#\/\?@]/g;
      let reDisallowedInFragment = /#/g;
      let reDisallowedInAbsolutePath = /[\#\?]/g;
      let reDisallowedInRelativePath =/[\#\?:]/g;

      let { scheme, userInfo, domain, port, path, query, fragment } = uri;
      let s = '';

      if (scheme != null) {
        s += encodeSpecialChars(scheme, reDisallowedInSchemeOrUserInfo) + ':';
      }

      if (domain != null) {
        s += '//';

        if (userInfo != null) {
          s += encodeSpecialChars(userInfo, reDisallowedInSchemeOrUserInfo) + '@';
        }

        s += encodeComponent(domain);
        if (port != null) {
          s += ':' + port;
        }
      }

      if (path != null) {
        if (domain && path.charAt(0) != '/') {
          s += '/';
        }
        s += encodeSpecialChars(
          path,
          path.charAt(0) == '/' ?
            reDisallowedInAbsolutePath :
            reDisallowedInRelativePath
        );
      }

      if (query != null) {
        s += '?' + encodeQuery(query);
      }

      if (fragment != null) {
        s += '#' + encodeSpecialChars(fragment, reDisallowedInFragment);
      }
    }
    return s;
  }

  private _href = null;

  constructor(
    public scheme: string,
    public userInfo: string,
    public domain: string,
    public port: number,
    public path: string,
    public query: IQueryString,
    public fragment: string
  ) {
    //make non mutable
    //Object.freeze(this);
  }

  compare(u: IURI): number {
    return URI.compare(this, u)
  }

  equals(o: any): boolean {
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

  //hashCode() {
  //
  //}

  inspect(): string {
    let s = "" + this;
    let sep = s.length > 0 ? ' ' : ''
    return 'URI {' + sep + s + sep + '}'
  }

  isAbsolute(): boolean {
    return (
      !__strIsEmpty(this.scheme) &&
      !__strIsEmpty(this.domain) && //port?
      !__strIsEmpty(this.path)
    )
  }

  isRelative(): boolean {
    return !this.isAbsolute()
  }

  toJSON(): string {
    return this.toString();
  }

  toArray(): Array<any> {
    return [
      this.scheme,
      this.userInfo,
      this.domain,
      this.port,
      this.path,
      this.query,
      this.fragment
    ];
  }

  toString(): string {
    return URI.stringify(this);
  }

  valueOf() {
    return this.toString();
  }
}

export function encodeComponent(s: string): string {
  return s == null ? '' : encodeURIComponent(s)
}

export function decodeComponent(s: string): string {
  return s == null ? null : decodeURIComponent(s)
}

function encodeSpecialChars(unescapedPart: string, extra) {
  return (
    IsString(unescapedPart) ?
    encodeURI(unescapedPart).replace(extra, encodeChar) :
    null
  )
}

function encodeChar(ch: string): string {
  let n = ch.charCodeAt(0);
  return '%' + ((n >> 4) & 0xf).toString(16) + (n & 0xf).toString(16);
}

export function encodeQuery(qs: IQueryString): string {
  let s = null, okeys, i, l, key, val;
  if (qs) {
    okeys = OwnKeys(qs);

    for (i = 0, l = okeys.length; i < l; ++i) {
      if (i === 0) {
        s = '';
      } else {
        s += '&';
      }
      key = okeys[i];
      val = qs[key];

      if (IsArray(val) && !IsString(val)) {
        for (i = 0, l = val.length; i < l; ++i) {
          if (s.length > 0) {
            s += '&';
          }
          s += encodeComponent(key /*+ '[' + i + ']'*/);
          s += '=';
          s += encodeComponent(val[i]);
        }

      } else {
        s += encodeComponent(key);
        s += '=';
        s += encodeComponent(val);
      }
    }
  }
  return s;
}

export function decodeQuery(s: string): IQueryString {
  let qs = null;
  if (s) {
    qs = {};
    let pairs = s.split('&');
    let indexOfEquals, pair, key, val, qsval;
    for (let i = 0, l = pairs.length; i < l; ++i) {
      pair = pairs[i];
      indexOfEquals = pair.indexOf('=');
      key = pair;
      val = null;
      if (indexOfEquals >= 0) {
        key = pair.substring(0, indexOfEquals);
        val = pair.substring(indexOfEquals + 1);
      }

      //decode
      key = decodeComponent(key);
      val = decodeComponent(val);
      qsval = qs[key];
      if (qsval) {
        if (!IsArray(qsval)) {
          qs[key] = [qsval, val];
        } else {
          qs[key].push(val);
        }
      } else {
        qs[key] = val;
      }
    }
  }
  return qs;
}



function _queryEquals(l: any, r: any): boolean {
  let returnValue = true;
  if (l !== r) {
    let lkeys = OwnKeys(l);
    let rkeys = OwnKeys(r);
    let lkeyc: number = lkeys.length;
    let rkeyc: number = rkeys.length;

    if (lkeyc !== rkeyc) {
      returnValue = false;
    } else {
      lkeys.sort();
      rkeys.sort();

      for (let i = 0, key; i < lkeyc; ++i) {
        key = lkeys[i];
        if (key !== rkeys[i] || l[key] !== r[key]) {
          returnValue = false;
          break;
        }
      }
    }
  }
  return returnValue;
}
