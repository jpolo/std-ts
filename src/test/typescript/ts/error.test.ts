import unit = require("../../../main/typescript/ts/unit");
import suite = unit.suite;
import test = unit.test;
import error = require("../../../main/typescript/ts/error");
import BaseError = error.BaseError;

class ChildError extends error.BaseError {
  
}

var errorSuite = suite("ts/error.Error", (self) => {

  test(".new()", (assert) => {
    assert.strictEqual(error.Error, Error);
  })
  
})

var BaseErrorSuite = suite("ts/error.BaseError", (self) => {
  
  test(" extends BaseError", (assert) => {
    var err = new ChildError("my message");
    assert.instanceOf(err, Error);
    assert.instanceOf(err, BaseError);
    assert.instanceOf(err, ChildError);
    assert.strictEqual(err.name, "ChildError");
  })
  

  test(".new()", (assert) => {
    var err = new BaseError("my message");
    assert.instanceOf(err, Error);
    assert.instanceOf(err, BaseError);
  })
  
  test("#name", (assert) => {
    var err = new BaseError("foo");
    
    assert.strictEqual(err.name, "BaseError");
  })
  
  test("#stack", (assert) => {
    var err = new BaseError("foo");
    var stack = String(err.stack);
    var stackLines = stack.split("\n");
    
    assert.strictEqual(stackLines[0], "BaseError: foo");
    
    var prefix = "    at file:";
    assert.strictEqual(stackLines[1].slice(0, prefix.length), prefix);
  })
  
  /*
  test("#inspect()", (assert) => {
    var err = new BaseError("my message");
    assert.strictEqual(err.inspect(), "BaseError { my message }");
  })
  */
  
  test("#toString()", (assert) => {
    var err = new BaseError("my message");
    assert.strictEqual(err.toString(), "BaseError: my message");
  })
  
})

var allSuite = errorSuite.concat(BaseErrorSuite);
 
export = allSuite;