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
  var now = new Date();
  
  test(".isIClone()", (assert) => {
    assert.strictEqual(clone.isIClone(undefined), false);
    assert.strictEqual(clone.isIClone(null), false);
    assert.strictEqual(clone.isIClone({ clone: () => { } }), true);
  })
  
  test(".clone()", (assert) => {
    assert.strictEqual(clone.clone(undefined), undefined);
    assert.strictEqual(clone.clone(null), null);
    assert.strictEqual(clone.clone(NaN), NaN);
    assert.strictEqual(clone.clone(1), 1);
    assert.strictEqual(clone.clone("foo"), "foo");
    
    var dateCloned = clone.clone(now);
    assert.strictEqual(+dateCloned, +now);
    assert.notStrictEqual(dateCloned, now);
    
    var iclone = new TestIClone();
    var icloned = clone.clone(iclone);
    assert.strictEqual(icloned.foo, true);
    
    var object = new TestObject();
    var objectCloned = clone.clone(object);
    assert.instanceOf(objectCloned, TestObject);
    assert.strictEqual(objectCloned.bool, true);
    assert.strictEqual(objectCloned.str, "foo");
    assert.strictEqual(objectCloned.arr, object.arr)
  })
  
})

var exportSuite = cloneSuite;
export = exportSuite;