import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import stacktrace = require("../../../main/typescript/ts/stacktrace")
import ICallSite = stacktrace.ICallSite;

var stacktraceSuite = suite("ts/stacktrace", (self) => {

  test("create()", (assert) => {
  
    var callstack = stacktrace.create()
    var callsite = callstack[0]
    
    assert.ok(Array.isArray(callstack))
    assert.ok(callstack.length > 0)
    assert.strictEqual(callsite.getLineNumber(), 7)
    assert.strictEqual(typeof callsite.getColumnNumber(), 'number')
      
    var fileName = "stacktrace.test.js"
    assert.strictEqual(callsite.getFileName().slice(-fileName.length), fileName);
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);
    
    //Native
    var stackNative: ICallSite = null;
    try {
      String.prototype.search.apply(null);
    } catch (e) {
      stackNative = stacktrace.create()[0];
    }
    assert.strictEqual(stackNative.isNative(), true);
    
    //Eval
    var stackEval: ICallSite = null;
    try {
      eval(" throw new Error('foo') ");
    } catch (e) {
      stackEval = stacktrace.create()[0];
    }
    assert.strictEqual(stackEval.isEval(), true);
    
    
  })
  
})
  
export = stacktraceSuite