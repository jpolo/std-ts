import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit";
import { hash, hashBoolean, hashNumber, hashString } from "../../../main/typescript/ts/hash";

export default suite("ts/hash", (self) => {

  const EMPTY: Array<[any, number]> = [
    [undefined, 0],
    [null, 0]
  ];

  const BOOLEANS: Array<[boolean, number]> = [
    [false, 0],
    [true, 1]
  ];

  const NUMBERS: Array<[number, number]> = [
    [NaN, 0],
    [0, 0],
    [1, 1]
  ];

  const STRINGS: Array<[string, number]> = [
    ["", 0]
  ];

  function assertAll<Input, Output>(assert: Assert, f: (v: Input) => Output, data: Array<[Input, Output]>) {
    for (let pair of data) {
      assert.strictEqual(f(pair[0]), pair[1]);
    }
  }

  self.setUp = () => {

  };

  test(".hashBoolean()", (assert) => {
    assertAll(assert, hashBoolean, EMPTY);
    assertAll(assert, hashBoolean, BOOLEANS);
  });

  test(".hashNumber()", (assert) => {
    assertAll(assert, hashNumber, EMPTY);
    assertAll(assert, hashNumber, NUMBERS);
  });

  test(".hashString()", (assert) => {
    assertAll(assert, hashString, EMPTY);
    assertAll(assert, hashString, STRINGS);
  });

})
