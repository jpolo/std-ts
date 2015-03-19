import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import stacktrace = require("../../../main/typescript/ts/stacktrace")
import ICallSite = stacktrace.ICallSite;

var stacktraceSuite = suite("ts/stacktrace", (self) => {
  var FILENAME = "stacktrace.test.js";
  var DATA = {
    error: null,
    callstack:null
  };
  
  var errorEval: Error;
  var callstackEval: ICallSite[];
  
  var errorLocal: Error;
  var callstackLocal: ICallSite[];
  
  var errorNative: Error;

  self.setUp = () => {
    errorLocal = new Error();
    callstackLocal = stacktrace.create();
    
    try {
      Number.prototype.toFixed.call({});
    } catch (e) {
      errorNative = e;
    }
    
    
    //put in eval block so we can test line number
    (new Function(
      "stacktrace", "exports",
      //pseudo script
      "exports.error = new Error();\n" + 
      "exports.callstack = stacktrace.create();\n"
    ))(stacktrace, DATA)
    errorEval = DATA.error;
    callstackEval = DATA.callstack;
  }
  
  test("get()", (assert) => {
  
    //Normal
    var callstack = stacktrace.get(errorLocal);
    var callsite = callstack[0];
    assert.strictEqual(callsite.getFileName().slice(-FILENAME.length), FILENAME);
    assert.strictEqual(typeof callsite.getLineNumber(), "number");
    assert.strictEqual(typeof callsite.getColumnNumber(), "number");
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);
    
    //Native
    callstack = stacktrace.get(errorNative)
    callsite = callstack[0]
    
    assert.ok(Array.isArray(callstack));
    assert.ok(callstack.length > 0);
    assert.strictEqual(callsite.getFileName(), "native");
    assert.strictEqual(callsite.getLineNumber(), null);
    assert.strictEqual(callsite.getColumnNumber(), null);
    assert.strictEqual(callsite.isNative(), true);
    assert.strictEqual(callsite.isEval(), false);
    
    //Eval
    callstack = stacktrace.get(errorEval)
    callsite = callstack[0]
    assert.ok(Array.isArray(callstack));
    assert.ok(callstack.length > 0);
    assert.strictEqual(callsite.getLineNumber(), 1);
    assert.strictEqual(callsite.getColumnNumber(), 17);
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), true);
  })
  
  
  test("create()", (assert) => {
    
    //Normal
    var callstack = callstackLocal;
    var callsite = callstack[0];
    assert.strictEqual(callsite.getFileName().slice(-FILENAME.length), FILENAME);
    assert.strictEqual(typeof callsite.getLineNumber(), "number");
    assert.strictEqual(typeof callsite.getColumnNumber(), "number");
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);
    
    //Eval
    callstack = callstackEval;
    callsite = callstack[0]
    assert.ok(Array.isArray(callstack))
    assert.ok(callstack.length > 0)
    assert.strictEqual(callsite.getLineNumber(), 2)
    assert.strictEqual(callsite.getColumnNumber(), 32)
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), true);

    
    
  })
  
})
  
export = stacktraceSuite