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
    assert.strictEqual(callsite.lineNumber, 7)
    assert.strictEqual(typeof callsite.columnNumber, 'number')
      
    var fileName = "stacktrace.test.js"
    assert.strictEqual(callsite.fileName.slice(-fileName.length), fileName)
    
  })
  
})
  
export = stacktraceSuite