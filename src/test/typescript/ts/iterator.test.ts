import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import iterator = require("../../../main/typescript/ts/iterator")

var iteratorSuite = suite("ts/iterator", (self) => {
  
  test("empty()", (assert) => {
    var iter = iterator.empty();
    
    var r = iter.next();
    assert.ok(r.done);
    assert.strictEqual(r.value, undefined);
    
    r = iter.next();
    assert.ok(r.done);
    assert.strictEqual(r.value, undefined);
    
    r = iter.next();
    assert.ok(r.done);
    assert.strictEqual(r.value, undefined);
  })
  
  test("single()", (assert) => {
    var o = {};
    var iter = iterator.single(o);
    
    var r = iter.next();
    assert.ok(!r.done);
    assert.strictEqual(r.value, o);
    r = iter.next();
    assert.ok(r.done);
    assert.strictEqual(r.value, undefined);
    r = iter.next();
    assert.ok(r.done);
    assert.strictEqual(r.value, undefined);
  })

});

export = iteratorSuite;