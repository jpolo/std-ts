import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import {
  E, LN10, LN2, PI,
  abs, ceil, exp, floor, isEven, isOdd, imul, round
} from "../../../main/typescript/ts/math"

export default suite("ts/math", (self) => {
  
  function generate<Input, Return>(
    assert: Assert, 
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
    assert.strictEqual(E, E);
  })
  
  test(".LN10", (assert) => {
    assert.strictEqual(LN10, LN10);
  })
  
  test(".LN2", (assert) => {
    assert.strictEqual(LN2, LN2);
  })
  
  test(".PI", (assert) => {
    assert.strictEqual(PI, PI);
  })
  
  test(".abs()", (assert) => {
    
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
    ], abs, "abs") 
  })
    
  test(".ceil()", (assert) => {
    
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
    ], ceil, "ceil")
  })
    
  test(".exp()", (assert) => {
    
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
    ], exp, "exp")
  })
    
  test(".floor()", (assert) => {
    
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
    ], floor, "floor")
  })
  
  test(".imul()", (assert) => {
    
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
    ], imul, "imul")*/
  })
  
  test(".isEven()", (assert) => {
    
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
    ], isEven, "isEven")
  })
  
  test(".isOdd()", (assert) => {
    
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
    ], isOdd, "isOdd")
  })
    
  test(".round()", (assert) => {
    
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
    ], round, "round")
  })

})