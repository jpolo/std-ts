import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import unit = require("../../../main/typescript/ts/unit")
import engine = require("../../../main/typescript/ts/unit/engine")
import TestEngine = engine.Engine
import unitAllTest from "./unit/_all.test"

//TODO move to qunit test
const AssertSuite = suite("ts/unit.Assert", (self) => {
  var engine = new TestEngine()
  var testCaseMock: unit.ITest
  var reportMock: unit.ITestReport
  var assertMock: Assert
  
  var bootstrapDone = false;
  function bootstrap() {
    if (!bootstrapDone) {
      bootstrapDone = true
      var assertions = []
      var testCaseMock = { category: "", name: "", run: () => {} }
      var reportMock = { assertions: assertions, startDate: new Date(), elapsedMilliseconds:0 }
      var assertMock = new Assert(engine, testCaseMock, reportMock)
      
      var i = iter()
      assertMock.ok(true)
      assertMock.ok(false)
      if (
        !unit.SUCCESS === assertions[i()].type ||
        !unit.FAILURE === assertions[i()].type
      ) {
        throw new Error('[Fatal] ts/unit.Assert seems broken')
      }
    }
  }

  function iter() {
    var i = 0
    return function () {
      return i++
    }
  }
  
  self.setUp = () => {
    //check that assert is working fine
    bootstrap()
      
    //init mock
    testCaseMock = { category: "", name: "", run: () => {} }
    reportMock = { assertions: [], startDate: new Date(), elapsedMilliseconds:0 }
    assertMock = new Assert(engine, testCaseMock, reportMock)
  }

  /*test("__position__()", (assert) => {
    var pos = assert.__position__();

    assert.ok(pos.lineNumber === 248);
    assert.ok(pos.columnNumber === 33);
  })*/

  test(".__engine__", (assert) => {
    var ng = assert.__engine__
    assert.ok(ng instanceof TestEngine)
  })
    
  test(".ok()", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.ok(true)
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.ok(false)
    assert.ok(assertions[i()].type == unit.FAILURE)
  })

  test(".strictEqual()", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.strictEqual(null, null)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.strictEqual(undefined, null)
    assert.ok(assertions[i()].type == unit.FAILURE)

    assertMock.strictEqual(1, 1)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.strictEqual<any>("1", 1)
    assert.ok(assertions[i()].type == unit.FAILURE)
    
    assertMock.strictEqual(NaN, NaN)
    assert.ok(assertions[i()].type == unit.SUCCESS)
  })

  test(".equal()", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.equal(null, null)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.equal(undefined, null)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.equal(1, 1)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.equal<any>("1", 1)
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.equal(NaN, NaN)
    assert.ok(assertions[i()].type == unit.SUCCESS)
  })

  test(".throws()", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.throws(() => {})
    assert.ok(assertions[i()].type == unit.FAILURE)

    assertMock.throws(() => { throw new TypeError() })
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.throws(() => { throw new TypeError() }, TypeError)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.throws(() => { throw new TypeError() }, Error)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.throws(() => { throw new Error() }, TypeError)
    assert.ok(assertions[i()].type == unit.FAILURE)
    
    assertMock.throws(() => { throw new Error("blah") }, "Error: blah")
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.throws(() => { throw new TypeError("blah") }, "TypeError: blah")
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.throws(() => { throw new Error("foo") }, "Error: blah")
    assert.ok(assertions[i()].type == unit.FAILURE)
  })

})

export default unitAllTest.concat(AssertSuite)
