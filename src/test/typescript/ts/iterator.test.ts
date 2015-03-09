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
  
  test("fill()", (assert) => {
    var o = {};
    var iter = iterator.fill(3, o);
    
    for (var i = 0; i < 5; ++i) {
      var r = iter.next();
      if (i < 3) {
        assert.ok(!r.done);
        assert.strictEqual(r.value, o);
      } else {
        assert.ok(r.done);
        assert.strictEqual(r.value, undefined);
      }
    }
  })
  
  test("iterate()", (assert) => {
    
    
    var o = {};
    var odds = iterator.iterate(1, function (v) {
      return v + 2;
    });
    
    for (var i = 0; i < 5; ++i) {
      var r = odds.next();
      /*if (i < 3) {
        assert.ok(!r.done);
        assert.strictEqual(r.value, o);
      } else {
        assert.ok(r.done);
        assert.strictEqual(r.value, undefined);
      }*/
    }
  })

});

export = iteratorSuite;