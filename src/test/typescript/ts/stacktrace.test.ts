import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import stacktrace = require("../../../main/typescript/ts/stacktrace")

var stacktraceSuite = suite("ts/stacktrace", (self) => {

  test("create()", (assert) => {
  
    var callstack = stacktrace.create()
    var callsite = callstack[0]
    
    assert.ok(Array.isArray(callstack))
    assert.ok(callstack.length > 0)
    assert.strictEqual(callsite.getLineNumber(), 7)
    assert.strictEqual(typeof callsite.getColumnNumber(), 'number')
      
    var fileName = "stacktrace.test.js"
    assert.strictEqual(callsite.getFileName().slice(-fileName.length), fileName)
    
  })
  
})
  
export = stacktraceSuite