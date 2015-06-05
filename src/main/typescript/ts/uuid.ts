module uuid {
  
  type ByteArray = { [k: number]: number; length: number; } 
  
  //Constant
  var LENGTH = 16;
  
  //Util
  var __global: any = typeof window !== "undefined" ? window : (function() { return this; }());
  var Buffer: any = (__global.Uint8Array ? Uint8Array : Array);
  var __buffer: ByteArray = new Buffer(LENGTH);
  var __rng: () => number[] = (function () {
    var __rng;

    //Node
    if (typeof __global.require == 'function') {
      try {
        var _rb = __global.require('crypto').randomBytes;
        __rng = _rb ? function () {
          return _rb(LENGTH);
        } : null;
      } catch (e) {
      }
    }

    // Allow for MSIE11 msCrypto
    var __crypto = __global.crypto || __global.msCrypto;
    if (!__rng && __crypto && __crypto.getRandomValues) {
      var _rnds8 = new Buffer(LENGTH);
      __rng = function () {
        __crypto.getRandomValues(_rnds8);
        return _rnds8;
      };
    }

    if (!__rng) {
      var _rnds = new Buffer(LENGTH);
      var __random = Math.random;
      __rng = function () {
        for (var i = 0, r; i < LENGTH; i++) {
          if ((i & 0x03) === 0) r = __random() * 0x100000000;
          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return _rnds;
      };
    }

    return __rng;
  }());
  
  var __numCompare = function (a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
  };
  
  var __array16Fill = function (a: ByteArray, k: number) {
    a[0] = a[1] = a[2] = a[3] = 
    a[4] = a[5] = a[6] = a[7] = 
    a[8] = a[9] = a[10] = a[11] = 
    a[12] = a[13] = a[14] = a[15] = k;  
  };

  var __array16Compare = function (a: ByteArray, b: ByteArray) {
    return (
      __numCompare(a[0], b[0]) ||
      __numCompare(a[1], b[1]) ||
      __numCompare(a[2], b[2]) ||
      __numCompare(a[3], b[3]) ||
      __numCompare(a[4], b[4]) ||
      __numCompare(a[5], b[5]) ||
      __numCompare(a[6], b[6]) ||
      __numCompare(a[7], b[7]) ||
      __numCompare(a[8], b[8]) ||
      __numCompare(a[9], b[9]) ||
      __numCompare(a[10], b[10]) ||
      __numCompare(a[11], b[11]) ||
      __numCompare(a[12], b[12]) ||
      __numCompare(a[13], b[13]) ||
      __numCompare(a[14], b[14]) ||
      __numCompare(a[15], b[15])
    );

  };
  
  var __array16Copy = function (src: ByteArray, dest: ByteArray, offset: number) {
    if (src !== dest) {
      dest[0] = src[0 + offset];
      dest[1] = src[1 + offset];
      dest[2] = src[2 + offset];
      dest[3] = src[3 + offset];
      dest[4] = src[4 + offset];
      dest[5] = src[5 + offset];
      dest[6] = src[6 + offset];
      dest[7] = src[7 + offset];
      dest[8] = src[8 + offset];
      dest[9] = src[9 + offset];
      dest[10] = src[10 + offset];
      dest[11] = src[11 + offset];
      dest[12] = src[12 + offset];
      dest[13] = src[13 + offset];
      dest[14] = src[14 + offset];
      dest[15] = src[15 + offset];
    }
  };
  
  var __array16Stringify = function (a: ByteArray) {
    var f = __uint8ToHex;
    return f[a[0]] + f[a[1]] +
      f[a[2]] + f[a[3]] + '-' +
      f[a[4]] + f[a[5]] + '-' +
      f[a[6]] + f[a[7]] + '-' +
      f[a[8]] + f[a[9]] + '-' +
      f[a[10]] + f[a[11]] +
      f[a[12]] + f[a[13]] +
      f[a[14]] + f[a[15]];
  };
  
  var __uint8ToHex: string[] = [];
  var __hexToUint8: { [k: string]: number } = {};
  for (var i = 0; i < 256; i++) {
    var s = (i + 0x100).toString(16).substr(1);
    __uint8ToHex[i] = s;
    __hexToUint8[s] = i;
  }
  
  export class UUID {
    
    byteLength = LENGTH;
    length = LENGTH;
    [i: number]: number;
    
    static compare(a: UUID, b: UUID): number {
      return __array16Compare(a, b);
    }
    
    static generate(): UUID {
      var id = new UUID();
      var a = __rng();
      a[6] = (a[6] & 0x0f) | 0x40;
      a[8] = (a[8] & 0x3f) | 0x80;
      return new UUID(a);
    }
    
    static parse(s: string): UUID {
      var i = 0;
      s.toLowerCase().replace(/[0-9a-f]{2}/g, <any>function (oct: string) {
        if (i < LENGTH) { // Don't overflow!
          __buffer[i++] = __hexToUint8[oct];
        }
      });

      // Zero out remaining bytes if string was short
      while (i < LENGTH) {
        __buffer[i++] = 0;
      }
      return new UUID(__buffer);
    }
    
    constructor(byteArray?: ByteArray) {
      if (byteArray !== undefined) {
        __array16Copy(byteArray, this, 0);
      } else {
        __array16Fill(this, 0);  
      }
    }
    
    compare(other: UUID): number {
      return UUID.compare(this, other);  
    }
    
    equal(other: any): boolean {
      return (other instanceof UUID) && (UUID.compare(this, other) === 0);  
    }
    
    set(byteArray: ByteArray, offset = 0): void {
      __array16Copy(byteArray, this, offset);
      //self.__str__ = null;
    }

    inspect() {
      return "UUID { " + this.toString() + " }";
    }

    toJSON() {
      return this.toString();
    }

    toString(): string {
      return __array16Stringify(this);
    }

    valueOf() {
      return this.toString();
    }
  }

}

export = uuid;