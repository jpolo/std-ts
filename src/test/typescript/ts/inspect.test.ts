import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import inspect = require("../../../main/typescript/ts/inspect")

var inspectSuite = suite("ts/inspect.Inspect", (self) => {
  
  var inspectObj = new inspect.Inspect()
  
  test("inspect()", (assert) => {
    
    assert.strictEqual(inspectObj.inspect(undefined), 'undefined')
    assert.strictEqual(inspectObj.inspect(null), 'null')
    assert.strictEqual(inspectObj.inspect(true), 'true')
    assert.strictEqual(inspectObj.inspect(false), 'false')
    assert.strictEqual(inspectObj.inspect(123.4545), '123.4545')
    assert.strictEqual(inspectObj.inspect('foobar'), '"foobar"')
    assert.strictEqual(inspectObj.inspect('lorem ipsum "sorem" foo bar'), '"lorem ipsum \\"so..."')
    assert.strictEqual(inspectObj.inspect(Math.PI), '3.141592653589793')
    assert.strictEqual(inspectObj.inspect(new Date(0)), 'Date(1970-01-01T00:00:00.000Z)')
    assert.strictEqual(inspectObj.inspect(/abc/gi), '/abc/gi') 
    assert.strictEqual(inspectObj.inspect(function foo(a, b, c) { return 'blah' }), 'function foo(a, b, c) {...}')
      
    
  })
  
  
})
  
export = inspectSuite