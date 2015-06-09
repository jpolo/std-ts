import boot = require("./_boot.test")
import assertion = require("../../../../main/typescript/ts/unit/assertion")
import stacktrace = require("../../../../main/typescript/ts/stacktrace")

var assertionSuite = boot.test("ts/unit/assertion", (assert) => {
  
  var position: assertion.IAssertionCallSite = {
    getThis() { return null; },
    getTypeName() { return ""; },
    getFunction() { return null; },
    getFunctionName() { return ""; },
    getMethodName() { return ""; },
    getFileName() { return ""; },
    getLineNumber() { return -1; },
    getColumnNumber() { return -1; },
    getEvalOrigin() { return null; },
    isTopLevel() { return false; },
    isEval() { return false; },
    isNative() { return false; },
    isConstructor() { return false; },
    getArguments() { return []; }, // {[key: number]: any; length: number}
    toString() { return ""; }
  };
  var a = new assertion.Assertion("TOTO", null, "my message", position, "my stack");
  
  assert(a.type === "TOTO", "assertion.type error")
  assert(a.test ===  null, "assertion.test error")
  assert(a.message === "my message", "assertion.message error")
  assert(a.position === position, "assertion.position error")  
  
});
var exportSuite = assertionSuite;
export = exportSuite;