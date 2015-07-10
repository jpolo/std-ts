import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
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

export default suite("ts/clone", (self) => {
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
  
  test(".cloneBoolean()", (assert) => {
    assert.strictEqual(clone.cloneBoolean(undefined), undefined);
    assert.strictEqual(clone.cloneBoolean(null), null);
    assert.strictEqual(clone.cloneBoolean(true), true);
    assert.strictEqual(clone.cloneBoolean(false), false);
  })
  
  test(".cloneString()", (assert) => {
    assert.strictEqual(clone.cloneString(undefined), undefined);
    assert.strictEqual(clone.cloneString(null), null);
    assert.strictEqual(clone.cloneString("foo"), "foo");
  })
  
  test(".cloneNumber()", (assert) => {
    assert.strictEqual(clone.cloneNumber(undefined), undefined);
    assert.strictEqual(clone.cloneNumber(null), null);
    assert.strictEqual(clone.cloneNumber(123), 123);
  })
  
})