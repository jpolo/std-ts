import { test } from "./_boot.test"
import {
  equalsSame,
  equalsSimple,
  equalsDeep,
  equalsNear
 } from "../../../../main/typescript/ts/unit/equal"

export default test("ts/unit/equal", (assert) => {
  let message = ""

  //#is()
  message = ".equalsSame() failure"
  assert(equalsSame(undefined, undefined), message)
  assert(equalsSame(null, null), message)
  assert(equalsSame(-0, -0), message)
  assert(!equalsSame(-0, +0), message)
  assert(equalsSame(1, 1), message)
  assert(!equalsSame(0, 1), message)
  assert(equalsSame(NaN, NaN), message)
  assert(!equalsSame(false, 0), message)
  assert(!equalsSame([0], [0]), message)
  assert(!equalsSame("1", 1), message)

  //#equals()
  message = ".equals() failure"
  assert(equalsSimple(undefined, undefined), message)
  assert(equalsSimple(null, null), message)
  assert(equalsSimple(-0, -0), message)
  assert(equalsSimple(-0, +0), message)
  assert(equalsSimple(1, 1), message)
  assert(!equalsSimple(0, 1), message)
  assert(equalsSimple(NaN, NaN), message)
  assert(equalsSimple(false, 0), message)
  assert(!equalsSimple([0], [0]), message)
  assert(equalsSimple("1", 1), message)

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
