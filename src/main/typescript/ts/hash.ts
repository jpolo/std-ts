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
    
    hash(s: IHashState)
    
  }
  
  /*
  export interface IHasher<T> {
    (s: IHashState, o: T): void
  }*/
  
  export interface IHashState {
    
    write(o: any): void
    writeUndefined(): void
    writeNull(): void
    writeBoolean(b: boolean): void
    writeNumber(n: number): void
    writeIHash(o: IHash): void
    writeFunction(f: Function): void
    writeObject(o: any, delegate?: boolean): void
    writeString(s: string): void
    writeUint8(u: number): void
    writeUint16(u: number): void
    writeUint32(u: number): void
    writeArray(a: any[]): void
    
  }

  export module sip {
    
  
    export class SipState implements IHashState {
  
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
      
      writeUndefined(): void {
        __writeUndefined(this);
      }
      
      writeNull(): void {
        __writeNull(this);
      }
      
      writeBoolean(b: boolean): void {
        if (!__writeEmpty(this, b)) {
          __writeBoolean(this, b);
        }
      }
      
      writeUint8(n: number): void {
        if (!__writeEmpty(this, n)) {
          __writeUint8(this, n);
        }
      }
      
      writeUint16(n: number): void {
        if (!__writeEmpty(this, n)) {
          __writeUint16(this, n);
        }
      }
      
      writeUint32(n: number): void {
        if (!__writeEmpty(this, n)) {
          __writeUint32(this, n);
        }
      }
      
      writeNumber(n: number): void {
        if (!__writeEmpty(this, n)) {
          __writeFloat64(this, n);
        }
      }
      
      writeString(s: string): void {
        if (!__writeEmpty(this, s)) {
          __writeString(this, s);
        }
      }
      
      writeIHash(o: IHash): void {
        if (!__writeEmpty(this, o)) {
          __writeIHash(this, o);
        }
      }
      
      writeObject(o: any, delegate = true): void {
        if (!__writeEmpty(this, o)) {
          __writeObject(this, o, delegate);
        }
      }
      
      writeFunction(o: any, delegate = true): void {
        if (!__writeEmpty(this, o)) {
          __writeFunction(this, o);
        }
      }
      
      writeArray(a: any[]): void {
        if (!__writeEmpty(this, a)) {
          __writeArray(this, a);
        }
      }
      
      write(o: any): void {
        __writeAny(this, o);
      }
      
      writeBytes(b: Uint8Array): void
      writeBytes(b: number[]): void
      writeBytes(b: any): void {
        __writeBytes(this, b, b.length);
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
    
    function __readFloat64(n: number) {
      __dataView.setFloat64(0, n, true);
      return __byteArray;
    }
    
    function __writeAny(state: SipState, o: any) {
      switch (__stringTag(o)) {
        case 'Null': __writeNull(this); break;
        case 'Undefined': __writeUndefined(this); break;
        case 'Boolean': __writeBoolean(this, o); break;
        case 'String': __writeString(this, o); break;
        case 'Number': __writeFloat64(this, o); break;
        case 'Function': __writeFunction(this, o); break;
        
        //useful class:
        case 'Array': __writeArray(this, o); break;
        case 'Date': __writeFloat64(this, (<Date>o).getTime()); break;
        case 'RegExp': __writeString(this, __str(o)); break;
        default: __writeObject(this, o, true);
      }
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
    
    function __writeIHash(state: SipState, o: IHash) {
      o.hash(state);
    }
    
    function __writeFloat64(state: SipState, n: number) {
      __writeBytes(state, __readFloat64(n), 8);
    }
    
    function __writeFunction(state: SipState, f: Function) {
      __writeUint32(this, id.id(f));
    }
    
    function __writeObject(state: SipState, o: any, delegate: boolean = true) {
      if (delegate && ('hash' in o)) {
        __writeIHash(state, <IHash> o);
      } else {
        __writeUint32(state, id.id(o));
      }
    }
    
    function __writeArray(state: SipState, a: any[]) {
      for (var i = 0, l = a.length; i < l; i++) {
        __writeAny(state, a[i]);
      }
    }

    function __writeString(state: SipState, s: string) {
      var byteLength = 8;
      var charLength = byteLength / 2;
      var cycles = s.length % charLength;
      var i = 0;
      var n: number;

      //unrolled
      while (cycles--) {
        n = s.charCodeAt(i++);
        __byteArray[0] = (n) & 0xff;
        __byteArray[1] = (n >> 8) & 0xff;
        __writeBytes(state, __byteArray, 2);
      }
      
      cycles = s.length / charLength >>> 0;
      while (cycles--) {
        n = s.charCodeAt(i++);
        __byteArray[0] = (n) & 0xff;
        __byteArray[1] = (n >> 8) & 0xff;
        
        n = s.charCodeAt(i++);
        __byteArray[2] = (n) & 0xff;
        __byteArray[3] = (n >> 8) & 0xff;
        
        n = s.charCodeAt(i++);
        __byteArray[4] = (n) & 0xff;
        __byteArray[5] = (n >> 8) & 0xff;
        
        n = s.charCodeAt(i++);
        __byteArray[6] = (n) & 0xff;
        __byteArray[7] = (n >> 8) & 0xff;
        __writeBytes(state, __byteArray, byteLength);
      }
      
      /*for (var i = 0, l = s.length; i < l; ++i) {
        __writeUint16(state, s.charCodeAt(i));
      }*/
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
  function __str(o: any) { return String(o); }
  function __stringTag(o: any) {
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
        default: /*object*/ s = o.constructor.name || __ostring.call(o).slice(8, -1);
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