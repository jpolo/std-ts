import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import { ITest, ITestReport, SUCCESS, FAILURE } from "../../../main/typescript/ts/unit"
import engine = require("../../../main/typescript/ts/unit/engine")
import TestEngine = engine.Engine
import unitAllTest from "./unit/_all.test"

//TODO move to qunit test
const AssertSuite = suite("ts/unit.Assert", (self) => {
  let engine = new TestEngine()
  let testCaseMock: ITest
  let reportMock: ITestReport
  let assertMock: Assert
  
  let bootstrapDone = false;
  function bootstrap() {
    if (!bootstrapDone) {
      bootstrapDone = true
      let assertions = []
      let testCaseMock = { category: "", name: "", run: () => {} }
      let reportMock = { assertions: assertions, startDate: new Date(), elapsedMilliseconds:0 }
      let assertMock = new Assert(engine, testCaseMock, reportMock)
      
      let i = iter()
      assertMock.ok(true)
      assertMock.ok(false)
      if (
        SUCCESS !== assertions[i()].type ||
        FAILURE !== assertions[i()].type
      ) {
        throw new Error('[Fatal] ts/unit.Assert seems broken')
      }
    }
  }

  function iter() {
    let i = 0
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
    let pos = assert.__position__();

    assert.ok(pos.lineNumber === 248);
    assert.ok(pos.columnNumber === 33);
  })*/

  test(".__engine__", (assert) => {
    let ng = assert.__engine__
    assert.ok(ng instanceof TestEngine)
  })
    
  test(".ok()", (assert) => {
    let assertions = reportMock.assertions
    let i = iter()
    assertMock.ok(true)
    assert.ok(assertions[i()].type == SUCCESS)
    
    assertMock.ok(false)
    assert.ok(assertions[i()].type == FAILURE)
  })

  test(".strictEqual()", (assert) => {
    let assertions = reportMock.assertions
    let i = iter()
    assertMock.strictEqual(null, null)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.strictEqual(undefined, null)
    assert.ok(assertions[i()].type == FAILURE)

    assertMock.strictEqual(1, 1)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.strictEqual<any>("1", 1)
    assert.ok(assertions[i()].type == FAILURE)
    
    assertMock.strictEqual(NaN, NaN)
    assert.ok(assertions[i()].type == SUCCESS)
  })

  test(".equal()", (assert) => {
    let assertions = reportMock.assertions
    let i = iter()
    assertMock.equal(null, null)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.equal(undefined, null)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.equal(1, 1)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.equal<any>("1", 1)
    assert.ok(assertions[i()].type == SUCCESS)
    
    assertMock.equal(NaN, NaN)
    assert.ok(assertions[i()].type == SUCCESS)
  })

  test(".throws()", (assert) => {
    let assertions = reportMock.assertions
    let i = iter()
    assertMock.throws(() => {})
    assert.ok(assertions[i()].type == FAILURE)

    assertMock.throws(() => { throw new TypeError() })
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.throws(() => { throw new TypeError() }, TypeError)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.throws(() => { throw new TypeError() }, Error)
    assert.ok(assertions[i()].type == SUCCESS)

    assertMock.throws(() => { throw new Error() }, TypeError)
    assert.ok(assertions[i()].type == FAILURE)
    
    assertMock.throws(() => { throw new Error("blah") }, "Error: blah")
    assert.ok(assertions[i()].type == SUCCESS)
    
    assertMock.throws(() => { throw new TypeError("blah") }, "TypeError: blah")
    assert.ok(assertions[i()].type == SUCCESS)
    
    assertMock.throws(() => { throw new Error("foo") }, "Error: blah")
    assert.ok(assertions[i()].type == FAILURE)
  })

})

export default unitAllTest.concat(AssertSuite)
