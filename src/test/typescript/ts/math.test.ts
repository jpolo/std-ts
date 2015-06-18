import qunit = require("../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import math = require("../../../main/typescript/ts/math")

var mathSuite = suite("ts/math", (self) => {
  
  function generate<Input, Return>(
    assert: qunit.Assert, 
    d: Array<[Input, Return]>,
    f: (v: Input) => Return,
    methodName: string
  ) {
    for (var i = 0, l = d.length; i < l; ++i) {
      var pair = d[i];
      var value = pair[0];
      var actual = f(pair[0]);
      var expected = pair[1];
      assert.strictEqual(actual, expected,  methodName + "(" + value + ") -> " + actual + " must be " + expected)
    }
  }
  
  test(".E", (assert) => {
    assert.strictEqual(math.E, Math.E);
  })
  
  test(".LN10", (assert) => {
    assert.strictEqual(math.LN10, Math.LN10);
  })
  
  test(".LN2", (assert) => {
    assert.strictEqual(math.LN2, Math.LN2);
  })
  
  test(".PI", (assert) => {
    assert.strictEqual(math.PI, Math.PI);
  })
  
  test(".abs()", (assert) => {
    var abs = math.abs;
    //Arity
    assert.strictEqual(abs.length, 1);
    
    //Number
    generate(assert, [
      [1, 1],
      [-1, 1],
      [0, 0],
      [NaN, NaN],
      [Infinity, Infinity],
      [-Infinity, Infinity]
    ], abs, "math.abs") 
  })
    
  test(".ceil()", (assert) => {
    var ceil = math.ceil;
    //Arity
    assert.strictEqual(ceil.length, 1);
    
    //Data
    generate(assert, [
      [1.2, 2],
      [1.7, 2],
      [-1.2, -1],
      [0, 0],
      [NaN, NaN],
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ], ceil, "math.ceil")
  })
    
  test(".exp()", (assert) => {
    var exp = math.exp;
    
    //Arity
    assert.strictEqual(exp.length, 1);
    
    //Data
    generate(assert, [
      [1.2, 3.3201169227365472],
      [-1.2, 0.30119421191220213 ],
      [0, 1],
      [NaN, NaN],
      [Infinity, Infinity],
      [-Infinity, 0]
    ], exp, "math.exp")
  })
    
  test(".floor()", (assert) => {
    var floor = math.floor;
    
    //Arity
    assert.strictEqual(floor.length, 1);
    
    //Data
    generate(assert, [
      [1.2, 1],
      [1.7, 1],
      [-1.2, -2],
      [0, 0],
      [NaN, NaN],
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ], floor, "math.floor")
  })
  
  test(".imul()", (assert) => {
    var imul = math.imul;
    
    //Arity
    assert.strictEqual(imul.length, 2);
    
    //Data
    /*generate(assert, [
      [0, true],
      [1.1, false],
      [1, false],
      [2, true],
      [3, false],
      [-1, false],
      [-1.1, false],
      [-2, true],
      [NaN, false],
      [Infinity, false],
      [-Infinity, false]
    ], math.imul, "math.imul")*/
  })
  
  test(".isEven()", (assert) => {
    var isEven = math.isEven;
    
    //Arity
    assert.strictEqual(isEven.length, 1);
    
    //Data
    generate(assert, [
      [0, true],
      [1.1, false],
      [1, false],
      [2, true],
      [3, false],
      [-1, false],
      [-1.1, false],
      [-2, true],
      [NaN, false],
      [Infinity, false],
      [-Infinity, false]
    ], isEven, "math.isEven")
  })
  
  test(".isOdd()", (assert) => {
    var isOdd = math.isOdd;
    
    //Arity
    assert.strictEqual(isOdd.length, 1);
    
    //Data
    generate(assert, [
      [0, false],
      [1.1, true],
      [1, true],
      [-1.1, true],
      [2, false],
      [-2, false],
      [NaN, false],
      [Infinity, false],
      [-Infinity, false]
    ], isOdd, "math.isOdd")
  })
    
  test(".round()", (assert) => {
    var round = math.round;
    
    //Arity
    assert.strictEqual(round.length, 1);
    
    //Data
    generate(assert, [
      [1.2, 1],
      [1.7, 2],
      [-1.2, -1],
      [0, 0],
      [NaN, NaN],
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ], round, "math.round")
  })

})
  
var exportSuite = mathSuite;
export = exportSuite;