import { test } from "./_boot.test"
import {
  is,
  equals,
  equalsDeep,
  equalsNear
 } from "../../../../main/typescript/ts/unit/equal"

export default test("ts/unit/equal", (assert) => {
  let message = ""

  //#is()
  message = ".is() failure"
  assert(is(undefined, undefined), message)
  assert(is(null, null), message)
  assert(is(-0, -0), message)
  assert(!is(-0, +0), message)
  assert(is(1, 1), message)
  assert(!is(0, 1), message)
  assert(is(NaN, NaN), message)
  assert(!is(false, 0), message)
  assert(!is([0], [0]), message)
  assert(!is("1", 1), message)

  //#equals()
  message = ".equals() failure"
  assert(equals(undefined, undefined), message)
  assert(equals(null, null), message)
  assert(equals(-0, -0), message)
  assert(equals(-0, +0), message)
  assert(equals(1, 1), message)
  assert(!equals(0, 1), message)
  assert(equals(NaN, NaN), message)
  assert(equals(false, 0), message)
  assert(!equals([0], [0]), message)
  assert(equals("1", 1), message)

  //.equalDeep()
  message = ".equalDeep() failure"
  assert(equalsDeep(undefined, undefined), message)
  assert(equalsDeep(null, null), message)
  assert(equalsDeep(-0, -0), message)
  assert(equalsDeep(-0, +0), message)
  assert(equalsDeep(1, 1), message)
  assert(equalsDeep(NaN, NaN), message)
  assert(equalsDeep([0, 1], [0, 1]), message)
  assert(equalsDeep([0, ["a", "b"]], [0, ["a", "b"]]), message)
  assert(equalsDeep([NaN, NaN], [NaN, NaN]))
  assert(equalsDeep({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }), message)
  assert(!equalsDeep({ foo: 1, bar: 2 }, { foo: 1 }), message)
  assert(!equalsDeep([false], [0]), message)
  assert(!equalsDeep(["1"], [1]), message)

})
