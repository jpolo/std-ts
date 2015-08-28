import * as reflect from "../reflect"
import * as stacktrace from "../stacktrace"
import { SUCCESS, FAILURE, IAssertionCallSite, IAssertion, Assertion } from "./assertion"
import { ITestEngine, ITest, ITestReport, ITestParams } from "../unit"
import {
  IsExtensible,
  IsFinite,
  IsEmpty,
  IsNaN,
  IsNumber,
  IsObject,
  GetPrototypeOf,
  SameValue,
  ObjectKeys,
  ObjectKeysSorted,
  ObjectFreeze,
  ToString,
  ToStringTag,
  Type,
  FunctionToString,
  FunctionToSource
} from "./util"

//TODO: be more compliant with http://qunitjs.com/upgrade-guide-2.x/

interface IAssertContext {
  isAsync(): boolean
  setAsync(b: boolean): void
  getTest(): ITest
  getEngine(): ITestEngine
  getPosition(offset?: number): IAssertionCallSite
  //open(): void
  write(isSuccess: boolean, message: string, position: IAssertionCallSite): boolean
  close(): void
  dump(o: any): string
}

interface IAssertFactory<T> {
  (context: IAssertContext): T
}

interface IAssertConstructor<T> {
  new (context: IAssertContext): T
}

interface IStreamController<T> {
  desiredSize: number
  enqueue(chunk: T): void
  close(): void
  error(e: any): void
}

interface ITestBlock<IAssert> {
  block(assert: IAssert, complete?: () => void): void
  assertFactory(ctx: IAssertContext): IAssert
  disabled: boolean
}

/**
 * Default suite
 */
let _suiteDefault: TestSuite = null;
let _suiteCurrent = _suiteDefault;

const AssertContextCreate = function (ng: ITestEngine, t: ITest, r: ITestReport): IAssertContext {
  let _async = false
  let _expected: number = null
  let _closed = false
  return {
    /**
     * Return true if the test is marked as asynchronous
     *
     * @return the async state
     */
    isAsync(): boolean {
      return _async
    },

    setAsync(b: boolean): void {
      _async = b
    },

    /**
     * Return the current test
     *
     * @return the test
     */
    getTest(): ITest {
      return t
    },

    /**
     * Return the current Engine
     *
     * @return the engine
     */
    getEngine(): ITestEngine {
      return ng
    },

    /**
     * Return the current callsite
     *
     * @param offset optional offset from stacktrace
     * @return the callsite
     */
    getPosition(offset = 0): IAssertionCallSite {
      return ng.callstack()[3 + offset]
    },

    //open(): void {  },

    /**
     * Write a new assertion is the assertion stream
     *
     * @param isSuccess true for success, false for failure
     * @param message optional assertion message
     * @param position code position hint
     * @return the isSuccess
     */
    write(isSuccess: boolean, message: string, position: IAssertionCallSite): boolean {
      let test = t
      if (_closed || !IsExtensible(r.assertions)) {
        throw new Error('Assertions were made after report creation in ' + test)
      }

      message = message || 'assertion should be true'

      r.assertions.push(
        new Assertion(isSuccess ? SUCCESS : FAILURE, test, message, position)
      )
      return isSuccess
    },

    /**
     * Close the assertion stream
     */
    close(): void {
      if (!_closed) {
        _closed = true
      }
    },

    /**
     * Return a human readable string representation
     *
     * @param o the object
     * @return the object representation
     */
    dump(o: any): string {
      return ng.dump(o)
    }
  }
}

export class Assert {
  protected _asyncCount = 0

  constructor(protected _context: IAssertContext) {}

  /**
   * Assert that ```condition``` is ```true```
   */
  ok(condition: boolean, message?: string): boolean {
    return this.__assert__(!!condition, message, this.__position__())
  }

  /**
   * Assert that ```condition``` is ```false```
   */
  notOk(condition: boolean, message?: string): boolean {
    return this.__assert__(!condition, message, this.__position__())
  }

  /**
   * Assert that ```actual``` is strictly equal to ```expected```
   */
  strictEqual<T>(actual: T, expected: T, message?: string): boolean {
    return this._strictEqual(actual, expected, false, message, this.__position__())
  }

  /**
   * Assert that ```actual``` is not strictly equal to ```expected```
   */
  notStrictEqual<T>(actual: T, expected: T, message?: string): boolean {
    return this._strictEqual(actual, expected, true, message, this.__position__())
  }

  /**
   * Assert that ```actual``` is equal to ```expected```
   */
  equal<T>(actual: T, expected: T, message?: string): boolean {
    return this._equal(actual, expected, false, message, this.__position__())
  }

  /**
   * Assert that ```actual``` is not equal to ```expected```
   */
  notEqual<T>(actual: T, expected: T, message?: string): boolean {
    return this._equal(actual, expected, true, message, this.__position__())
  }

  /**
   * Assert that ```actual``` and ```expected``` has the same properties
   */
  propEqual(actual: any, expected: any, message?: string): boolean {
    return this._propEqual(actual, expected, false, message, this.__position__())
  }

  /**
   * Assert that ```actual``` and ```expected``` has not the same properties
   */
  notPropEqual(actual: any, expected: any, message?: string): boolean {
    return this._propEqual(actual, expected, false, message, this.__position__())
  }

  /**
   * Assert that ```actual``` and ```expected``` are deeply equals
   */
  deepEqual(actual: any, expected: any, message?: string): boolean {
    return this._deepEqual(actual, expected, false, message, this.__position__())
  }

  /**
   * Assert that ```actual``` and ```expected``` are not deeply equals
   */
  notDeepEqual(actual: any, expected: any, message?: string): boolean {
    return this._deepEqual(actual, expected, true, message, this.__position__())
  }

  /**
   * Assert that ```typeof o``` is ```type```
   */
  typeOf(o: any, type: string, message?: string): boolean {
    return this.__assert__(Type(o) === type, message, this.__position__())
  }

  /**
   * Assert that ```o instanceof constructor```
   */
  instanceOf(o: any, Class: Function, message?: string): boolean {
    return this.__assert__(o instanceof Class, message, this.__position__())
  }

  /**
   * Assert that ```block()``` throw an ```expected``` error
   */
  throws(block: () => void, expected?: any, message?: string): boolean {
    let isSuccess = false
    let position = this.__position__()
    let actual
    message = message || ('`' + FunctionToSource(block) + '` must throw an error')
    try {
      block()
    } catch (e) {
      isSuccess = true
      actual = e
    }

    if (actual) {
      isSuccess = false
      if (!expected) {
        isSuccess = true
      } else {
        switch (ToStringTag(expected)) {
          case 'String':
            let actualStr = ToString(actual)
            isSuccess = actualStr == expected
            message = this.__dump__(actualStr) + ' thrown must be ' + this.__dump__(expected)
            break
          case 'Function':
            isSuccess = actual instanceof expected
            message = this.__dump__(actual) + ' thrown must be instance of ' + this.__dump__(expected)
            break
          case 'RegExp':
            isSuccess = expected.test(ToString(actual))
            message = this.__dump__(actual) + ' thrown must match ' + this.__dump__(expected)
            break
          case 'Object':
            isSuccess = GetPrototypeOf(actual) === GetPrototypeOf(expected) &&
              actual.name === expected.name &&
              actual.message === expected.message
            message = this.__dump__(actual) + ' thrown be like ' + this.__dump__(expected)
            break
          default:
            if (expected instanceof Error) {
              isSuccess = GetPrototypeOf(actual) === GetPrototypeOf(expected) &&
                actual.name === expected.name &&
                actual.message === expected.message
              message = this.__dump__(actual) + ' thrown be like ' + this.__dump__(expected)
            } else {
              isSuccess = actual === this.__engine__().testEqualsStrict(actual, expected)
              message = this.__dump__(actual) + ' thrown must be ' + this.__dump__(expected)
            }
        }
      }
    }
    return this.__assert__(isSuccess, message, position)
  }

  /**
   * Instruct to wait for an asynchronous operation.
   *
   * @return a done() callback
   */
  async(): () => void {
    //mark as asynchronous test
    let assert = this
    let context = this._context
    context.setAsync(true)
    assert._asyncCount++

    return function done() {
      assert._asyncCount--
      if (assert._asyncCount === 0) {
        context.close()
      }
    }
  }

  /**
   * Specify how many assertions are expected to run within a test
   *
   * @param count the expected number of assertions
   */
  expect(count: number): void {
    console.warn("Assert#expect() not implemented")
  }

  __assert__(isSuccess: boolean, message: string, position: IAssertionCallSite): boolean {
    this._context.write(isSuccess, message, position)
    return isSuccess
  }

  __dump__(o: any): string {
    return this._context.dump(o)
  }

  protected __position__(): IAssertionCallSite {
    return this._context.getPosition(1)
  }

  protected __engine__() {
    return this._context.getEngine()
  }

  protected _strictEqual(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' be ') + this.__dump__(o2))
    return this.__assert__(this.__engine__().testEqualsStrict(o1, o2) === !not, message, position)
  }

  protected _equal(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' equal ') + this.__dump__(o2))
    return this.__assert__(this.__engine__().testEquals(o1, o2) === !not, message, position)
  }

  protected _propEqual(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    let engine = this.__engine__()
    message = message || (this.__dump__(o1) + (' must have same properties as ') + this.__dump__(o2))

    //TODO move to equal module
    let keys1 = ObjectKeysSorted(o1)
    let keys2 = ObjectKeysSorted(o2)
    let isSuccess = true
    for (let i = 0, l = keys1.length; i < l; ++i) {
      let key1 = keys1[i]
      let key2 = keys2[i]
      if (key1 === key2 && !engine.testEqualsStrict(o1[key1], o2[key2])) {
        isSuccess = false
        break
      }
    }
    return this.__assert__(isSuccess, message, position)
  }

  protected _deepEqual(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    message = message || (this.__dump__(o1) + (' must equals ') + this.__dump__(o2))
    return this.__assert__(this.__engine__().testEqualsDeep(o1, o2) === !not, message, position)
  }
}

export class Test implements ITest {

  public category: string = ""
  public blocks: ITestBlock<any>[] = []

  constructor(
    public suite: TestSuite,
    public name: string
  ) { }

  protected _beforeRun() {
    let suite = this.suite
    if (suite.setUp) {
      suite.setUp(this)
    }
  }

  protected _afterRun() {
    let suite = this.suite
    if (suite.tearDown) {
      suite.tearDown(this)
    }
  }

  addBlock<IAssert>(
    block: (assert: IAssert, done?: () => void) => void,
    assertFactory: IAssertFactory<IAssert>,
    disabled: boolean = false
  ): Test {
    this.blocks.push({
      block: block,
      assertFactory: assertFactory,
      disabled: disabled
    });
    return this
  }

  run(engine: ITestEngine, params: ITestParams, complete: (report: ITestReport) => void) {
    let test = this
    let blocks = this.blocks
    let blockc = blocks.length
    let startTime = engine.now()
    let assertions: IAssertion[] = []
    let report: ITestReport = {
      startDate: new Date(startTime),
      elapsedMilliseconds: NaN,
      assertions: assertions
    }
    let assertionStream: IStreamController<IAssertion> = {
      desiredSize: 1,
      enqueue(a: IAssertion) {
        assertions.push(a);
      },
      error(e: any) {

      },
      close() {
        //finalize report
        report.elapsedMilliseconds = engine.now() - startTime
        ObjectFreeze(assertions)
      }
    };

    let timeoutMs = params.timeout || Infinity;//no timeout

    //finish test and send to callback
    let onBlockComplete = () => {
      if (--blockc === 0) {
        //finalize report
        assertionStream.close()
        ObjectFreeze(report)
        complete(report)
      }
    }

    let runBlock = (testBlock: ITestBlock<any>, complete: () => void) => {
      let block = testBlock.block;
      let assertContext = AssertContextCreate(engine, test, report);
      let assert = testBlock.assertFactory(assertContext);
      if (block.length >= 2) {
        //asynchronous
        assertContext.setAsync(true)
      }
      let isFinished = false
      let timerId = null

      let onTimeout = () => {
        timerId = null
        assertionStream.enqueue(Assertion.error(test, "No test completion after " + timeoutMs + "ms", null, null))
        complete()
      }

      let onComplete = () => {
        if (!isFinished) {
          isFinished = true
          if (timerId) {
            clearTimeout(timerId)
            timerId = null
          }

          if (assertions.length === 0) {
            assertionStream.enqueue(Assertion.warning(test, "No assertion found", null))
          }

          this._afterRun()
          complete()
        }
      }

      try {
        this._beforeRun()
        if (assertContext.isAsync()) {
          if (IsFinite(timeoutMs)) {
            timerId = setTimeout(onTimeout, timeoutMs)
          }
          block(assert, onComplete)
        } else {
          block(assert)
        }
      } catch (e) {
        //TODO get stacktrace from engine
        let parsed = e ? stacktrace.get(e) : null;
        assertionStream.enqueue(Assertion.error(test, e.message, parsed && parsed[0], e.stack || e.message || null))
      } finally {
        if (!assertContext.isAsync()) {
          onComplete()
        }
      }
    }

    for (let block of blocks) {
      runBlock(block, onBlockComplete)
    }
  }

  inspect() {
    return "Test {" + this.toString() + " }"
  }

  toString() {
    let category = this.category
    return (category ? category : '') + this.name
  }
}

export class TestSuite {
  public setUp: (test?: Test) => void
  public tearDown: (test?: Test) => void
  public tests: Test[] = []
  private _byNames: {[name: string]: Test} = {}

  constructor(
    public name: string
  ) { }

  getTest(name: string) {
    let byNames = this._byNames
    let test = byNames[name]
    if (!test) {
      test = byNames[name] = new Test(this, name)
      this.tests.push(test)
      test.category = this.name
    }
    return test;
  }
}

export function testc<IAssert>(AssertClass: IAssertConstructor<IAssert>) {
  return (name: string, f: (assert: IAssert, done?: () => void) => void) => {
    return _suiteCurrent
      .getTest(name)
      .addBlock(f, (ctx: IAssertContext) => {
        return new AssertClass(ctx);
      })
  }
}

/**
 * Create a test suite and call ```f(suite)```
 *
 * @example
 * suite("my suite", (self) => { //put test declaration here })
 */
export function suite(name: string, f: (self?: TestSuite) => void): ITest[]  {
  let suitePrevious = _suiteCurrent;
  let suiteNew = new TestSuite(name);
  //let testFactory = function (name, f) {
  //  return suiteNew.getTest(name).addBlock(f, (ng, tc, r) => { return new Assert(ng, tc, r); })
  //}

  _suiteCurrent = suiteNew;
  try {
    f(suiteNew)
  } finally {
    _suiteCurrent = suitePrevious
  }
  return suiteNew.tests
}

/**
 * Create a test case and call ```f(assert, done?)```
 *
 * @example
 * //Synchronous
 * test("my test", (assert) => { //put assertion here })
 *
 * @example
 * //Asynchronous
 * test("my test", (assert, done) => { ...;done();...  })
 */
export function test(name: string, f: (assert: Assert, done?: () => void) => void): void {
  testc(Assert)(name, f);
}

/**
 * Create a test case but mark it as skipped
 *
 * @example
 * skip("my test", (assert) => { //put assertion here })
 */
export function skip(name: string, f: (assert: any, done?: () => void) => void): void {
  _suiteCurrent
    .getTest(name)
    .addBlock(f, (ctx) => { return null }, true)
}
