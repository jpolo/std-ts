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
      dest[0] = src[0 + offset] & 0xff;
      dest[1] = src[1 + offset] & 0xff;
      dest[2] = src[2 + offset] & 0xff;
      dest[3] = src[3 + offset] & 0xff;
      dest[4] = src[4 + offset] & 0xff;
      dest[5] = src[5 + offset] & 0xff;
      dest[6] = src[6 + offset] & 0xff;
      dest[7] = src[7 + offset] & 0xff;
      dest[8] = src[8 + offset] & 0xff;
      dest[9] = src[9 + offset] & 0xff;
      dest[10] = src[10 + offset] & 0xff;
      dest[11] = src[11 + offset] & 0xff;
      dest[12] = src[12 + offset] & 0xff;
      dest[13] = src[13 + offset] & 0xff;
      dest[14] = src[14 + offset] & 0xff;
      dest[15] = src[15 + offset] & 0xff;
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
  
  function isUUID(o: any): boolean {
    return false;
  }
  
  function getRandomBytes(): number[] {
    var byteArray = new Array(LENGTH);
    setRandomBytes(byteArray);
    return byteArray;
  }
  
  function setRandomBytes(a: ByteArray): void {
    var randomBytes = __rng();
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;
    //a.length = LENGTH;
    __array16Copy(randomBytes, a, 0);
  }
  
  function parse(s: string): number[] {
    var byteArray = new Array(LENGTH);
    var i = 0;
    s.toLowerCase().replace(/[0-9a-f]{2}/g, <any>function (oct: string) {
      if (i < LENGTH) { // Don't overflow!
        byteArray[i] = __hexToUint8[oct] & 0xff;
        i += 1;
      }
    });

    // Zero out remaining bytes if string was short
    while (i < LENGTH) {
      byteArray[i] = 0;
      i += 1;
    }
    return byteArray;
  }
  
  function stringify(a: ByteArray): string {
    return __array16Stringify(a);
  }
  
  export class UUID {
    BYTES_PER_ELEMENT = 1;
    
    byteLength = LENGTH;
    length = LENGTH;
    [i: number]: number;
    
    static cast(o: any): UUID {
      var id: UUID = null;
      if (o) {
        if (o instanceof UUID) {
          id = o;
        } else if (typeof o === "string") {
          id = UUID.parse(o);
        } else {
          
        }
      }
      return id;
    }
    
    static compare(a: UUID, b: UUID): number {
      return __array16Compare(a, b);
    }
    
    static generate(): UUID {
      var a = __rng();
      a[6] = (a[6] & 0x0f) | 0x40;
      a[8] = (a[8] & 0x3f) | 0x80;
      return new UUID(a);
    }
    
    static parse(s: string): UUID {
      return new UUID(parse(s));
    }
    
    constructor(byteArray?: ByteArray) {
      if (byteArray !== undefined) {
        __array16Copy(byteArray, this, 0);
      } else {
        __array16Fill(this, 0);  
      }
    }
    
    clone(): UUID {
      return new UUID(this);  
    }
    
    compare(other: UUID): number {
      return UUID.compare(this, other);  
    }
    
    equal(other: any): boolean {
      return other && (other instanceof UUID) && (UUID.compare(this, other) === 0);  
    }
    
    get(index: number): number {
      return this[index];
    }
    
    set(byteArray: ByteArray, offset = 0): void {
      __array16Copy(byteArray, this, offset);
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