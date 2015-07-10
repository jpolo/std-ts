import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import { IClone, clone, isIClone, cloneNumber, cloneBoolean, cloneString } from "../../../main/typescript/ts/clone"

class TestObject {
  bool = true
  str = "foo"
  arr = []
}

class TestIClone implements IClone {
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
    assert.strictEqual(isIClone(undefined), false);
    assert.strictEqual(isIClone(null), false);
    assert.strictEqual(isIClone({ clone: () => { } }), true);
  })
  
  test(".clone()", (assert) => {
    assert.strictEqual(clone(undefined), undefined);
    assert.strictEqual(clone(null), null);
    assert.strictEqual(clone(NaN), NaN);
    assert.strictEqual(clone(1), 1);
    assert.strictEqual(clone("foo"), "foo");
    
    var dateCloned = clone(now);
    assert.strictEqual(+dateCloned, +now);
    assert.notStrictEqual(dateCloned, now);
    
    var iclone = new TestIClone();
    var icloned = clone(iclone);
    assert.strictEqual(icloned.foo, true);
    
    var object = new TestObject();
    var objectCloned = clone(object);
    assert.instanceOf(objectCloned, TestObject);
    assert.strictEqual(objectCloned.bool, true);
    assert.strictEqual(objectCloned.str, "foo");
    assert.strictEqual(objectCloned.arr, object.arr)
  })
  
  test(".cloneBoolean()", (assert) => {
    assert.strictEqual(cloneBoolean(undefined), undefined);
    assert.strictEqual(cloneBoolean(null), null);
    assert.strictEqual(cloneBoolean(true), true);
    assert.strictEqual(cloneBoolean(false), false);
  })
  
  test(".cloneString()", (assert) => {
    assert.strictEqual(cloneString(undefined), undefined);
    assert.strictEqual(cloneString(null), null);
    assert.strictEqual(cloneString("foo"), "foo");
  })
  
  test(".cloneNumber()", (assert) => {
    assert.strictEqual(cloneNumber(undefined), undefined);
    assert.strictEqual(cloneNumber(null), null);
    assert.strictEqual(cloneNumber(123), 123);
  })
  
})