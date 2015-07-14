import { test } from "./_boot.test"
import { ITest, ITestReport, IAssertion, SUCCESS, FAILURE } from "../../../../main/typescript/ts/unit"
import { Assert } from "../../../../main/typescript/ts/unit/qunit"
import { Engine } from "../../../../main/typescript/ts/unit/engine"

export default test("ts/unit/qunit.Assert", (assert) => {

  const engine = new Engine()
  const assertions: IAssertion[] = []
  const testMock: ITest = { category: "", name: "", run: () => {} }
  const reportMock = { assertions: assertions, startDate: new Date(), elapsedMilliseconds:0 }
  const assertMock = new Assert(engine, testMock, reportMock)

  function lastAssertion() {
    return assertions[assertions.length - 1];
  }

  function assertLastSuccess() {
    assert(lastAssertion().type === SUCCESS)
  }

  function assertLastFailure() {
    assert(lastAssertion().type === FAILURE)
  }

  //ok()
  assertMock.ok(true)
  assertLastSuccess()

  assertMock.ok(false)
  assertLastFailure()

  //strictEquals()
  assertMock.strictEqual(null, null)
  assertLastSuccess()

  assertMock.strictEqual(undefined, null)
  assertLastFailure()

  assertMock.strictEqual(1, 1)
  assertLastSuccess()

  assertMock.strictEqual<any>("1", 1)
  assertLastFailure()

  assertMock.strictEqual(NaN, NaN)
  assertLastSuccess()

  //equals()
  assertMock.equal(null, null)
  assertLastSuccess()

  assertMock.equal(undefined, null)
  assertLastSuccess()

  assertMock.equal(1, 1)
  assertLastSuccess()

  assertMock.equal<any>("1", 1)
  assertLastSuccess()

  assertMock.equal(NaN, NaN)
  assertLastSuccess()
  
})
