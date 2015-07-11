import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import { IIterator, isIIterator, empty, single, fill, iterate, concat, range, continually } from "../../../main/typescript/ts/iterator"

export default suite("ts/iterator", (self) => {

  function generate<T>(assert: Assert, iter: IIterator<T>, a: T[], limit = 30) {
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
    assert.strictEqual(isIIterator(undefined), false);
    assert.strictEqual(isIIterator(null), false);
    assert.strictEqual(isIIterator({ next: () => {} }), true);
  })
  
  test(".empty()", (assert) => {
    generate(assert, empty(), []);
  })
  
  test(".single()", (assert) => {
    var o = {};
    var iter = single(o);
    
    generate(assert, single(o), [ o ]);
  })
  
  test(".fill()", (assert) => {
    var o = {};
    var iter = fill(3, o);
    generate(assert, fill(3, o), [ o, o, o ]);
  })
  
  test(".iterate()", (assert) => {
    var odds = iterate(1, function (v) { return v + 2; });
    var expected = [1, 3, 5, 7, 9, 11, 13];
    generate(assert, odds, expected, expected.length);
  })
  
  test(".range()", (assert) => {
    generate(assert, range(0, 30, 3), [0, 3, 6, 9, 12, 15, 18, 21, 24, 27/*, 30*/]);
    generate(assert, range(0, 5), [0, 1, 2, 3, 4]);
  })
  
  test(".continually()", (assert) => {
    var o = "blah";
    generate(assert, continually(o), [o, o, o], 3);
  })
  
  test(".concat()", (assert) => {
    var iter = concat(range(1, 4), range(4, 8), range(8, 10));
    
    generate(assert, iter, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  })

})