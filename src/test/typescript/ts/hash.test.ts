import qunit = require("../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import hash = require("../../../main/typescript/ts/hash")

var hashSuite = suite("ts/hash", (self) => {
 
  var NUMBERS: Array<[number, number]> = [
    [undefined, 0],
    [null, 0],
    [NaN, 0],
    [0, 0],
    [1, 1]
  ];
  
  function assertAll<Input, Output>(assert: qunit.Assert, f: (v: Input) => Output, data: Array<[Input, Output]>) {
    for (var i = 0, l = data.length; i < l; i++) {
      var pair = data[i];
      assert.strictEqual(f(pair[0]), pair[1]);
    }
  }

  self.setUp = () => {
    
  };
  
  test(".hashNumber()", (assert) => {
    assertAll(assert, hash.hashNumber, NUMBERS);
  })
  
})
  
var exportSuite = hashSuite;
export = exportSuite;