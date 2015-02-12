import id = require("ts/id")
import int64 = require("ts/int64")
import Int64 = int64.IInt64

//assertion
if (!ArrayBuffer || !Uint8Array || !DataView) {
  throw new Error("Typed Arrays is required");
}

module hash {

  export function hash(o: any): Int64 {
    var state = new sip.SipState();
    state.write(o);
    return state.result();
  }
  
  export interface IHash {
    
    hash(s: sip.SipState)
    
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
      
      writeUndefined(): SipState {
        __writeUint8(this, 0);
        return this;
      }
      
      writeNull(): SipState {
        __writeUint8(this, 0);
        return this;
      }
      
      writeBoolean(b: boolean): SipState {
        if (!__writeEmpty(this, b)) {
          __writeUint8(this, b ? 1 : 0);
        }
        return this;
      }
      
      writeUint8(n: number): SipState {
        if (!__writeEmpty(this, n)) {
          __writeUint8(this, n);
        }
        return this;
      }
      
      writeUint16(n: number): SipState {
        if (!__writeEmpty(this, n)) {
          __writeUint16(this, n);
        }
        return this;
      }
      
      writeUint32(n: number): SipState {
        if (!__writeEmpty(this, n)) {
          __writeUint32(this, n);
        }
        return this;
      }
      
      writeUint64(n: Int64): SipState {
        if (!__writeEmpty(this, n)) {
          __writeUint64(this, n);
        }
        return this;
      }
      
      writeNumber(n: number): SipState {
        if (!__writeEmpty(this, n)) {
          __writeFloat64(this, n);
        }
        return this;
      }
      
      writeString(s: string): SipState {
        if (!__writeEmpty(this, s)) {
          __writeString(this, s);
        }
        return this;
      }
      
      writeIHash(o: IHash): SipState {
        if (!__writeEmpty(this, o)) {
          __writeIHash(this, o);
        }
        return this;
      }
      
      writeObject(o: any, delegate = true): SipState {
        if (!__writeEmpty(this, o)) {
          __writeObject(this, o, delegate);
        }
        return this;
      }
      
      write(o: any): SipState {
        switch (__stringTag(o)) {
          case 'Null': __writeNull(this); break;
          case 'Undefined': __writeUndefined(this); break;
          case 'Boolean': __writeBoolean(this, o); break;
          case 'String': __writeString(this, o); break;
          case 'Number': __writeFloat64(this, o); break;
          default:
            __writeObject(this, o, true);
        }
        return this;
      }
      
      writeBytes(b: Uint8Array): SipState
      writeBytes(b: number[]): SipState
      writeBytes(b: any): SipState {
        __writeBytes(this, b, b.length);
        return this;
      }
    }
    

    var __byteBuffer = new ArrayBuffer(8);
    var __byteArray = new Uint8Array(__byteBuffer);
    var __dataView = new DataView(__byteBuffer);
    
    function __readUint8(n: number) {
      __byteArray[0] = n & 0xff;
      return __byteArray;
    }
    
    function __readUint16(n: number) {
      //little endian
      __byteArray[0] = (n /*>>> 0*/) & 0xff;
      __byteArray[1] = (n >> 8) & 0xff;
      return __byteArray;
    }
    
    function __readUint32(n: number) {
      //little endian
      __byteArray[0] = (n /*>> 0*/) & 0xff;
      __byteArray[1] = (n >> 8) & 0xff;
      __byteArray[2] = (n >> 16) & 0xff;
      __byteArray[3] = (n >> 24) & 0xff;
      return __byteArray;
    }
    
    function __readUint64(n: Int64) {
      var lo = n.lo;
      var hi = n.hi;
      __byteArray[0] = (hi /*>> 0*/) & 0xff;
      __byteArray[1] = (hi >> 8) & 0xff;
      __byteArray[2] = (hi >> 16) & 0xff;
      __byteArray[3] = (hi >> 24) & 0xff;
      
      __byteArray[4] = (lo /*>> 0*/) & 0xff;
      __byteArray[5] = (lo >> 8) & 0xff;
      __byteArray[6] = (lo >> 16) & 0xff;
      __byteArray[7] = (lo >> 24) & 0xff;
      return __byteArray;
    }
    
    function __readFloat64(n: number) {
      __dataView.setFloat64(0, n, true);
      return __byteArray;
    }
    
    function __writeEmpty(state: SipState, o: any): boolean {
      var returnValue = true;
      if (o === undefined) {
        __writeUndefined(state);
      } else if (o === null) {
        __writeNull(state);
      } else {
        returnValue = false;
      }
      return returnValue;
    }
    
    function __writeUndefined(state: SipState) {
      __writeUint8(state, 0);
    }
    
    function __writeNull(state: SipState) {
      __writeUint8(state, 0);
    }
    
    function __writeBoolean(state: SipState, b: boolean) {
      __writeUint8(state, b ? 1 : 0);
    }
    
    function __writeUint8(state: SipState, n: number) {
      __writeBytes(state, __readUint8(n), 1);
    }
    
    function __writeUint16(state: SipState, n: number) {
      __writeBytes(state, __readUint16(n), 2);
    }
    
    function __writeUint32(state: SipState, n: number) {
      __writeBytes(state, __readUint32(n), 4);
    }
    
    function __writeUint64(state: SipState, n: Int64) {
      __writeBytes(state, __readUint64(n), 8);
    }
    
    function __writeIHash(state: SipState, o: IHash) {
      o.hash(state);
    }
    
    function __writeFloat64(state: SipState, n: number) {
      __writeBytes(state, __readFloat64(n), 8);
    }
    
    function __writeObject(state: SipState, o: any, delegate: boolean) {
      if (delegate && ('hash' in o)) {
        __writeIHash(this, <IHash> o);
      } else {
        __writeUint32(this, id.id(o));
      }
    }
    
    function __writeString(state: SipState, s: string) {
      for (var i = 0, l = s.length; i < l; ++i) {
        __writeUint16(state, s.charCodeAt(i));
      }
      __writeUint8(state, 0xff);
    }
    
    function __writeBytes(state: SipState, bytes: any, length: number) {
      var s = <any>state;//private access
      var v0 = s._v0;
      var v1 = s._v1;
      var v2 = s._v2;
      var v3 = s._v3;
      //var length = b.length;
      s._length += length;
      
      var needed = 0;
      if (s._ntail != 0) {
        needed = 8 - s._ntail;
        
        var m = __u64();
        if (length < needed) {
          __u64read_le(bytes, 0, length, m);
          __u64lshift(m, 8 * s._ntail, m);
          __u64or(s._tail, m, s._tail);
          //this._tail |= __u8to64_le!(b, 0, length) << 8 * this._ntail;
          s._ntail += length;
          return;
        }

        __u64read_le(bytes, 0, needed, m);
        __u64lshift(m, 8 * s._ntail, m);
        __u64or(s._tail, m, m);
       
        __u64xor(v3, m, v3);
        __compress(v0, v1, v2, v3);
        __compress(v0, v1, v2, v3);
        __u64xor(v0, m, v0);
        s._ntail = 0;
      }
      
      // Buffered tail is now flushed, process new input.
      var len = length - needed;
      var end = len & (~0x7);
      var left = len & 0x7;

      var i = needed;
      var mi = __u64();
      while (i < end) {
        __u64read_le(bytes, i, 8, mi);

        __u64xor(v3, mi, v3);
        __compress(v0, v1, v2, v3);
        __compress(v0, v1, v2, v3);
        __u64xor(v0, mi, v0);

        i += 8;
      }
      
      __u64read_le(bytes, i, left, s._tail);
      s._ntail = left;
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
    
    var RESET_I0 = __u64(0x736f6d65, 0x70736575);
    var RESET_I1 = __u64(0x646f7261, 0x6e646f6d);
    var RESET_I2 = __u64(0x6c796765, 0x6e657261);
    var RESET_I3 = __u64(0x74656462, 0x79746573);
  
    var RESULT_K1 = __u64(0, 0xff);
  }
  
  //util
  var __ostring = Object.prototype.toString;
  function __keys(o: any) { return Object.keys(o); }
  function __stringTag(o: any): string {
    var s = '';
    if (o === null) {
      s = 'Null';
    } else {
      switch(typeof o) {
        case 'boolean': s = 'Boolean'; break;
        case 'function': s = 'Function'; break;
        case 'number': s = 'Number'; break;
        case 'string': s = 'String'; break;
        case 'undefined': s = 'Undefined'; break;
        default: /*object*/ s = __ostring.call(o).slice(8, -1);
      }
    }
    return s;
  }
  function __u64(hi: number = 0, lo: number = 0): Int64 { return { hi: hi >>> 0, lo: lo >>> 0 }; }
  function __u64copy(n: Int64): Int64 { return { hi: n.hi, lo: n.lo }; }
  function __u64add(a: Int64, b: Int64, r: Int64) { var rlo = a.lo + b.lo; r.hi = a.hi + b.hi + (rlo / 2 >>> 31) >>> 0; r.lo = rlo >>> 0; }
  function __u64or(a: Int64, b: Int64, out: Int64) { out.hi = (a.hi | b.hi) >>> 0; out.lo = (a.lo | b.lo) >>> 0; }
  function __u64xor(a: Int64, b: Int64, out: Int64) { out.hi = (a.hi ^ b.hi) >>> 0; out.lo = (a.lo ^ b.lo) >>> 0; }
  function __u64rotl32(a: Int64) { var alo = a.lo; a.lo = a.hi; a.hi = alo; }
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
  
  function __u64rotl(a: Int64, n: number) {
    var ahi = a.hi;
    var alo = a.lo;
    var nrest = 32 - n;
    a.hi = (ahi << n | alo >>> nrest) >>> 0;
    a.lo = (alo << n | ahi >>> nrest) >>> 0;
  }
  
  function __u64read_le(buf: number[], i: number, len: number, out: Int64) {
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
  

 
}
export = hash