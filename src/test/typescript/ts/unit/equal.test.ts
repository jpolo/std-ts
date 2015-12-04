import { test } from "./_boot.test";
import {
  equalsSame,
  equalsStrict,
  equalsSimple,
  equalsDeep,
  equalsNear
} from "../../../../main/typescript/ts/unit/equal";

export default test("ts/unit/equal", (assert) => {

  // #equalsSame()
  (function () {
    let message = "#equalsSame() failure";

    function eq(a, b) {
      return equalsSame(a, b);
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message);
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message);
    }

    assert_eq(1, 1);
    assert_eq(NaN, NaN);
    assert_neq(false, 0);
    assert_neq(0, 1);
    assert_neq([0], [0]);
    assert_neq("1", 1);
  }());

  // #equalsStrict()
  (function () {
    let message = "#equalsStrict() failure";

    function eq(a, b) {
      return equalsStrict(a, b);
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message);
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message);
    }

    assert_eq(1, 1);
    assert_neq(false, 0);
    assert_neq(undefined, false);
    assert_neq(undefined, null);
    assert_neq(0, 1);
    assert_neq(NaN, NaN);
    assert_neq([0], [0]);
    assert_neq("1", 1);
  }());

  // #equalDeep()
  (function () {
    let message = "#equalsDeep() failure";

    function eq(a, b) {
      return equalsDeep(a, b);
    }
    function assert_eq(a, b) {
      return assert(eq(a, b), message);
    }
    function assert_neq(a, b) {
      return assert(!eq(a, b), message);
    }

    assert_eq([0, 1], [0, 1]);
    assert_eq([0, ["a", "b"]], [0, ["a", "b"]]);
    assert_eq([NaN, NaN], [NaN, NaN]);
    assert_eq({ foo: 1, bar: 2 }, { foo: 1, bar: 2 });
    assert_neq({ foo: 1, bar: 2 }, { foo: 1 });
    assert_neq([false], [0]);
    assert_neq(["1"], [1]);
  }());

})
