import boot = require("./_boot.test")
import assertion = require("../../../../main/typescript/ts/unit/assertion")

var assertionSuite = boot.test("ts/unit/assertion", (assert) => {
  
  var assertionType = "SUCCESS";
  var message = "my message";
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
  var a = new assertion.Assertion(assertionType, null, message, position, "my stack");
  
  assert(a.type === assertionType, "assertion.type failure")
  assert(a.test ===  null, "assertion.test failure")
  assert(a.message === message, "assertion.message failure")
  assert(a.position === position, "assertion.position failure")  
  
});
export = assertionSuite;