import { suite, test, Assert } from "../../../../main/typescript/ts/unit/qunit"
import { List } from "../../../../main/typescript/ts/collection/list"

export default suite("ts/collection/list.List", (self) => {
  
  var l: List<string>
  
  self.setUp = () => {
    l = new List<string>()
  }
  
  
  test("#item()", (assert) => {
    assert.strictEqual(l.item(0), undefined);
    l.push("foo");
    assert.strictEqual(l.item(0), "foo");
    l.push("bar")
    assert.strictEqual(l.item(0), "foo");
    assert.strictEqual(l.item(1), "bar");
    l.push("baz")
    assert.strictEqual(l.item(0), "foo");
    assert.strictEqual(l.item(1), "bar");
    assert.strictEqual(l.item(2), "baz");
  })
  
  test("#push()", (assert) => {
    assert.strictEqual(l.push("foo"), 1);
    assert.strictEqual(l.length, 1);
    assert.strictEqual(l.item(0), "foo");
    
    assert.strictEqual(l.push("bar", "baz", "blah"), 4);
    assert.strictEqual(l.item(0), "foo");
    assert.strictEqual(l.item(1), "bar");
    assert.strictEqual(l.item(2), "baz");
    assert.strictEqual(l.item(3), "blah");
    assert.strictEqual(l.length, 4);
  })
  
  test("#pop()", (assert) => {
    l.push("foo", "bar", "baz");
    assert.strictEqual(l.pop(), "baz");
    assert.strictEqual(l.length, 2);
    assert.strictEqual(l.pop(), "bar");
    assert.strictEqual(l.length, 1);
    assert.strictEqual(l.pop(), "foo");
    assert.strictEqual(l.length, 0);
    assert.strictEqual(l.pop(), undefined);
  })
  
  test("#toString()", (assert) => {
    assert.strictEqual(l.toString(), "List {}");
    l.push("foo", "bar", "baz");
    assert.strictEqual(l.toString(), "List { foo, bar, baz }");
  })
})