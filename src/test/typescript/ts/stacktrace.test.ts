import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import stacktrace = require("../../../main/typescript/ts/stacktrace")
import ICallSite = stacktrace.ICallSite;

var stacktraceSuite = suite("ts/stacktrace", (self) => {
  var FILENAME = "stacktrace.test.js";
  var DATA = {
    ref: <Error> null,
    callstack: <ICallSite[]> null
  };

  //var callstack: ICallSite[];

  self.setUp = () => {
    
    (new Function(
      "stacktrace", "exports",
      //pseudo script
      "exports.ref = new Error();\n" + 
      "exports.callstack = stacktrace.create();\n"
    ))(stacktrace, DATA)
  }
  
  test("get()", (assert) => {
  
    var callstack = stacktrace.get(DATA.ref)
    var callsite = callstack[0]
    
    assert.ok(Array.isArray(callstack))
    assert.ok(callstack.length > 0)
    assert.strictEqual(callsite.getLineNumber(), 9)
    assert.strictEqual(typeof callsite.getColumnNumber(), 'number')
      
    assert.strictEqual(callsite.getFileName().slice(-FILENAME.length), FILENAME);
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);
  })
  
  
  test("create()", (assert) => {
    var callstack = DATA.callstack;
    var callsite = callstack[0]
    
    assert.ok(Array.isArray(callstack))
    assert.ok(callstack.length > 0)
    assert.strictEqual(callsite.getLineNumber(), 20)
    assert.strictEqual(typeof callsite.getColumnNumber(), 'number')
      
    assert.strictEqual(callsite.getFileName().slice(-FILENAME.length), FILENAME);
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);
    
    //Eval
    var stackEval: ICallSite = (new Function(
      "stacktrace", 
      "return stacktrace.create()"
    ))(stacktrace)[0];
    assert.strictEqual(stackEval.isEval(), true);
    
    
  })
  
})
  
export = stacktraceSuite