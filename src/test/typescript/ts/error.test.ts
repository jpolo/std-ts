import unit = require("../../../main/typescript/ts/unit");
import test = unit.test;
import error = require("../../../main/typescript/ts/error");
import BaseError = error.BaseError;

class ChildError extends error.Error {}
class ChildEvalError extends error.EvalError {}
class ChildRangeError extends error.RangeError {}
class ChildReferenceError extends error.ReferenceError {}
class ChildTypeError extends error.TypeError {}
class ChildURIError extends error.URIError {}
class ChildBaseError extends BaseError {}

var ErrorSuite = unit.suite("ts/error.Error", (self) => {

  test("<extends>", (assert) => {
    var err = new ChildError("my message");
    assert.instanceOf(err, ChildError);
    assert.instanceOf(err, Error);
    assert.strictEqual(err.name, "ChildError");
  })
  
  test("#constructor()", (assert) => {
    assert.strictEqual(error.Error, Error);
    assert.instanceOf(new error.Error(), Error);
  })
  
})

var EvalErrorSuite = unit.suite("ts/error.EvalError", (self) => {

  test("<extends>", (assert) => {
    var err = new ChildEvalError("my message");
    assert.instanceOf(err, ChildEvalError);
    assert.instanceOf(err, EvalError);
    assert.instanceOf(err, Error);
    assert.strictEqual(err.name, "ChildEvalError");
  })
  
  test("#constructor()", (assert) => {
    assert.strictEqual(error.EvalError, EvalError);
    assert.instanceOf(new error.EvalError(), EvalError);
  })
  
})

var RangeErrorSuite = unit.suite("ts/error.RangeError", (self) => {

  test("<extends>", (assert) => {
    var err = new ChildRangeError("my message");
    assert.instanceOf(err, ChildRangeError);
    assert.instanceOf(err, RangeError);
    assert.instanceOf(err, Error);
    assert.strictEqual(err.name, "ChildRangeError");
  })
  
  test("#constructor()", (assert) => {
    assert.strictEqual(error.RangeError, RangeError);
    assert.instanceOf(new error.RangeError(), RangeError);
  })
  
})

var ReferenceErrorSuite = unit.suite("ts/error.ReferenceError", (self) => {

  test("<extends>", (assert) => {
    var err = new ChildReferenceError("my message");
    assert.instanceOf(err, ChildReferenceError);
    assert.instanceOf(err, ReferenceError);
    assert.instanceOf(err, Error);
    assert.strictEqual(err.name, "ChildReferenceError");
  })
  
  test("#constructor()", (assert) => {
    assert.strictEqual(error.ReferenceError, ReferenceError);
    assert.instanceOf(new error.ReferenceError(), ReferenceError);
  })
  
})

var TypeErrorSuite = unit.suite("ts/error.TypeError", (self) => {

  test("<extends>", (assert) => {
    var err = new ChildTypeError("my message");
    assert.instanceOf(err, ChildTypeError);
    assert.instanceOf(err, TypeError);
    assert.instanceOf(err, Error);
    assert.strictEqual(err.name, "ChildTypeError");
  })
  
  test("#constructor()", (assert) => {
    assert.strictEqual(error.TypeError, TypeError);
    assert.instanceOf(new error.TypeError(), TypeError);
  })
  
})

var URIErrorSuite = unit.suite("ts/error.URIError", (self) => {
  
  test("<extends>", (assert) => {
    var err = new ChildURIError("my message");
    assert.instanceOf(err, ChildURIError);
    assert.instanceOf(err, URIError);
    assert.instanceOf(err, Error);
    assert.strictEqual(err.name, "ChildURIError");
  })
  
  test("#constructor()", (assert) => {
    assert.strictEqual(error.URIError, URIError);
    assert.instanceOf(new error.URIError(), URIError);
  })
  
})

var BaseErrorSuite = unit.suite("ts/error.BaseError", (self) => {
  
  test("<extends>", (assert) => {
    var err = new ChildBaseError("my message");
    assert.instanceOf(err, Error);
    assert.instanceOf(err, BaseError);
    assert.instanceOf(err, ChildBaseError);
    assert.strictEqual(err.name, "ChildBaseError");
  })
  

  test("#constructor()", (assert) => {
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
console.warn(err.stack);
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

var allSuite = ErrorSuite.concat(
  EvalErrorSuite, 
  RangeErrorSuite, 
  ReferenceErrorSuite, 
  TypeErrorSuite, 
  URIErrorSuite, 
  BaseErrorSuite
);
 
export = allSuite;