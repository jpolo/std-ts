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
    assert.strictEqual(memory.getItem("foo"), null);
  })
  
  test(".setItem()", (assert) => {
    assert.strictEqual(memory.getItem("foo"), null);
    assert.strictEqual(memory.setItem("foo", "bar"), undefined);
    assert.strictEqual(memory.getItem("foo"), "bar");
    assert.strictEqual(memory.setItem("foo", "baz"), undefined);
    assert.strictEqual(memory.getItem("foo"), "baz");
     
    assert.strictEqual(memory.setItem("num", 1), undefined);
    assert.strictEqual(memory.getItem("num"), "1");
     
    assert.strictEqual(memory.setItem("boolean", false), undefined);
    assert.strictEqual(memory.getItem("boolean"), "false");
  })
  
  test(".length", (assert) => {
    
    assert.strictEqual(memoryStorage.length, 0);
    memory.setItem("foo", "bar");
    assert.strictEqual(memoryStorage.length, 1);
    memory.setItem("foo", "baz");
    assert.strictEqual(memoryStorage.length, 1);
    memory.setItem("bar", "bar");
    assert.strictEqual(memoryStorage.length, 2);
    
    memory.removeItem("bar");
    assert.strictEqual(memoryStorage.length, 1);
    
  })
})

var exportSuite = memorySuite
export = exportSuite