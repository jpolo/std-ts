import unit = require("../../../main/typescript/ts/unit")
import test = unit.test
import compare = require("../../../main/typescript/ts/compare")
import Ordering = compare.Ordering


var compareSuite = unit.suite("ts/compare", (self) => {
  
  function generator<A, R>(assert: unit.Assert, f: (a: A) => R): (d: Array<[[A], R]>) => void
  function generator<A, B, R>(assert: unit.Assert, f: (a: A, b: B) => R): (d: Array<[[A, B], R]>) => void
  function generator<A, B, C, R>(assert: unit.Assert, f: (a: A, b: B, c: C) => R): (d: Array<[[A, B, C], R]>) => void
  function generator(assert: unit.Assert, f: any): any {
    return function (d: any[]) {
      for (var i = 0, l = d.length; i < l; ++i) {
        var r = d[i];
        assert.strictEqual(f.apply(null, r[0]), r[1]);
      }
    }
  }
  
 
  
  test(".compare()", (assert) => {
    generator(assert, compare.compare)
  })
  
  test(".compareString()", (assert) => {
    generator(assert, compare.compareString)([
      [["foo", "foo"], Ordering.Equal],
      [["a", "b"], Ordering.Less],
      [["b", "a"], Ordering.Greater],
      [["a", undefined], Ordering.None],
      [[undefined, "a"], Ordering.None],
      [[undefined, undefined], Ordering.None],
      [["a", null], Ordering.None],
      [[null, "a"], Ordering.None],
      [[null, null], Ordering.None]
    ])
  })
  
  test(".compareNumber()", (assert) => {
    generator(assert, compare.compareNumber)([
      [[0, 0], Ordering.Equal],
      [[0, -0], Ordering.Equal],
      [[0, 1], Ordering.Less],
      [[-1, 1], Ordering.Less],
      [[1, 0], Ordering.Greater],
      [[1, -1], Ordering.Greater],
      [[1, undefined], Ordering.None],
      [[undefined, 1], Ordering.None],
      [[undefined, undefined], Ordering.None],
      [[1, null], Ordering.None],
      [[null, 1], Ordering.None],
      [[null, null], Ordering.None],
      [[1, NaN], Ordering.None],
      [[NaN, 1], Ordering.None],
      [[NaN, NaN], Ordering.None]
    ])
  })
})
  
export = compareSuite