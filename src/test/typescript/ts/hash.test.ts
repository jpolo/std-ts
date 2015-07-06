import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import hash = require("../../../main/typescript/ts/hash")

var hashSuite = suite("ts/hash", (self) => {
 
  var EMPTY: Array<[any, number]> = [
    [undefined, 0],
    [null, 0]
  ];
  
  var BOOLEANS: Array<[boolean, number]> = [
    [false, 0],
    [true, 1]
  ];
  
  var NUMBERS: Array<[number, number]> = [
    [NaN, 0],
    [0, 0],
    [1, 1]
  ];
  
  var STRINGS: Array<[string, number]> = [
    ["", 0]
  ];
  
  function assertAll<Input, Output>(assert: Assert, f: (v: Input) => Output, data: Array<[Input, Output]>) {
    for (var i = 0, l = data.length; i < l; i++) {
      var pair = data[i];
      assert.strictEqual(f(pair[0]), pair[1]);
    }
  }

  self.setUp = () => {
    
  };
  
  test(".hashBoolean()", (assert) => {
    assertAll(assert, hash.hashBoolean, EMPTY);
    assertAll(assert, hash.hashBoolean, BOOLEANS);
  })
  
  test(".hashNumber()", (assert) => {
    assertAll(assert, hash.hashNumber, EMPTY);
    assertAll(assert, hash.hashNumber, NUMBERS);
  })
  
  test(".hashString()", (assert) => {
    assertAll(assert, hash.hashString, EMPTY);
    assertAll(assert, hash.hashString, STRINGS);
  })
  
})
  
var exportSuite = hashSuite;
export = exportSuite;