import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import {
  Ordering,
  isICompare,
  compare,
  compareBoolean,
  compareNumber,
  compareString,
  compareRegExp,
  compareDate,
  min, max,
  equals,
  notEquals
} from "../../../main/typescript/ts/compare"


export default suite("ts/compare", (self) => {

  function data<T, R>(d: Array<[[T, T], R]>) {
    return d;
  }

  function generator<A, R>(assert: Assert, f: (a: A) => R): (d: Array<[[A], R]>) => void
  function generator<A, B, R>(assert: Assert, f: (a: A, b: B) => R): (d: Array<[[A, B], R]>) => void
  function generator<A, B, C, R>(assert: Assert, f: (a: A, b: B, c: C) => R): (d: Array<[[A, B, C], R]>) => void
  function generator(assert: Assert, f: any): any {
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

  const EMPTY = data([
    [[undefined, null], Ordering.None],
    [[undefined, undefined], Ordering.Equal],
    [[null, null], Ordering.Equal]
  ])
  const BOOLEANS = data([
    [[true, true], Ordering.Equal],
    [[false, false], Ordering.Equal],
    [[false, true], Ordering.Less],
    [[true, false], Ordering.Greater],
    [[false, undefined], Ordering.None],
    [[undefined, false], Ordering.None],
    [[false, null], Ordering.None],
    [[null, false], Ordering.None],
  ]);
  const STRINGS = data([
    [["foo", "foo"], Ordering.Equal],
    [["a", "b"], Ordering.Less],
    [["b", "a"], Ordering.Greater],
    [["a", undefined], Ordering.None],
    [[undefined, "a"], Ordering.None],
    [["a", null], Ordering.None],
    [[null, "a"], Ordering.None],
  ]);
  const NUMBERS = data([
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
  const DATES = data([
    [[new Date(), new Date()], Ordering.Equal],
    [[new Date(0), new Date(1)], Ordering.Less],
    [[new Date(1), new Date(0)], Ordering.Greater],
    [[new Date(), null], Ordering.None],
    [[null, new Date()], Ordering.None]
  ]);
  const REGEXPS = data([
    [[/abc/gi, /abc/gi], Ordering.Equal],
    [[/bac/gi, /abc/gi], Ordering.Greater],
    [[/abc/gi, /bac/gi], Ordering.Less]
  ]);


  test(".isICompare()", (assert) => {
    assert.strictEqual(isICompare(undefined), false);
    assert.strictEqual(isICompare(null), false);
    assert.strictEqual(isICompare({ compare: () => { } }), true);
  })

  test(".compare()", (assert) => {
    generator(assert, compare)(EMPTY.concat(<any>STRINGS, BOOLEANS, NUMBERS, DATES))
  })

  test(".compareBoolean()", (assert) => {
    generator(assert, compareBoolean)(BOOLEANS.concat(EMPTY))
  })

  test(".compareString()", (assert) => {
    generator(assert, compareString)(STRINGS.concat(EMPTY))
  })

  test(".compareNumber()", (assert) => {
    generator(assert, compareNumber)(NUMBERS.concat(EMPTY))
  })

  test(".compareDate()", (assert) => {
    generator(assert, compareDate)(DATES.concat(EMPTY))
  })

  test(".compareRegExp()", (assert) => {
    generator(assert, compareRegExp)(REGEXPS.concat(EMPTY))
  })

  test(".min()", (assert) => {
    assert.strictEqual(min(0, 0, compareNumber), 0)
    assert.strictEqual(min(0, 1, compareNumber), 0)
    assert.strictEqual(min(-1, 1, compareNumber), -1)
    assert.strictEqual(min("a", "b", compareString), "a")
  })

  test(".max()", (assert) => {
    assert.strictEqual(max(0, 1, compareNumber), 1)
    assert.strictEqual(max(-1, 1, compareNumber), 1)
    assert.strictEqual(max("a", "b", compareString), "b")
  })

  test(".equals()", (assert) => {
    assert.strictEqual(equals(0, 1, compareNumber), false)
    assert.strictEqual(equals(-1, 1, compareNumber), false)
    assert.strictEqual(equals("a", "b", compareString), false)
    assert.strictEqual(equals("a", "a", compareString), true)
  })

  test(".notEquals()", (assert) => {
    assert.strictEqual(notEquals(0, 1, compareNumber), true)
    assert.strictEqual(notEquals(-1, 1, compareNumber), true)
    assert.strictEqual(notEquals("a", "b", compareString), true)
    assert.strictEqual(notEquals("a", "a", compareString), false)
  })
})
