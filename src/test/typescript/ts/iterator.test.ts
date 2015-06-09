import qunit = require("../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import iterator = require("../../../main/typescript/ts/iterator")

var iteratorSuite = suite("ts/iterator", (self) => {

  function generate<T>(assert: qunit.Assert, iter: iterator.IIterator<T>, a: T[], limit = 30) {
    for (var i = 0; i < limit; ++i) {
      var r = iter.next();
      if (i < a.length) {
        assert.ok(!r.done);
        assert.strictEqual(r.value, a[i]);
      } else {
        assert.ok(r.done);
        assert.strictEqual(r.value, undefined);
      }
    }
  }
  
  test(".isIIterator()", (assert) => {
    assert.strictEqual(iterator.isIIterator(undefined), false);
    assert.strictEqual(iterator.isIIterator(null), false);
    assert.strictEqual(iterator.isIIterator({ next: () => {} }), true);
  })
  
  test(".empty()", (assert) => {
    generate(assert, iterator.empty(), []);
  })
  
  test(".single()", (assert) => {
    var o = {};
    var iter = iterator.single(o);
    
    generate(assert, iterator.single(o), [ o ]);
  })
  
  test(".fill()", (assert) => {
    var o = {};
    var iter = iterator.fill(3, o);
    generate(assert, iterator.fill(3, o), [ o, o, o ]);
  })
  
  test(".iterate()", (assert) => {
    var odds = iterator.iterate(1, function (v) { return v + 2; });
    var expected = [1, 3, 5, 7, 9, 11, 13];
    generate(assert, odds, expected, expected.length);
  })
  
  test(".range()", (assert) => {
    generate(assert, iterator.range(0, 30, 3), [0, 3, 6, 9, 12, 15, 18, 21, 24, 27/*, 30*/]);
    generate(assert, iterator.range(0, 5), [0, 1, 2, 3, 4]);
  })
  
  test(".continually()", (assert) => {
    var o = "blah";
    generate(assert, iterator.continually(o), [o, o, o], 3);
  })
  
  test(".concat()", (assert) => {
    var iter = iterator.concat(iterator.range(1, 4), iterator.range(4, 8), iterator.range(8, 10));
    
    generate(assert, iter, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  })

});

var exportSuite = iteratorSuite;
export = exportSuite;