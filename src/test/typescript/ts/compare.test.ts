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
      [["b", "a"], Ordering.Greater]
    ])
  })
})
  
export = compareSuite