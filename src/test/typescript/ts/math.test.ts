import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import math = require("../../../main/typescript/ts/math")

var mathSuite = suite("ts/math", (self) => {
  
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
    //Number
    [
      [1, 1],
      [-1, 1],
      [0, 0],
      [NaN, NaN],
      [Infinity, Infinity],
      [-Infinity, Infinity]
    ].forEach((pair) => {
      var value = pair[0]
      var actual = math.abs(pair[0])
      var expected = pair[1]
      assert.strictEqual(actual, expected, "math.abs(" + value + ") -> " + actual + " must be " + expected)
    });
      
  })
    
  test(".ceil()", (assert) => {
    [
      [1.2, 2],
      [1.7, 2],
      [-1.2, -1],
      [0, 0],
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ].forEach((pair) => {
      var value = pair[0]
      var actual = math.ceil(pair[0])
      var expected = pair[1]
      assert.strictEqual(actual, expected, "math.ceil(" + value + ") -> " + actual + " must be " + expected)
    })
    
  })
    
  test(".exp()", (assert) => {
    [
      [1.2, 3.3201169227365472],
      [-1.2, 0.30119421191220213 ],
      [0, 1],
      [Infinity, Infinity],
      [-Infinity, 0]
    ].forEach((pair) => {
      var value = pair[0]
      var actual = math.exp(value)
      var expected = pair[1]
      assert.strictEqual(actual, expected, "math.exp(" + value + ") -> " + actual + " must be " + expected)
    })
    
  })
    
  test(".floor()", (assert) => {
    //Number
    [
      [1.2, 1],
      [1.7, 1],
      [-1.2, -2],
      [0, 0],
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ].forEach((pair) => {
      var value = pair[0]
      var actual = math.floor(pair[0])
      var expected = pair[1]
      assert.strictEqual(actual, expected, "math.floor(" + value + ") -> " + actual + " must be " + expected)
    })
  })
    
  test("round()", (assert) => {
    //Number
    [
      [1.2, 1],
      [1.7, 2],
      [-1.2, -1],
      [0, 0],
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ].forEach((pair) => {
      var value = pair[0]
      var actual = math.round(pair[0])
      var expected = pair[1]
      assert.strictEqual(actual, expected, "math.round(" + value + ") -> " + actual + " must be " + expected)
    })
  })
    
  
})
  
export = mathSuite