import reflect = require("ts/reflect")

module hash {
  export interface Int64 { lo: number; hi: number; }

  var __stringTag = reflect.stringTag;
  
  export function hash(o: any): Int64 {
    var state = new sip.SipState();
    _hash(o, state);
    return state.result();
  }
  
  function _hash(o: any, s: sip.SipState): sip.SipState {
    switch (__stringTag(o)) {
      case 'Null':
      case 'Undefined':
        s.writeBytes([0]);
        break;
      case 'Boolean':
        s.writeBytes([o ? 1 : 0]);
        break;
      case 'String':
        for (var i = 0, l = o.length; i < l; ++i) {
          o.charCodeAt(i)  
        }
        //s.writeBytes(bytes);
        break;
      case 'Number':
        break;
        
      default:
        if ('hash' in o) {
          o.hash(s);
        } else {
          // hash default object
          var keys = Object.keys(o).sort();
          var keyc = keys.length;
          for (var i = 0; i < keyc; ++i) {
            var key = keys[i];
            o.writeString(key);
            _hash(o[key], s)
          }
        }
    }
    return s
  }
  
  
  export interface IHash {
    
    hash(s: sip.SipState): Int64
    
  }

  export module sip {

  
    export class SipState {
  
      private _k0: Int64;
      private _k1: Int64;
      private _length: number;
      private _v0: Int64;
      private _v1: Int64;
      private _v2: Int64;
      private _v3: Int64;
      private _tail: Int64;
      private _ntail: number;
  
      constructor(k0?: Int64,
                  k1?: Int64) {
        this._k0 = k0 ? __u64(k0.hi, k0.lo) : __u64();
        this._k1 = k1 ? __u64(k1.hi, k1.lo) : __u64();
  
        this._length = 0;
        this._v0 = __u64();
        this._v1 = __u64();
        this._v2 = __u64();
        this._v3 = __u64();
        this._tail = __u64();
        this._ntail = 0;
  
        this.reset();
      }
      
      clone() {
        return new SipState(
            this._k0,
            this._k1
        )  
      }
  
      reset(): SipState {
        var k0 = this._k0;
        var k1 = this._k1;
        var tail = this._tail;
        this._length = 0;
        __u64xor(k0, RESET_I0, this._v0);
        __u64xor(k1, RESET_I1, this._v1);
        __u64xor(k0, RESET_I2, this._v2);
        __u64xor(k1, RESET_I3, this._v3);
        this._ntail = 0;
        tail.hi = 0;
        tail.lo = 0;
        return this;
      }
      
      result(): Int64 {
        var r: Int64;//return value
        var v0 = this._v0;
        var v1 = this._v1;
        var v2 = this._v2;
        var v3 = this._v3;
        var tail = this._tail;
        var b: Int64 = __u64((this._length & 0xff << 24) | tail.hi, 0 | tail.lo);
        //let b: u64 = ((self.length as u64 & 0xff) << 56) | self.tail;
  
        __u64xor(v3, b, v3);
        __compress(v0, v1, v2, v3);
        __compress(v0, v1, v2, v3);
        __u64xor(v0, b, v0);
  
        //v2 ^= 0xff;
        __u64xor(v2, RESULT_K1, v2);
        __compress(v0, v1, v2, v3);
        __compress(v0, v1, v2, v3);
        __compress(v0, v1, v2, v3);
        __compress(v0, v1, v2, v3);
  
        r = __u64(v0.hi, v0.lo);
        __u64xor(r, v1, r);
        __u64xor(r, v2, r);
        __u64xor(r, v3, r);
        return r;
      }
      
      writeBoolean(b: boolean) {
        this.writeBytes([ b ? 1 : 0 ]);
      }
      
      writeNumber(n: number) {
      
      }
      
      writeString(s: string) {
      
      }
      
      writeBytes(b: number[]) {        
        var v0 = this._v0;
        var v1 = this._v1;
        var v2 = this._v2;
        var v3 = this._v3;
        var length = b.length;
        this._length += length;
        
        
        var needed = 0;
        if (this._ntail != 0) {
          needed = 8 - this._ntail;
          
          var m = __u64();
          if (length < needed) {
            __u8to64_le(b, 0, length, m);
            __u64lshift(m, 8 * this._ntail, m);
            __u64or(this._tail, m, this._tail);
            //this._tail |= __u8to64_le!(b, 0, length) << 8 * this._ntail;
            this._ntail += length;
            return
          }
  
          __u8to64_le(b, 0, needed, m)
          __u64lshift(m, 8 * this._ntail, m);
          __u64or(this._tail, m, m);
         
          __u64xor(v3, m, v3);
          __compress(v0, v1, v2, v3);
          __compress(v0, v1, v2, v3);
          __u64xor(v0, m, v0);
          this._ntail = 0;
        }
        
        // Buffered tail is now flushed, process new input.
        var len = length - needed;
        var end = len & (~0x7);
        var left = len & 0x7;
  
        var i = needed;
        var mi = __u64();
        while (i < end) {
          __u8to64_le(b, i, 8, mi);
  
          __u64xor(v3, mi, v3);
          __compress(v0, v1, v2, v3);
          __compress(v0, v1, v2, v3);
          __u64xor(v0, mi, v0);
  
          i += 8;
        }
        
        __u8to64_le(b, i, left, this._tail);
        this._ntail = left;
      }
    }
    
    function __u8(n: number) {
      return (n & 0xff);
    }
    
    function __u32(n: number) {
      return n >>> 0;  
    }
    
    function __u64(hi: number = 0, lo: number = 0): Int64 {
      return { hi: hi >>> 0, lo: lo >>> 0 };
    }
    
    function __u64add(a: Int64, b: Int64, r: Int64) {
      var rlo = a.lo + b.lo;
      r.hi = a.hi + b.hi + (rlo / 2 >>> 31) >>> 0;
      r.lo = rlo >>> 0;
    }
    
    function __u64lshift(a: Int64, offset: number, out: Int64) {
      var ahi = a.hi, alo = a.lo;
      var o = offset & 63;
      if (o == 0) {
        //do nothing
      } else if (o < 32) {
        out.hi = (ahi << offset) | (alo >>> (32 - o)|0)
        out.lo = alo << offset
      } else {
        out.hi = alo << (offset - 32) |0
        out.lo = 0; 
      }
    }
    
    function __u64or(a: Int64, b: Int64, out: Int64) {
      out.hi = __u32(a.hi | b.hi);
      out.lo = __u32(a.lo | b.lo);
    }
    
    function __u64xor(a: Int64, b: Int64, r: Int64) {
      r.hi = __u32(a.hi ^ b.hi);
      r.lo = __u32(a.lo ^ b.lo);
    }
    
    function __u64rotl(a: Int64, n: number) {
      var ahi = a.hi;
      var alo = a.lo;
      var nrest = 32 - n;
      a.hi = (ahi << n | alo >>> nrest) >>> 0;
      a.lo = (alo << n | ahi >>> nrest) >>> 0;
    }
  
    function __u64rotl32(a: Int64) {
      var alo = a.lo;
      a.lo = a.hi;
      a.hi = alo;
    }
  
    function __compress(v0: Int64, v1: Int64, v2: Int64, v3: Int64) {
      __u64add(v0, v1, v0);
      __u64add(v2, v3, v2);
      __u64rotl(v1, 13);
      __u64rotl(v3, 16);
      __u64xor(v1, v0, v1);
      __u64xor(v3, v2, v3);
      __u64rotl32(v0);
      __u64add(v2, v1, v2);
      __u64add(v0, v3, v0);
      __u64rotl(v1, 17);
      __u64rotl(v3, 21);
      __u64xor(v1, v2, v1);
      __u64xor(v3, v0, v3);
      __u64rotl32(v2);
    }
    
    function __u8to64_le(buf: number[], i: number, len: number, out: Int64) {
      if (len === 8) {
        out.hi = __u32(
          __u8(buf[7 + i]) << 24 |
          __u8(buf[6 + i]) << 16 | 
          __u8(buf[5 + i]) << 8 | 
          __u8(buf[4 + i])
        );
        out.lo = __u32(
          __u8(buf[3 + i]) << 24 | 
          __u8(buf[2 + i]) << 16 | 
          __u8(buf[1 + i]) << 8 | 
          __u8(buf[0 + i])
        );
      } else {
        var t = 0;
        while (t < len) {
          if (t < 4) {
            out.lo |= __u8(buf[t + i]) << t * 8;
          } else {
            out.hi |= __u8(buf[t + i]) << t * 8;
          }
          t += 1;
        }
      }
    }
      
  
    var RESET_I0 = __u64(0x736f6d65, 0x70736575);
    var RESET_I1 = __u64(0x646f7261, 0x6e646f6d);
    var RESET_I2 = __u64(0x6c796765, 0x6e657261);
    var RESET_I3 = __u64(0x74656462, 0x79746573);
  
    var RESULT_K1 = __u64(0, 0xff);
  }

  
  
 
}
export = hash