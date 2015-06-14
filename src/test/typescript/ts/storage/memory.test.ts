import qunit = require("../../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import memory = require("../../../../main/typescript/ts/storage/memory")

var memorySuite = suite("ts/storage/memory", (self) => {
  
  var memoryStorage = memory;
  
  self.setUp = () => {
    var Constructor: any = memory.constructor;
    memoryStorage = new Constructor();
  }
  
  
  test(".getItem()", (assert) => {
    assert.strictEqual(memoryStorage.getItem("foo"), null);
  })
  
  test(".setItem()", (assert) => {
    assert.strictEqual(memoryStorage.getItem("foo"), null);
    assert.strictEqual(memoryStorage.setItem("foo", "bar"), undefined);
    assert.strictEqual(memoryStorage.getItem("foo"), "bar");
    assert.strictEqual(memoryStorage.setItem("foo", "baz"), undefined);
    assert.strictEqual(memoryStorage.getItem("foo"), "baz");
     
    assert.strictEqual(memoryStorage.setItem("num", 1), undefined);
    assert.strictEqual(memoryStorage.getItem("num"), "1");
     
    assert.strictEqual(memoryStorage.setItem("boolean", false), undefined);
    assert.strictEqual(memoryStorage.getItem("boolean"), "false");
  })
  
  test(".length", (assert) => {
    assert.strictEqual(memoryStorage.length, 0);
    memoryStorage.setItem("foo", "bar");
    assert.strictEqual(memoryStorage.length, 1);
    memoryStorage.setItem("foo", "baz");
    assert.strictEqual(memoryStorage.length, 1);
    memoryStorage.setItem("bar", "bar");
    assert.strictEqual(memoryStorage.length, 2);
    
    memoryStorage.removeItem("bar");
    assert.strictEqual(memoryStorage.length, 1);
  })
})

var exportSuite = memorySuite
export = exportSuite