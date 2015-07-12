import * as reflect from "../reflect"
import { SUCCESS, FAILURE, IAssertionCallSite, Assertion } from "./assertion"
import { ITestEngine, ITest, ITestReport, TestSuite, suiteDefault } from "../unit"

//Util
const __protoOf = reflect.getPrototypeOf;
const __str = function (o: any) { return "" + o; };
const __stringTag = reflect.stringTag;
const __keys = reflect.ownKeys;
const __keysSorted = function (o: any) { return __keys(o).sort(); };
const __fstring = Function.prototype.toString;
const __fnSource = function (f: Function) { return __fstring.call(f).slice(13, -1).trim(); };


export class Assert {
  constructor(
    public __engine__: ITestEngine,
    private _testCase: ITest,
    private _report: ITestReport
  ) { }

  ok(o: boolean, message?: string): boolean {
    return this.__assert__(!!o, message, this.__position__())
  }

  strictEqual<T>(actual: T, expected: T, message?: string): boolean {
    return this._strictEqual(actual, expected, false, message, this.__position__())
  }

  notStrictEqual<T>(actual: T, expected: T, message?: string): boolean {
    return this._strictEqual(actual, expected, true, message, this.__position__())
  }

  equal<T>(actual: T, expected: T, message?: string): boolean {
    return this._equal(actual, expected, false, message, this.__position__())
  }

  notEqual<T>(actual: T, expected: T, message?: string): boolean {
    return this._equal(actual, expected, true, message, this.__position__())
  }

  propEqual(actual: any, expected: any, message?: string): boolean {
    return this._propEqual(actual, expected, false, message, this.__position__())
  }

  notPropEqual(actual: any, expected: any, message?: string): boolean {
    return this._propEqual(actual, expected, false, message, this.__position__())
  }

  deepEqual(actual: any, expected: any, message?: string): boolean {
    return this._deepEqual(actual, expected, false, message, this.__position__())
  }

  notDeepEqual(actual: any, expected: any, message?: string): boolean {
    return this._deepEqual(actual, expected, true, message, this.__position__())
  }

  typeOf(o: any, type: string, message?: string): boolean {
    return this.__assert__(typeof o === type, message, this.__position__())
  }

  instanceOf(o: any, constructor: Function, message?: string): boolean {
    return this.__assert__(o instanceof constructor, message, this.__position__())
  }

  throws(block: () => void, expected?: any, message?: string): boolean {
    var isSuccess = false
    var position = this.__position__()
    var actual
    message = message || ('`' + __fnSource(block) + '` must throw an error')
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
        switch (__stringTag(expected)) {
          case 'String':
            var actualStr = __str(actual)
            isSuccess = actualStr == expected
            message = this.__dump__(actualStr) + ' thrown must be ' + this.__dump__(expected)
            break
          case 'Function':
            isSuccess = actual instanceof expected
            message = this.__dump__(actual) + ' thrown must be instance of ' + this.__dump__(expected)
            break
          case 'RegExp':
            isSuccess = expected.test(__str(actual))
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

  __assert__(isSuccess: boolean, message: string, position: IAssertionCallSite): boolean {
    var assertions = this._report.assertions
    if (!reflect.isExtensible(assertions)) {
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
    var engine = this.__engine__
    message = message || (this.__dump__(o1) + (' must have same properties as ') + this.__dump__(o2))
    var keys1 = __keysSorted(o1)
    var keys2 = __keysSorted(o2)
    var isSuccess = true
    for (var i = 0, l = keys1.length; i < l; ++i) {
      var key1 = keys1[i]
      var key2 = keys2[i]
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
 * Default suite
 */
var _suiteDefault = suiteDefault;
var _suiteCurrent = _suiteDefault;

export function suite(
  name: string,
  f: (
    self?: TestSuite//, 
    //test?: (
    //  name: string,
    //  f: (assert: Assert, done?: () => void) => void
    //) => void
  ) => void
): ITest[]  {
  var suitePrevious = _suiteCurrent;
  var suiteNew = new TestSuite(name);
  //var testFactory = function (name, f) {
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

export function test(
  name: string,
  f: (assert: Assert, done?: () => void) => void
): void {
  testc(Assert)(name, f);
}

export function skip(
  name: string,
  f: (assert: Assert, done?: () => void) => void
): void {
  _suiteCurrent
    .getTest(name)
    .addBlock(f, (ng, tc, r) => { return null; }, true)
}
