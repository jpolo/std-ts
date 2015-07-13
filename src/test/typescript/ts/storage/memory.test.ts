import { suite, test, Assert } from "../../../../main/typescript/ts/unit/qunit"
import memory from "../../../../main/typescript/ts/storage/memory"

export default suite("ts/storage/memory", (self) => {

  let memoryStorage = memory;
  
  self.setUp = () => {
    let Constructor: any = memoryStorage.constructor;
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
     
    assert.strictEqual(memoryStorage.setItem("num", "1"), undefined);
    assert.strictEqual(memoryStorage.getItem("num"), "1");
     
    assert.strictEqual(memoryStorage.setItem("boolean", "false"), undefined);
    assert.strictEqual(memoryStorage.getItem("boolean"), "false");
  })
  
  
  test(".size()", (assert) => {
    assert.strictEqual(memoryStorage.size(), 0);
    memoryStorage.setItem("foo", "bar");
    assert.strictEqual(memoryStorage.size(), 1);
    memoryStorage.setItem("foo", "baz");
    assert.strictEqual(memoryStorage.size(), 1);
    memoryStorage.setItem("bar", "bar");
    assert.strictEqual(memoryStorage.size(), 2);
    
    memoryStorage.removeItem("bar");
    assert.strictEqual(memoryStorage.size(), 1);
  })
  
})