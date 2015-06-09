import qunit = require("../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import uuid = require("../../../main/typescript/ts/uuid");
import UUID = uuid.UUID;

var uuidSuite = suite("ts/uuid", (self) => {
  

})

var UUIDSuite = suite("ts/uuid.UUID", (self) => {
  var ZERO = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  var DATA = [ 0xb3, 0x72, 0xe0, 0xa1, 0xb3, 0x91, 0x46, 0x10, 0x8e, 0x1a, 0xff, 0x7d, 0x51, 0xdb, 0x4e, 0x80 ];
  
  test(".generate()", (assert) => {
    
  })
  
  
  test("#constructor()", (assert) => {
    var id = new UUID();
    
    //zero
    assert.strictEqual(id.length, 16);
    for (var i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], ZERO[i]);
    }
    
    //with array
    id = new UUID(DATA);
    for (var i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], DATA[i]);
    }

  })
  
  test("#set()", (assert) => {
    var id = new UUID();
    
    //zero
    assert.strictEqual(id.length, 16);
    for (var i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], 0);
    }
    
    //with array
    id.set(DATA);
    for (var i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], DATA[i]);
    }
    
    //set again to zero
    id.set(ZERO);
    for (var i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], ZERO[i]);
    }

  })
  
  test("#toString()", (assert) => {
    var id = new UUID();
    assert.strictEqual(id.toString(), "00000000-0000-0000-0000-000000000000");
    
    id = new UUID(DATA);
    assert.strictEqual(id.toString(), "b372e0a1-b391-4610-8e1a-ff7d51db4e80");
  })
})

var exportSuite = uuidSuite.concat(UUIDSuite);
export = exportSuite;