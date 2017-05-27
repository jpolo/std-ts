import { suite, testc, Assert } from '../../../main/typescript/ts/unit/qunit'
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
} from '../../../main/typescript/ts/compare'

class AssertCustom extends Assert {

  generate<A, R> (f: (a: A) => R, d: Array<[[A], R]>): void
  generate<A, B, R> (f: (a: A, b: B) => R, d: Array<[[A, B], R]>): void
  generate<A, B, C, R> (f: (a: A, b: B, c: C) => R, d: Array<[[A, B, C], R]>): void
  generate (f: any, d: any[]): any {
    for (const r of d) {
      const [args, expected] = r
      const message = '(' +
        args.map((arg) => this.__dump__(arg)).join(', ') +
        ') => ' +
        this.__dump__(expected)
      this.strictEqual(f.apply(null, args), expected, message)
    }
  }
}

export default suite('ts/compare', (self) => {
  const test = testc(AssertCustom)
  const data = function <T, R> (d: Array<[[T, T], R]>) { return d }

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
    [[null, false], Ordering.None]
  ])
  const STRINGS = data([
    [['foo', 'foo'], Ordering.Equal],
    [['a', 'b'], Ordering.Less],
    [['b', 'a'], Ordering.Greater],
    [['a', undefined], Ordering.None],
    [[undefined, 'a'], Ordering.None],
    [['a', null], Ordering.None],
    [[null, 'a'], Ordering.None]
  ])
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
  ])
  const DATES = data([
    [[new Date(), new Date()], Ordering.Equal],
    [[new Date(0), new Date(1)], Ordering.Less],
    [[new Date(1), new Date(0)], Ordering.Greater],
    [[new Date(), null], Ordering.None],
    [[null, new Date()], Ordering.None]
  ])
  const REGEXPS = data([
    [[/abc/gi, /abc/gi], Ordering.Equal],
    [[/bac/gi, /abc/gi], Ordering.Greater],
    [[/abc/gi, /bac/gi], Ordering.Less]
  ])

  test('.isICompare()', (assert) => {
    assert.strictEqual(isICompare(undefined), false)
    assert.strictEqual(isICompare(null), false)
    assert.strictEqual(isICompare({ compare: () => { } }), true)
  })

  test('.compare()', (assert) => {
    assert.generate(compare, EMPTY.concat(STRINGS as any, BOOLEANS, NUMBERS, DATES))
  })

  test('.compareBoolean()', (assert) => {
    assert.generate(compareBoolean, BOOLEANS.concat(EMPTY))
  })

  test('.compareString()', (assert) => {
    assert.generate(compareString, STRINGS.concat(EMPTY))
  })

  test('.compareNumber()', (assert) => {
    assert.generate(compareNumber, NUMBERS.concat(EMPTY))
  })

  test('.compareDate()', (assert) => {
    assert.generate(compareDate, DATES.concat(EMPTY))
  })

  test('.compareRegExp()', (assert) => {
    assert.generate(compareRegExp, REGEXPS.concat(EMPTY))
  })

  test('.min()', (assert) => {
    assert.strictEqual(min(0, 0, compareNumber), 0)
    assert.strictEqual(min(0, 1, compareNumber), 0)
    assert.strictEqual(min(-1, 1, compareNumber), -1)
    assert.strictEqual(min('a', 'b', compareString), 'a')
  })

  test('.max()', (assert) => {
    assert.strictEqual(max(0, 1, compareNumber), 1)
    assert.strictEqual(max(-1, 1, compareNumber), 1)
    assert.strictEqual(max('a', 'b', compareString), 'b')
  })

  test('.equals()', (assert) => {
    assert.strictEqual(equals(0, 1, compareNumber), false)
    assert.strictEqual(equals(-1, 1, compareNumber), false)
    assert.strictEqual(equals('a', 'b', compareString), false)
    assert.strictEqual(equals('a', 'a', compareString), true)
  })

  test('.notEquals()', (assert) => {
    assert.strictEqual(notEquals(0, 1, compareNumber), true)
    assert.strictEqual(notEquals(-1, 1, compareNumber), true)
    assert.strictEqual(notEquals('a', 'b', compareString), true)
    assert.strictEqual(notEquals('a', 'a', compareString), false)
  })
})
