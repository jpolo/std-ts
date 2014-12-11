module base64 {
  
  var B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var B64_TABLE = (function (chars) {
    var t: { [key: string]: number } = {};
    for (var i = 0, l = chars.length; i < l; i++) {
      t[chars.charAt(i)] = i;
    }
    return t;
  }(B64_CHARS));
  
  var __global: Window = (new Function("return this;")).call(null)
  var __str = String
  var __strFromCharCode = String.fromCharCode
  
  //native encode
  var __btoa = __global.btoa || (function () {
    var re_encode = /[\s\S]{1,3}/g
    
    function cb_encode(ccc) {
      var padlen = [0, 2, 1][ccc.length % 3],
      ord = ccc.charCodeAt(0) << 16
          | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
          | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
      chars = [
        B64_CHARS.charAt( ord >>> 18),
        B64_CHARS.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : B64_CHARS.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : B64_CHARS.charAt(ord & 63)
      ];
      return chars.join('');
    };
    
    function btoa(rawString: string): string {
      return __str(rawString).replace(re_encode, cb_encode);
    };
    return btoa
  }())
  
  //native decode
  var __atob = __global.atob || (function () {
    var re_atob = /[\s\S]{1,4}/g
    
    function cb_decode(cccc: string) {
      var len = cccc.length,
      padlen = len % 4,
      n = (len > 0 ? B64_TABLE[cccc.charAt(0)] << 18 : 0)
          | (len > 1 ? B64_TABLE[cccc.charAt(1)] << 12 : 0)
          | (len > 2 ? B64_TABLE[cccc.charAt(2)] <<  6 : 0)
          | (len > 3 ? B64_TABLE[cccc.charAt(3)]       : 0),
      chars = [
        __strFromCharCode( n >>> 16),
        __strFromCharCode((n >>>  8) & 0xff),
        __strFromCharCode( n         & 0xff)
      ];
      chars.length -= [0, 0, 2, 1][padlen];
      return chars.join('');
    }
    
    function atob(encodedString: string): string {
      return __str(encodedString).replace(re_atob, cb_decode);
    }
  
    return atob
  }())
  
  
  
  
  var __utob = (function () {
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    
    function cb_utob(c: string) {
      var returnValue: string
      var cc: number
      if (c.length < 2) {
        cc = c.charCodeAt(0);
        returnValue = cc < 0x80 ? c
            : cc < 0x800 ? (__strFromCharCode(0xc0 | (cc >>> 6))
                            + __strFromCharCode(0x80 | (cc & 0x3f)))
            : (__strFromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
               + __strFromCharCode(0x80 | ((cc >>>  6) & 0x3f))
               + __strFromCharCode(0x80 | ( cc         & 0x3f)));
      } else {
        cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        returnValue = (__strFromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + __strFromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + __strFromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                + __strFromCharCode(0x80 | ( cc         & 0x3f)));
      }
      return returnValue
    }
    
    function utob(u: string): string {
      return u.replace(re_utob, cb_utob);
    }
    return utob
  }())
  
  

  declare function require(name:string);//NodeJS
  var Buffer = typeof require !== 'undefined' ? require('buffer').Buffer : null
  
  var _encode = Buffer ? function (u: string) { return (new Buffer(u)).toString('base64') } 
    : function (u: string) { return __btoa(__utob(u)) }
    ;
  
  
  
  
    
}

(function(global) {

    // constants
    

    // encoder stuff
    
    
    var _encode = Buffer ? function (u: string) { return (new Buffer(u)).toString('base64') } 
    : function (u: string) { return __btoa(__utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe 
            ? _encode(u)
            : _encode(u).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
  
  
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    
    var _decode = buffer
        ? function(a) { return (new buffer(a, 'base64')).toString() }
    : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            a.replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };

    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    // that's it!
})(this);

