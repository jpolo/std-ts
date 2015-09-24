import { test } from "./_boot.test"
import { Engine } from "../../../../main/typescript/ts/unit/engine"

export default test("ts/unit/engine.Engine", (assert) => {
  let engine = new Engine()
  let message: string

  //#equalsStrict()
  message = "#equalsStrict() failure";
  assert(engine.equalsStrict(1, 1), message)
  assert(!engine.equalsStrict(false, 0), message)
  assert(!engine.equalsStrict(undefined, false), message)
  assert(!engine.equalsStrict(undefined, null), message)
  assert(!engine.equalsStrict(0, 1), message)
  assert(!engine.equalsStrict(NaN, NaN), message)
  assert(!engine.equalsStrict([0], [0]), message)
  assert(!engine.equalsStrict("1", 1), message)

  //#equalsSimple()
  message = "#equalsSimple() failure";
  /*assert(engine.equalsSimple(1, 1), message)
  assert(engine.equalsSimple(undefined, false), message)
  assert(engine.equalsSimple(undefined, null), message)
  assert(engine.equalsSimple(false, 0), message)
  assert(!engine.equalsSimple(0, 1), message)
  assert(!engine.equalsSimple([0], [0]), message)
  assert(engine.equalsSimple("1", 1), message)*/

  //#equalsSame()
  message = "#equalsSame() failure";
  assert(engine.equalsSame(1, 1), message)
  assert(engine.equalsSame(NaN, NaN), message)
  assert(!engine.equalsSame(false, 0), message)
  assert(!engine.equalsSame(0, 1), message)
  assert(!engine.equalsSame([0], [0]), message)
  assert(!engine.equalsSame("1", 1), message)

  /*
  //#equalNear()
  message = path + "#equalNear() failure";
  assert(engine.equalNear(1, 1), message)
  assert(engine.equalNear(1, 1.1, 0.11), message);
  assert(!engine.equalNear(1.1, 1), message)
  assert(!engine.equalNear(false, 0), message)
  assert(!engine.equalNear(0, 1), message)
  assert(!engine.equalNear("1", 1), message)
  */

  //#equalDeep()
  message = "#equalDeep() failure";
  assert(engine.equalsDeep([0, 1], [0, 1]), message)
  assert(engine.equalsDeep([0, ["a", "b"]], [0, ["a", "b"]]), message)
  assert(engine.equalsDeep([NaN, NaN], [NaN, NaN]))
  assert(engine.equalsDeep({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }), message)
  assert(!engine.equalsDeep({ foo: 1, bar: 2 }, { foo: 1 }), message)
  assert(!engine.equalsDeep([false], [0]), message)
  assert(!engine.equalsDeep(["1"], [1]), message)

  //#dump()
  message = "#dump() failure";
  //primitives
  assert(engine.dump(null) === 'null', message)
  assert(engine.dump(undefined) === 'undefined', message)
  assert(engine.dump(true) === 'true', message)
  assert(engine.dump(false) === 'false', message)
  assert(engine.dump(1) === '1', message)
  assert(engine.dump("abc") === '"abc"', message)
  assert(engine.dump('ab"c') === '"ab\\"c"', message)
  //array
  assert(engine.dump(['abc', 1, true]) === '["abc", 1, true]', message)
  assert(engine.dump([1, 2, 3, 4, 5, 6, 7, 8]) === '[1, 2, 3, 4, 5, 6, 7, ...]', message)
  //date
  assert(engine.dump(new Date('1789-07-14T00:00:00.000Z')) === 'Date { 1789-07-14T00:00:00.000Z }', message)
  //regexp
  assert(engine.dump(/abc(.*)/gi) === '/abc(.*)/gi', message)

});
