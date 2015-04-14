import unit = require("../../../main/typescript/ts/unit")
import test = unit.test
import clone = require("../../../main/typescript/ts/clone")

class TestObject {
  bool = true
  str = "foo"
  arr = []
}

class TestIClone implements clone.IClone {
  foo = false
  
  clone() {
    return {
      foo: true  
    }
  }
}

var cloneSuite = unit.suite("ts/clone", (self) => {
  
  test(".clone()", (assert) => {
    assert.strictEqual(clone.clone(undefined), undefined);
    assert.strictEqual(clone.clone(null), null);
    assert.strictEqual(clone.clone(NaN), NaN);
    assert.strictEqual(clone.clone(1), 1);
    assert.strictEqual(clone.clone("foo"), "foo");
    var iclone = new TestIClone()
    var icloned = clone.clone(iclone)
    assert.strictEqual(icloned.foo, true);
    
    var object = new TestObject()
    var objectcloned = clone.clone(object)
    assert.instanceOf(objectcloned, TestObject)
    assert.strictEqual(objectcloned.bool, true)
    assert.strictEqual(objectcloned.str, "foo")
    assert.strictEqual(objectcloned.arr, object.arr)
    
  })
  
})

var exportSuite = cloneSuite;
export = exportSuite;