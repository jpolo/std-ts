import * as reflect from "../reflect"
import { SUCCESS, FAILURE, IAssertionCallSite, Assertion } from "./assertion"
import { ITestEngine, ITest, ITestReport, TestSuite, suiteDefault } from "../unit"


//TODO: be more compliant with http://qunitjs.com/upgrade-guide-2.x/

//Util
const __isExtensible = reflect.isExtensible
const __protoOf = reflect.getPrototypeOf
const ToString = function (o: any) { return "" + o; }
const ToStringTag = reflect.stringTag;
const ObjectKeys = reflect.ownKeys
const ObjectKeysSorted = function (o: any) { return ObjectKeys(o).sort() }
const ObjectExtend = function <A, B>(a: A, b: B): A & B {
  let returnValue: any = a
  for (let prop in b) {
    if (b.hasOwnProperty(prop)) {
      a[prop] = b[prop]
    }
  }
  return returnValue
}
const FunctionToString = (function () {
  const __fstring = Function.prototype.toString
  return function (f: Function) {
    return __fstring.call(f)
  }
}())
const FunctionToSource = function (f: Function) {
  let src = FunctionToString(f)
  return src.slice(src.indexOf("{"), -1).trim()
}

interface AssertFactory<T> {
  (ng: ITestEngine, t: ITest, r: ITestReport): T
}

const AssertFactoryDefault = function (ng: ITestEngine, t: ITest, r: ITestReport) {
  let helper = {

    getTest(): ITest {
      return t
    },

    getEngine(): ITestEngine {
      return ng
    },

    getPosition(offset = 0): IAssertionCallSite {
      return ng.callstack()[3 + offset]
    },

    assert(isSuccess: boolean, message: string, position: IAssertionCallSite) {
      let assertions = r.assertions
      if (!__isExtensible(assertions)) {
        throw new Error('Assertions were made after report creation in ' + t)
      }

      message = message || 'assertion should be true'

      assertions.push(
        new Assertion(isSuccess ? SUCCESS : FAILURE, t, message, position)
      )
      return isSuccess
    },

    dump(o: any): string {
      return ng.dump(o)
    }
  }

  let { assert } = helper

  let api = {

    /**
     * Assert that ```condition``` is ```true```
     */
    ok(condition: boolean, message?: string): boolean {
      return assert(!!condition, message, helper.getPosition())
    },

    /**
     * Assert that ```actual``` is strictly equal to ```expected```
     */
    strictEqual<T>(actual: T, expected: T, message?: string): boolean {
      return this._strictEqual(actual, expected, false, message, helper.getPosition())
    }
  }
  return api
}

function AssertFactoryExtend<A, B>(a: AssertFactory<A>, b: AssertFactory<B>): AssertFactory<A & B> {

  return function (ng: ITestEngine, t: ITest, r: ITestReport) {
    return ObjectExtend(ObjectExtend({}, a(ng, t, r)), b(ng, t, r))
  }
}

/**
 * Default suite
 */
let _suiteDefault = suiteDefault;
let _suiteCurrent = _suiteDefault;

export class Assert {
  constructor(
    public __engine__: ITestEngine,
    private _testCase: ITest,
    private _report: ITestReport
  ) { }

  /**
   * Assert that ```condition``` is ```true```
   */
  ok(condition: boolean, message?: string): boolean {
    return this.__assert__(!!condition, message, this.__position__())
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
    return this.__assert__(typeof o === type, message, this.__position__())
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
            isSuccess = __protoOf(actual) === __protoOf(expected) &&
              actual.name === expected.name &&
              actual.message === expected.message
            message = this.__dump__(actual) + ' thrown be like ' + this.__dump__(expected)
            break
          default:
            if (expected instanceof Error) {
              isSuccess = __protoOf(actual) === __protoOf(expected) &&
                actual.name === expected.name &&
                actual.message === expected.message
              message = this.__dump__(actual) + ' thrown be like ' + this.__dump__(expected)
            } else {
              isSuccess = actual === this.__engine__.testEqualsStrict(actual, expected)
              message = this.__dump__(actual) + ' thrown must be ' + this.__dump__(expected)
            }
        }
      }
    }
    return this.__assert__(isSuccess, message, position)
  }

  /**
   * Return a done() callback for asynchronous tests
   *
   * @returns {[type]} [description]
   */
  async(): () => void {
    //mark as asynchronous test

    return function done() {

    }
  }

  __assert__(isSuccess: boolean, message: string, position: IAssertionCallSite): boolean {
    let assertions = this._report.assertions
    if (!__isExtensible(assertions)) {
      throw new Error('Assertions were made after report creation in ' + this._testCase)
    }

    message = message || 'assertion should be true'

    assertions.push(
      new Assertion(isSuccess ? SUCCESS : FAILURE, this._testCase, message, position)
    )
    return isSuccess
  }

  __dump__(o: any): string {
    return this.__engine__.dump(o)
  }

  __position__(): IAssertionCallSite {
    return this.__engine__.callstack()[3]
  }

  protected _strictEqual(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' be ') + this.__dump__(o2))
    return this.__assert__(this.__engine__.testEqualsStrict(o1, o2) === !not, message, position)
  }

  protected _equal(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' equal ') + this.__dump__(o2))
    return this.__assert__(this.__engine__.testEquals(o1, o2) === !not, message, position)
  }

  protected _propEqual(o1: any, o2: any, not: boolean, message: string, position: IAssertionCallSite) {
    let engine = this.__engine__
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
    return this.__assert__(this.__engine__.testEqualsDeep(o1, o2) === !not, message, position)
  }
}

export function testc<IAssert>(
  AssertClass: { new(ng: ITestEngine, tc: ITest, r: ITestReport): IAssert }
) {
  return (name: string, f: (assert: IAssert, done?: () => void) => void) => {
    return _suiteCurrent
      .getTest(name)
      .addBlock(f, (ng, tc, r) => {
        return new AssertClass(ng, tc, r);
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

//internal type
type TestBlock = (assert: Assert, done?: () => void) => void

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
export function test(name: string, f: TestBlock): void {
  testc(Assert)(name, f);
}

/**
 * Create a test case but mark it as skipped
 *
 * @example
 * skip("my test", (assert) => { //put assertion here })
 */
export function skip(name: string, f: TestBlock): void {
  _suiteCurrent
    .getTest(name)
    .addBlock(f, (ng, tc, r) => { return null; }, true)
}
