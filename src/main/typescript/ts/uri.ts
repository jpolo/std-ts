module uri {

  export function parse(s: string): URI {
    return URI.fromString(s);
  }

  export function stringify(uri: IURI): string {
    var reDisallowedInSchemeOrUserInfo = /[#\/\?@]/g;
    var reDisallowedInFragment = /#/g;
    var reDisallowedInAbsolutePath = /[\#\?]/g;
    var reDisallowedInRelativePath =/[\#\?:]/g;
    
    var scheme = uri.scheme;
    var userInfo = uri.userInfo;
    var domain = uri.domain;
    var port = uri.port;
    var path = uri.path;
    var query = uri.query;
    var fragment = uri.fragment;
    
    var s = '';
    
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
    return s;
  }

  export interface IQueryString { [s: string]: string; }

  export interface IURI {
    scheme?: string;
    userInfo?: string;
    domain?: string;
    port?: number;
    path?: string;
    query?: IQueryString;
    fragment?: string;
  }

  export class URI implements IURI {

    static cast(o: any): URI {
      var returnValue;
      if (o) {
        if (o instanceof URI) {
          returnValue = o;
        } else if (typeof o === 'string') {
          returnValue = URI.fromString(o);
        } else if ('toURI' in o) {
          returnValue = URI.cast(o.toURI());
        } else if (Array.isArray(o)) {
          returnValue = URI.fromArray(o);
        } else {
          returnValue = URI.fromObject(o);
        }
      }
  
      if (!returnValue) {
        throw new TypeError(o + ' cannot be coerced to URI');
      }
      return returnValue;
    }
    
    static fromArray(a: any[]): URI {
      return new URI(a[0], a[1], a[2], a[3] != null ? parseInt(a[3]) : null, a[4], a[5], a[6]);
    }

    static fromString(s: string): URI {
      var returnValue: URI;
      var parts: Array<any> = s.match(reParser);
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

    equals(o: any): boolean {
      return (
        this === o ||
        (
          o && (o instanceof URI) &&
          this.scheme === o.scheme &&
          this.domain === o.domain &&
          this.port === o.port &&
          this.path === o.path &&
          eq(this.query, o.query)
        )
      )
    }
    
    //hashCode(): number {
    //  return std.hash(this.toString());
    //}
      
    inspect(): string {
      return 'URI(' + this.toString() + ')';
    }
      
    isAbsolute(): boolean {
      return (
        !strIsEmpty(this.scheme) &&
        !strIsEmpty(this.domain) && //port?
        !strIsEmpty(this.path)
      );
    }

    isRelative(): boolean {
      return !this.isAbsolute();
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
      return stringify(this);
    }

    /*unapply<T>(fn: (
      scheme: string, 
      userInfo: string, 
      domain: string, 
      port: number, 
      path: string, 
      query: IQueryString, 
      fragment: string
      ) => T
    ): T {
      return fn(
        this.scheme,
        this.userInfo,
        this.domain,
        this.port,
        this.path,
        this.query,
        this.fragment
      );
    }*/

    valueOf() {
      return this.toString();
    }
  }
  
  var reParser = new RegExp(
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

  export function encodeComponent(s: string): string {
    return s == null ? '' : encodeURIComponent(s);
  }

  export function decodeComponent(s: string): string {
    return s == null ? null : decodeURIComponent(s);
  }
  
  function encodeSpecialChars(unescapedPart: string, extra) {
    return typeof unescapedPart === 'string' ?
      encodeURI(unescapedPart).replace(extra, encodeChar) :
      null;
  }

  function encodeChar(ch: string): string {
    var n = ch.charCodeAt(0);
    return '%' + ((n >> 4) & 0xf).toString(16) + (n & 0xf).toString(16);
  }

  export function encodeQuery(qs: IQueryString): string {
    var s = null, okeys, i, l, key, val;
    if (qs) {
      okeys = $keys(qs);

      for (i = 0, l = okeys.length; i < l; ++i) {
        if (i === 0) {
          s = '';
        } else {
          s += '&';
        }
        key = okeys[i];
        val = qs[key];

        if (Array.isArray(val) && typeof val != 'string') {
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
    var qs = null;
    if (s) {
      qs = {};
      var pairs = s.split('&');
      var indexOfEquals, pair, key, val, qsval;
      for (var i = 0, l = pairs.length; i < l; ++i) {
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
          if (!Array.isArray(qsval)) {
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
  
  
  
  function eq(l, r): boolean {
    var returnValue = true;
    if (l !== r) {
      var lkeys = $keys(l);
      var rkeys = $keys(r);
      var lkeyc: number = lkeys.length;
      var rkeyc: number = rkeys.length;
      
      if (lkeyc !== rkeyc) {
        returnValue = false;
      } else {
        lkeys.sort();
        rkeys.sort();
        
        for (var i = 0, key; i < lkeyc; ++i) {
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
  
  function strIsEmpty(o: string) {
    return !o || o.length === 0;
  }
  
  function $keys(o) {
    return Object.keys(o);
  }
  
}

export = uri;