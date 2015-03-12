import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import iterator = require("../../../main/typescript/ts/iterator")

var iteratorSuite = suite("ts/iterator", (self) => {
  var iterationLimit = 30;
  
  
  test(".empty()", (assert) => {
    var iter = iterator.empty();
    
    for (var i = 0; i < iterationLimit; ++i) {
      var r = iter.next();
      assert.ok(r.done);
      assert.strictEqual(r.value, undefined);
    }
  })
  
  test(".single()", (assert) => {
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
  
  test(".fill()", (assert) => {
    var o = {};
    var iter = iterator.fill(3, o);
    
    for (var i = 0; i < iterationLimit; ++i) {
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
  
  test(".iterate()", (assert) => {
    var odds = iterator.iterate(1, function (v) {
      return v + 2;
    });
    var expected = [1, 3, 5, 7, 9];
    
    for (var i = 0; i < expected.length; ++i) {
      var r = odds.next();
      assert.ok(!r.done);
      assert.strictEqual(r.value, expected[i]);
    }
  })
  
  test(".range()", (assert) => {
    var iter = iterator.range(0, 30, 3);
    var expected = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27/*, 30*/];
    for (var i = 0; i < iterationLimit; ++i) {
      var r = iter.next();
      if (i < 10) {
        assert.ok(!r.done);
        assert.strictEqual(r.value, expected[i]);
      } else {
        assert.ok(r.done);
        assert.strictEqual(r.value, undefined);
      }
    }
  })
  
  test(".continually()", (assert) => {
    var iter = iterator.continually("blah");
    for (var i = 0; i < iterationLimit; ++i) {
      var r = iter.next();
      assert.ok(!r.done);
      assert.strictEqual(r.value, "blah");
    }
  })
  
  test(".concat()", (assert) => {
    var iter = iterator.concat(iterator.range(1, 3), iterator.range(4, 7), iterator.range(8, 10));
    var expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    /*
    for (var i = 0; i < iterationLimit; ++i) {
      var r = iter.next();
      if (i < 10) {
        assert.ok(!r.done);
        assert.strictEqual(r.value, expected[i]);
      } else {
        assert.ok(r.done);
        assert.strictEqual(r.value, undefined);
      }
    }
    */
  })

});

export = iteratorSuite;