import reflect = require("ts/reflect")

module hash {
  export interface Int64 { lo: number; hi: number; }

  var __keys = Object.keys;
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
        s.writeInt8(0);
        break;
      case 'Boolean':
        s.writeBoolean(o);
        break;
      case 'String':
        s.writeString(o);
        break;
      case 'Number':
        break;
        
      default:
        if ('hash' in o) {
          o.hash(s);
        } else {
          // hash default object
          var keys = __keys(o).sort();
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
    var __buffer1 = new Uint8Array(1);
    var __buffer2 = new Uint8Array(2);
    var __buffer4 = new Uint8Array(4);
  
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
  
        //this._length = 0;
        this._v0 = __u64();
        this._v1 = __u64();
        this._v2 = __u64();
        this._v3 = __u64();
        this._tail = __u64();
        //this._ntail = 0;
  
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
        var v0 = __u64copy(this._v0);
        var v1 = __u64copy(this._v1);
        var v2 = __u64copy(this._v2);
        var v3 = __u64copy(this._v3);
        var tail = this._tail;
        var b: Int64 = __u64(((this._length & 0xff) << 24) | tail.hi, 0 | tail.lo);
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
  
        r = __u64copy(v0);
        __u64xor(r, v1, r);
        __u64xor(r, v2, r);
        __u64xor(r, v3, r);
        return r;
      }
      
      writeBoolean(b: boolean): SipState {
        this.writeInt8(b ? 1 : 0);
        return this;
      }
      
      writeInt8(n: number): SipState {
        __buffer1[0] = n & 0xff;
        this.writeBytes(__buffer1);
        return this;
      }
      
      writeInt16(n: number): SipState {
        //little endian
        __buffer2[0] = (n /*>>> 0*/) & 0xff;
        __buffer2[1] = (n >>> 8) & 0xff;
        this.writeBytes(__buffer2);
        return this;
      }
      
      writeInt32(n: number): SipState {
        //little endian
        __buffer4[0] = (n /*>>> 0*/) & 0xff;
        __buffer4[1] = (n >>> 8) & 0xff;
        __buffer4[2] = (n >>> 16) & 0xff;
        __buffer4[3] = (n >>> 24) & 0xff;
        this.writeBytes(__buffer4);
        return this;
      }
      
      writeInt64(n: Int64): SipState {
        this.writeInt32(n.lo);
        this.writeInt32(n.hi);
        return this;
      }
      
      writeNumber(n: number) {
      
      }
      
      writeString(s: string): SipState {
        for (var i = 0, l = s.length; i < l; ++i) {
          this.writeInt16(s.charCodeAt(i));
        }
        this.writeInt8(0xff);
        return this;
      }
      
      writeBytes(b: Uint8Array): SipState
      writeBytes(b: number[]): SipState
      writeBytes(b: any): SipState {        
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
            return this;
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
        return this;
      }  
    }
    
    function __u64(hi: number = 0, lo: number = 0): Int64 {
      return { hi: hi >>> 0, lo: lo >>> 0 };
    }
    
    function __u64copy(n: Int64): Int64 {
      return { hi: n.hi, lo: n.lo };
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
      out.hi = (a.hi | b.hi) >>> 0;
      out.lo = (a.lo | b.lo) >>> 0;
    }
    
    function __u64xor(a: Int64, b: Int64, out: Int64) {
      out.hi = (a.hi ^ b.hi) >>> 0;
      out.lo = (a.lo ^ b.lo) >>> 0;
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
      //little endian
      if (len === 8) {
        out.hi = (
          (buf[7 + i] & 0xff) << 24 |
          (buf[6 + i] & 0xff) << 16 | 
          (buf[5 + i] & 0xff) << 8 | 
          (buf[4 + i] & 0xff)
        ) >>> 0;
        out.lo = (
          (buf[3 + i] & 0xff) << 24 | 
          (buf[2 + i] & 0xff) << 16 | 
          (buf[1 + i] & 0xff) << 8 | 
          (buf[0 + i] & 0xff)
        ) >>> 0;
      } else {
        var t = 0;
        out.lo = 0;
        out.hi = 0;
        while (t < len) {
          if (t < 4) {
            out.lo |= (buf[t + i] & 0xff) << (t * 8);
          } else {
            out.hi |= (buf[t + i] & 0xff) << (t * 8);
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