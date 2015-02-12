import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import hash = require("../../../main/typescript/ts/hash")
import int64 = require("../../../main/typescript/ts/int64")
import Int64 = int64.IInt64;
import SipState = hash.sip.SipState;

var hashSuite = suite("ts/hash.sip.SipState", (self) => {
  var state: SipState;

  self.setUp = () => {
    state = new SipState();
  };
  
  
  function u64(hi: number, lo: number): Int64 {
    return {
      hi: hi >>> 0,
      lo: lo >>> 0
    };
  }
  
  function u64from(buf: number[]): Int64 {
    return u64(
      (buf[7] << 24 | buf[6] << 16 | buf[5] << 8 | buf[4]) >>> 0,
      (buf[3] << 24 | buf[2] << 16 | buf[1] << 8 | buf[0]) >>> 0
    );
  }
  
  function u64bytes(h: Int64): number[] {
    return [
      u8(h.lo >>> 0),
      u8(h.lo >>> 8),
      u8(h.lo >>> 16),
      u8(h.lo >>> 24),
      u8(h.hi >>> 0),
      u8(h.hi >>> 8),
      u8(h.hi >>> 16),
      u8(h.hi >>> 24)
    ];
  }
  
  function u8(n: number): number { 
    return (n & 0xff); 
  }
  
  function u8rand(): number {
    return u8(Math.random() * 0xff);
  }
  
  var DATA: number[][] = [
    [ 0x31, 0x0e, 0x0e, 0xdd, 0x47, 0xdb, 0x6f, 0x72 ],
    [ 0xfd, 0x67, 0xdc, 0x93, 0xc5, 0x39, 0xf8, 0x74 ],
    [ 0x5a, 0x4f, 0xa9, 0xd9, 0x09, 0x80, 0x6c, 0x0d ],
    [ 0x2d, 0x7e, 0xfb, 0xd7, 0x96, 0x66, 0x67, 0x85 ],
    [ 0xb7, 0x87, 0x71, 0x27, 0xe0, 0x94, 0x27, 0xcf ],
    [ 0x8d, 0xa6, 0x99, 0xcd, 0x64, 0x55, 0x76, 0x18 ],
    [ 0xce, 0xe3, 0xfe, 0x58, 0x6e, 0x46, 0xc9, 0xcb ],
    [ 0x37, 0xd1, 0x01, 0x8b, 0xf5, 0x00, 0x02, 0xab ],
    [ 0x62, 0x24, 0x93, 0x9a, 0x79, 0xf5, 0xf5, 0x93 ],
    [ 0xb0, 0xe4, 0xa9, 0x0b, 0xdf, 0x82, 0x00, 0x9e ],
    [ 0xf3, 0xb9, 0xdd, 0x94, 0xc5, 0xbb, 0x5d, 0x7a ],
    [ 0xa7, 0xad, 0x6b, 0x22, 0x46, 0x2f, 0xb3, 0xf4 ],
    [ 0xfb, 0xe5, 0x0e, 0x86, 0xbc, 0x8f, 0x1e, 0x75 ],
    [ 0x90, 0x3d, 0x84, 0xc0, 0x27, 0x56, 0xea, 0x14 ],
    [ 0xee, 0xf2, 0x7a, 0x8e, 0x90, 0xca, 0x23, 0xf7 ],
    [ 0xe5, 0x45, 0xbe, 0x49, 0x61, 0xca, 0x29, 0xa1 ],
    [ 0xdb, 0x9b, 0xc2, 0x57, 0x7f, 0xcc, 0x2a, 0x3f ],
    [ 0x94, 0x47, 0xbe, 0x2c, 0xf5, 0xe9, 0x9a, 0x69 ],
    [ 0x9c, 0xd3, 0x8d, 0x96, 0xf0, 0xb3, 0xc1, 0x4b ],
    [ 0xbd, 0x61, 0x79, 0xa7, 0x1d, 0xc9, 0x6d, 0xbb ],
    [ 0x98, 0xee, 0xa2, 0x1a, 0xf2, 0x5c, 0xd6, 0xbe ],
    [ 0xc7, 0x67, 0x3b, 0x2e, 0xb0, 0xcb, 0xf2, 0xd0 ],
    [ 0x88, 0x3e, 0xa3, 0xe3, 0x95, 0x67, 0x53, 0x93 ],
    [ 0xc8, 0xce, 0x5c, 0xcd, 0x8c, 0x03, 0x0c, 0xa8 ],
    [ 0x94, 0xaf, 0x49, 0xf6, 0xc6, 0x50, 0xad, 0xb8 ],
    [ 0xea, 0xb8, 0x85, 0x8a, 0xde, 0x92, 0xe1, 0xbc ],
    [ 0xf3, 0x15, 0xbb, 0x5b, 0xb8, 0x35, 0xd8, 0x17 ],
    [ 0xad, 0xcf, 0x6b, 0x07, 0x63, 0x61, 0x2e, 0x2f ],
    [ 0xa5, 0xc9, 0x1d, 0xa7, 0xac, 0xaa, 0x4d, 0xde ],
    [ 0x71, 0x65, 0x95, 0x87, 0x66, 0x50, 0xa2, 0xa6 ],
    [ 0x28, 0xef, 0x49, 0x5c, 0x53, 0xa3, 0x87, 0xad ],
    [ 0x42, 0xc3, 0x41, 0xd8, 0xfa, 0x92, 0xd8, 0x32 ],
    [ 0xce, 0x7c, 0xf2, 0x72, 0x2f, 0x51, 0x27, 0x71 ],
    [ 0xe3, 0x78, 0x59, 0xf9, 0x46, 0x23, 0xf3, 0xa7 ],
    [ 0x38, 0x12, 0x05, 0xbb, 0x1a, 0xb0, 0xe0, 0x12 ],
    [ 0xae, 0x97, 0xa1, 0x0f, 0xd4, 0x34, 0xe0, 0x15 ],
    [ 0xb4, 0xa3, 0x15, 0x08, 0xbe, 0xff, 0x4d, 0x31 ],
    [ 0x81, 0x39, 0x62, 0x29, 0xf0, 0x90, 0x79, 0x02 ],
    [ 0x4d, 0x0c, 0xf4, 0x9e, 0xe5, 0xd4, 0xdc, 0xca ],
    [ 0x5c, 0x73, 0x33, 0x6a, 0x76, 0xd8, 0xbf, 0x9a ],
    [ 0xd0, 0xa7, 0x04, 0x53, 0x6b, 0xa9, 0x3e, 0x0e ],
    [ 0x92, 0x59, 0x58, 0xfc, 0xd6, 0x42, 0x0c, 0xad ],
    [ 0xa9, 0x15, 0xc2, 0x9b, 0xc8, 0x06, 0x73, 0x18 ],
    [ 0x95, 0x2b, 0x79, 0xf3, 0xbc, 0x0a, 0xa6, 0xd4 ],
    [ 0xf2, 0x1d, 0xf2, 0xe4, 0x1d, 0x45, 0x35, 0xf9 ],
    [ 0x87, 0x57, 0x75, 0x19, 0x04, 0x8f, 0x53, 0xa9 ],
    [ 0x10, 0xa5, 0x6c, 0xf5, 0xdf, 0xcd, 0x9a, 0xdb ],
    [ 0xeb, 0x75, 0x09, 0x5c, 0xcd, 0x98, 0x6c, 0xd0 ],
    [ 0x51, 0xa9, 0xcb, 0x9e, 0xcb, 0xa3, 0x12, 0xe6 ],
    [ 0x96, 0xaf, 0xad, 0xfc, 0x2c, 0xe6, 0x66, 0xc7 ],
    [ 0x72, 0xfe, 0x52, 0x97, 0x5a, 0x43, 0x64, 0xee ],
    [ 0x5a, 0x16, 0x45, 0xb2, 0x76, 0xd5, 0x92, 0xa1 ],
    [ 0xb2, 0x74, 0xcb, 0x8e, 0xbf, 0x87, 0x87, 0x0a ],
    [ 0x6f, 0x9b, 0xb4, 0x20, 0x3d, 0xe7, 0xb3, 0x81 ],
    [ 0xea, 0xec, 0xb2, 0xa3, 0x0b, 0x22, 0xa8, 0x7f ],
    [ 0x99, 0x24, 0xa4, 0x3c, 0xc1, 0x31, 0x57, 0x24 ],
    [ 0xbd, 0x83, 0x8d, 0x3a, 0xaf, 0xbf, 0x8d, 0xb7 ],
    [ 0x0b, 0x1a, 0x2a, 0x32, 0x65, 0xd5, 0x1a, 0xea ],
    [ 0x13, 0x50, 0x79, 0xa3, 0x23, 0x1c, 0xe6, 0x60 ],
    [ 0x93, 0x2b, 0x28, 0x46, 0xe4, 0xd7, 0x06, 0x66 ],
    [ 0xe1, 0x91, 0x5f, 0x5c, 0xb1, 0xec, 0xa4, 0x6c ],
    [ 0xf3, 0x25, 0x96, 0x5c, 0xa1, 0x6d, 0x62, 0x9f ],
    [ 0x57, 0x5f, 0xf2, 0x8e, 0x60, 0x38, 0x1b, 0xe5 ],
    [ 0x72, 0x45, 0x06, 0xeb, 0x4c, 0x32, 0x8a, 0x95 ]
  ];

  
  function toHexString(u8arr: number[]): string {
    var s = "";
    var padding = 2;
    var pad = '0000';
    for (var i = 0, l = u8arr.length; i < l; i++) {
      var part = u8arr[i].toString(16);
      s += pad.slice(0, padding - part.length) + part;
    }
    return s;
  }

  function resultString(h: Int64): string {
    return toHexString(u64bytes(h));
  }
  
  function hashWithKeys(k0: Int64, k1: Int64, bytes: number[]): Int64 {
    var state = new SipState(k0, k1);
    state.writeBytes(bytes);
    return state.result();
  }
  
  (function check() {
    var vec = [ 0x31, 0x0e, 0x0e, 0xdd, 0x47, 0xdb, 0x6f, 0x72 ];
    
    //u64
    var u64_vec = u64from(vec);
    assert(u64_vec.hi === 0x726fdb47);
    assert(u64_vec.lo === 0xdd0e0e31);
      
    //resultBytes
    var vec_bytes = u64bytes(u64_vec);
    assert(vec_bytes[0] === 0x31);
    assert(vec_bytes[1] === 0x0e);
    assert(vec_bytes[2] === 0x0e);
    assert(vec_bytes[3] === 0xdd);
    assert(vec_bytes[4] === 0x47);
    assert(vec_bytes[5] === 0xdb);
    assert(vec_bytes[6] === 0x6f);
    assert(vec_bytes[7] === 0x72);
    
    //toHexString
    assert(toHexString(vec) === "310e0edd47db6f72");
    
    function assert(b: boolean, message = 'Fatal Error: assertion failed') {
      if (!b) {
        throw new Error(message);
      }
    }
    
  }());

  
  test("reset()", (assert) => {
    var s1 = new SipState();
    var s2 = new SipState();
    var init1 = s1.result();
    var init2 = s2.result();
    
    //before write should be equals
    assert.deepEqual(init1, init2);
    
    //write anything
    s1.writeBytes([u8rand(), u8rand(), u8rand(), u8rand()]);
    s2.writeBytes([u8rand(), u8rand(), u8rand(), u8rand()]);
    assert.notDeepEqual(s1.result(), s2.result());
    
    //should be equals after resetting
    s1.reset();
    s2.reset();
    assert.deepEqual(s1.result(), s2.result());
    assert.deepEqual(s1.result(), init1);
    
    //any reset number should return same result
    s1.reset();
    assert.deepEqual(s1.result(), init1);
  });
       
  test("result()", (assert) => {
    var result = state.result();
    
    //before write should be equals
    assert.deepEqual(state.result(), { hi: 0x1e924b9d, lo: 0x737700d7 });
    assert.deepEqual(state.result(), state.result());
    assert.deepEqual(state.result(), result);
    
  });
  
  test("writeBoolean()", (assert) => {
    function hashBoolean(b: boolean): string {
      return resultString((new SipState()).writeBoolean(b).result());
    }
    assert.strictEqual(hashBoolean(true), "00d86f1e40d57d66");
    assert.strictEqual(hashBoolean(false), "8dc5fb49aa0b5a8b");
  });
  
  test("writeUint8()", (assert) => {
    function hashUint8(n: number): string {
      return resultString((new SipState()).writeUint8(n).result());
    }
    
    //0
    assert.strictEqual(hashUint8(0), "8dc5fb49aa0b5a8b");
    //2
    assert.strictEqual(hashUint8(2), "16b3bc89a20eac39");
    //limit
    assert.strictEqual(hashUint8(0xff), "f290953db34edd20");
    //overflow
    assert.strictEqual(hashUint8(0xff + 1), "8dc5fb49aa0b5a8b");
  });
  
  test("writeUint16()", (assert) => {
    function hashUint16(n: number): string {
      return resultString((new SipState()).writeUint16(n).result());
    }
    
    //0
    assert.strictEqual(hashUint16(0), "d045031723956d3a");
    //1
    assert.strictEqual(hashUint16(1), "3d2142577dbb08e2");
    //limit
    assert.strictEqual(hashUint16(0xffff), "bb1f343ad6b49a70");
    //overflow
    assert.strictEqual(hashUint16(0xffff + 1), "d045031723956d3a");//same as 0
    assert.strictEqual(hashUint16(0xffff + 2), "3d2142577dbb08e2");//same as 1
    
  });
  
  test("writeUint32()", (assert) => {
    function hashUint32(n: number): string {
      return resultString((new SipState()).writeUint32(n).result());
    }
    
    //0
    assert.strictEqual(hashUint32(0), "98962bb2515ef57b");
    //1
    assert.strictEqual(hashUint32(1), "3544405e5a3556be");
    //limit
    assert.strictEqual(hashUint32(0xffffffff), "0616f9e22e79a509");
    //overflow
    assert.strictEqual(hashUint32(0xffffffff + 1), "98962bb2515ef57b");//same as 0
    assert.strictEqual(hashUint32(0xffffffff + 2), "3544405e5a3556be");//same as 1
    
  });
  
  test("writeUint64()", (assert) => {
    //0
    state.writeUint64(u64(0x0, 0x0));
    assert.strictEqual(resultString(state.result()), "6725fe6fbbe849e8");
    
    //limit
    state.reset().writeUint64(u64(0xffffffff, 0xffffffff));
    assert.strictEqual(resultString(state.result()), "5ed1c96a8bc15080");
    
    //overflow
    state.reset().writeUint64(u64(0xffffffff + 1, 0xffffffff));
    assert.strictEqual(resultString(state.result()), "4497e78fac47c0a2");//TODO: check this result!
    
  });
  
  test("writeString()", (assert) => {
    function hashString(s: string): string {
      return resultString((new SipState()).writeString(s).result());
    }
    
    //empty string
    assert.strictEqual(hashString(""), "f290953db34edd20");
    
    //simple
    assert.strictEqual(hashString("foo"), "2c75980448b9c4bd");
    
    //with accents
    assert.strictEqual(hashString("ça et là"), "ceede8d51efb3ff1");
  });
  
  test("writeIHash()", (assert) => {
    var expected = u64(0x4ea02dab, 0x488c25e4);
    var count = 0;
    var obj: hash.IHash =  {
      hash: function (s) {
        count++;
        s.writeBoolean(true)
        s.writeUint8(0xef)
      }
    };
     
    //empty string
    state.writeIHash(obj);
    assert.strictEqual(count, 1);
    assert.strictEqual(resultString(state.result()), "e4258c48ab2da04e");
    
    state.reset().writeIHash(obj);
    assert.strictEqual(count, 2);
    assert.strictEqual(resultString(state.result()), "e4258c48ab2da04e");
    
  });
  
  test("writeBytes()", (assert) => {
    var K0: Int64 = u64(0x07060504, 0x03020100);
    var K1: Int64 = u64(0x0f0e0d0c, 0x0b0a0908);
    var buf = [];
    
    var stateInc = new SipState(K0, K1);
    var stateFull = new SipState(K0, K1);

    for (var t = 0, l = DATA.length; t < l; ++t) {
      var vec = DATA[t];
      var vec_u64 = u64from(vec);
      var out = hashWithKeys(K0, K1, buf);
      //debug!("got {:?}, expected {:?}", out, vec);
      assert.deepEqual(vec_u64, out);
      
      /*if (vec_u64.hi === out.hi && vec_u64.lo === out.lo) {
        console.debug('yeah', vec_u64);
      }*/

      stateFull.reset();
      stateFull.writeBytes(buf);
      var f = resultString(stateFull.result());
      var i = resultString(stateInc.result());
      var v = toHexString(vec);
      //console.debug(t + ": (" + v + ") => inc=" + i + " full=" + f);
      //console.debug("full state {:?}", state_full);
      //console.debug("inc  state {:?}", state_inc);

      assert.strictEqual(f, i);
      assert.strictEqual(f, v);

      buf.push(u8(t));
      stateInc.writeBytes([u8(t)]);
    }
  })
})
  
export = hashSuite