import { test } from "./_boot.test"
import { Engine } from "../../../../main/typescript/ts/unit/engine"

export default test("ts/unit/engine.Engine", (assert) => {
  let engine = new Engine()
  let message: string

  //#equalsStrict()
  (function () {
    let message = "#equalsStrict() failure"

    function eq(a, b) {
      return engine.equalsStrict(a, b)
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message)
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message)
    }

    assert_eq(1, 1)
    assert_neq(false, 0)
    assert_neq(undefined, false)
    assert_neq(undefined, null)
    assert_neq(0, 1)
    assert_neq(NaN, NaN)
    assert_neq([0], [0])
    assert_neq("1", 1)
  }());


  //#equalsSimple()
  (function () {
    let message = "#equalsSimple() failure"

    function eq(a, b) {
      return engine.equalsSimple(a, b)
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message)
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message)
    }
    assert_eq(1, 1)
    assert_neq(undefined, false)
    assert_eq(undefined, null)
    assert_eq(false, 0)
    assert_neq(NaN, NaN)
    assert_neq(0, 1)
    assert_eq("1", 1)
    assert_neq([0], [0])
  }());

  //#equalsSame()
  (function () {
    let message = "#equalsSame() failure"

    function eq(a, b) {
      return engine.equalsSame(a, b)
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message)
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message)
    }

    assert_eq(1, 1)
    assert_eq(NaN, NaN)
    assert_neq(false, 0)
    assert_neq(0, 1)
    assert_neq([0], [0])
    assert_neq("1", 1)
  }());


  /*
  //#equalNear()
  (function () {
    let message = "#equalNear() failure";

    function eq(a, b) {
      return engine.equalNear(a, b)
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message)
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message)
    }

    assert_eq(1, 1)
    assert(engine.equalNear(1, 1.1, 0.11), message);
    assert(!engine.equalNear(1.1, 1), message)
    assert(!engine.equalNear(false, 0), message)
    assert(!engine.equalNear(0, 1), message)
    assert(!engine.equalNear("1", 1), message)
  }());

  */

  //#equalDeep()
  (function () {
    let message = "#equalsDeep() failure"

    function eq(a, b) {
      return engine.equalsDeep(a, b)
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message)
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message)
    }

    assert_eq([0, 1], [0, 1])
    assert_eq([0, ["a", "b"]], [0, ["a", "b"]])
    assert_eq([NaN, NaN], [NaN, NaN])
    assert_eq({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })
    assert_neq({ foo: 1, bar: 2 }, { foo: 1 })
    assert_neq([false], [0])
    assert_neq(["1"], [1])
  }());




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
