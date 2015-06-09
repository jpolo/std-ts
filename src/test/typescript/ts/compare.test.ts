import qunit = require("../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import compare = require("../../../main/typescript/ts/compare")
import Ordering = compare.Ordering


var compareSuite = suite("ts/compare", (self) => {
  
  function data<T, R>(d: Array<[[T, T], R]>) {
    return d;
  }
  
  function generator<A, R>(assert: qunit.Assert, f: (a: A) => R): (d: Array<[[A], R]>) => void
  function generator<A, B, R>(assert: qunit.Assert, f: (a: A, b: B) => R): (d: Array<[[A, B], R]>) => void
  function generator<A, B, C, R>(assert: qunit.Assert, f: (a: A, b: B, c: C) => R): (d: Array<[[A, B, C], R]>) => void
  function generator(assert: qunit.Assert, f: any): any {
    return function (d: any[]) {
      function dump(args) {
        return args.map((arg) => assert.__dump__(arg)).join(", ");
      }
      
      for (var i = 0, l = d.length; i < l; ++i) {
        var r = d[i];
        var args = r[0];
        var expected = r[1];
        var message = "(" + dump(args) + ") => " + assert.__dump__(expected);
        assert.strictEqual(f.apply(null, args), expected, message);
      }
    }
  }
  
  var EMPTY = data([
    [[undefined, null], Ordering.None],
    [[undefined, undefined], Ordering.Equal],
    [[null, null], Ordering.Equal]
  ])
  var BOOLEANS = data([
    [[true, true], Ordering.Equal],
    [[false, false], Ordering.Equal],
    [[false, true], Ordering.Less],
    [[true, false], Ordering.Greater],
    [[false, undefined], Ordering.None],
    [[undefined, false], Ordering.None],
    [[false, null], Ordering.None],
    [[null, false], Ordering.None],
  ]);
  var STRINGS = data([
    [["foo", "foo"], Ordering.Equal],
    [["a", "b"], Ordering.Less],
    [["b", "a"], Ordering.Greater],
    [["a", undefined], Ordering.None],
    [[undefined, "a"], Ordering.None],
    [["a", null], Ordering.None],
    [[null, "a"], Ordering.None],
  ]);
  var NUMBERS = data([
    [[0, 0], Ordering.Equal],
    [[0, -0], Ordering.Equal],
    [[0, 1], Ordering.Less],
    [[-1, 1], Ordering.Less],
    [[1, 0], Ordering.Greater],
    [[1, -1], Ordering.Greater],
    [[1, undefined], Ordering.None],
    [[undefined, 1], Ordering.None],
    [[1, null], Ordering.None],
    [[null, 1], Ordering.None],
    [[1, NaN], Ordering.None],
    [[NaN, 1], Ordering.None],
    [[NaN, NaN], Ordering.None]
  ]);
  var DATES = data([
    [[new Date(), new Date()], Ordering.Equal],
    [[new Date(0), new Date(1)], Ordering.Less],
    [[new Date(1), new Date(0)], Ordering.Greater],
    [[new Date(), null], Ordering.None],
    [[null, new Date()], Ordering.None]
  ]);
  var REGEXPS = data([
    [[/abc/gi, /abc/gi], Ordering.Equal],
    [[/bac/gi, /abc/gi], Ordering.Greater],
    [[/abc/gi, /bac/gi], Ordering.Less]
  ]);
 
  
  test(".isICompare()", (assert) => {
    assert.strictEqual(compare.isICompare(undefined), false);
    assert.strictEqual(compare.isICompare(null), false);
    assert.strictEqual(compare.isICompare({ compare: () => { } }), true);
  })
  
  test(".compare()", (assert) => {
    generator(assert, compare.compare)(EMPTY.concat(<any>STRINGS, BOOLEANS, NUMBERS, DATES))
  })
  
  test(".compareBoolean()", (assert) => {
    generator(assert, compare.compareBoolean)(BOOLEANS.concat(EMPTY))
  })
  
  test(".compareString()", (assert) => {
    generator(assert, compare.compareString)(STRINGS.concat(EMPTY))
  })
  
  test(".compareNumber()", (assert) => {
    generator(assert, compare.compareNumber)(NUMBERS.concat(EMPTY))
  })
  
  test(".compareDate()", (assert) => {
    generator(assert, compare.compareDate)(DATES.concat(EMPTY))
  })
  
  test(".compareRegExp()", (assert) => {
    generator(assert, compare.compareRegExp)(REGEXPS.concat(EMPTY))
  })
  
  test(".min()", (assert) => {
    assert.strictEqual(compare.min(0, 0, compare.compareNumber), 0);
    assert.strictEqual(compare.min(0, 1, compare.compareNumber), 0);
    assert.strictEqual(compare.min(-1, 1, compare.compareNumber), -1);
    assert.strictEqual(compare.min("a", "b", compare.compareString), "a");
  })
  
  test(".max()", (assert) => {
    assert.strictEqual(compare.max(0, 1, compare.compareNumber), 1);
    assert.strictEqual(compare.max(-1, 1, compare.compareNumber), 1);
    assert.strictEqual(compare.max("a", "b", compare.compareString), "b");
  })
  
  test(".equals()", (assert) => {
    assert.strictEqual(compare.equals(0, 1, compare.compareNumber), false);
    assert.strictEqual(compare.equals(-1, 1, compare.compareNumber), false);
    assert.strictEqual(compare.equals("a", "b", compare.compareString), false);
    assert.strictEqual(compare.equals("a", "a", compare.compareString), true);
  })
  
  test(".notEquals()", (assert) => {
    assert.strictEqual(compare.notEquals(0, 1, compare.compareNumber), true);
    assert.strictEqual(compare.notEquals(-1, 1, compare.compareNumber), true);
    assert.strictEqual(compare.notEquals("a", "b", compare.compareString), true);
    assert.strictEqual(compare.notEquals("a", "a", compare.compareString), false);
  })
})
  
var exportSuite = compareSuite
export = exportSuite