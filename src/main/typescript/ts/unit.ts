import inspect = require("ts/inspect")
import reflect = require("ts/reflect")
import stacktrace = require("ts/stacktrace")
import ICallSite = stacktrace.ICallSite
import Inspector = inspect.Inspector

module unit {

  //Constant
  var FLOAT_EPSILON = 1e-5;
  var TEST_TIMEOUT = 2000;//ms

  //Util
  var __equalsFloat = function (a: number, b: number, epsilon: number) {
    return (
      __isNaN(b) ? __isNaN(a) :
      __isNaN(a) ? false :
      !__isFinite(b) && !__isFinite(a) ? (b > 0) == (a > 0) :
      Math.abs(a - b) < epsilon
    )
  };
  var __fstring = Function.prototype.toString;
  var __fnSource = function (f: Function) { return __fstring.call(f).slice(13, -1).trim(); };
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' };
  var __freeze = reflect.freeze;
  var __isFinite = isFinite;
  var __isNaN = function (o: any) { return o !== o; };
  var __isNumber = function (o) { return typeof o === 'number'; };
  var __isObject = function (o) { return o != null && (typeof o == "object"); };
  var __keys = reflect.ownKeys;
  var __keysSorted = function (o) { return __keys(o).sort(); };
  var __str = function (o) { return "" + o; };
  var __stringTag = reflect.stringTag;

  //Service
  type $Equal = { 
    is(lhs: any, rhs: any): boolean
    equals(lhs: any, rhs: any): boolean
    equalsNear(lhs: any, rhs: any, epsilon: any): boolean
    equalsDeep(lhs: any, rhs: any): boolean
  }
  type $Inspector = inspect.IInspector
  type $Stacktrace = { create(): ICallSite[] }
  type $Time = { now(): number }
  
  var $equalDefault: $Equal = {
    is: (a, b) => { 
      return (
        a === 0 && b === 0 ? 1 / a === 1 / b :
        a === b ? true :
        __isNaN(a) && __isNaN(b) ? true :
        false
      )
    },
    equals: (a, b) => {
      return (
        $equalDefault.is(a, b) ||
        (
          (a != null) && a.equals ? a.equals(b) :
          (b != null) && b.equals ? b.equals(a) :
          a == b
        )
      )
    },
    equalsNear: (a: any, b: any, epsilon: number) => {
      var isnum1 = __isNumber(a)
      var isnum2 = __isNumber(b)
      return (
        (isnum1 || isnum2) ? (isnum1 === isnum2) && (a == b || __equalsFloat(a, b, epsilon)) :
        (a != null && a.nearEquals) ? a.nearEquals(b) :
        (b != null && b.nearEquals) ? b.nearEquals(a) :
        false
      )
    },
    equalsDeep: (a, b) => {
      function equalsStrict(a: any, b: any) { return a === b };
      
      function equalsArray(a: any[], b: any[], equalFn: (av: any, bv: any) => boolean) {
        var returnValue = true
        var al = a.length
        var bl = b.length
    
        if (al === bl) {
          for (var i = 0, l = al; i < l; ++i) {
            if (!equalFn(a[i], b[i])) {
              returnValue = false
              break
            }
          }
        }
        return returnValue
      }
      
      function equals(o1, o2) {
        if (!$equalDefault.is(o1, o2)) {
          switch (__stringTag(o1)) {
            case 'Undefined':
            case 'Null':
            case 'Boolean':
              return false
            case 'Number':
              return (__stringTag(o2) === 'Number') && (__isNaN(o1) && __isNaN(o2))
            case 'String':
              return (__stringTag(o2) === 'String') && (o1 == o2)
            case 'Array':
              return (o2 != null) && equalsArray(o1, o2, equals)
            case 'Object':
            case 'Function':
            default:
              var keys1 = __keysSorted(o1)
              var keys2 = __isObject(o2) ? __keysSorted(o2) : null
              var keyc = keys1.length
              if (keys2 && equalsArray(keys1, keys2, equalsStrict)) {
                for (var i = 0; i < keyc; ++i) {
                  var key = keys1[i]
                  if (!equals(o1[key], o2[key])) {
                    return false
                  }
                }
              }
              return true
          }
        }
        return true
      }
      return equals(a, b)
    }
  };
  var $inspectDefault: $Inspector = new inspect.Inspector({ maxString: 70 });
  var $timeDefault: $Time = { now: Date.now || function () { return (new Date()).getTime(); } };
  var $stacktraceDefault: $Stacktrace = stacktrace;


  export interface IAssertion {
    type: string
    test: ITest
    message: string
    position: ICallSite
    stack: string
  }

  export interface ITestReport {
    assertions: IAssertion[]
    startDate: Date
    elapsedMilliseconds: number
  }

  export interface IPrinter {
    print(reports: ITestReport[]): void
  }
  
  export interface ITestParams {
    epsilon: number
    timeout: number
  }

  export interface ITestHandlers {
    onStart: (tests: ITest[]) => void
    onTestStart: (tests: ITest[], t: ITest) => void
    onTestEnd: (tests: ITest[], t: ITest, r: ITestReport) => void
    onEnd: (tests: ITest[]) => void
  }
  
  export interface ITestEngine {
    callstack(offset?: number): ICallSite[]
    dump(o: any): string
    currentDate(): Date
    currentTime(): number
    run(testCases: ITest[], config: ITestParams, handlers: ITestHandlers): void
    testEquals(actual: any, expected: any): boolean
    testEqualsStrict(actual: any, expected: any): boolean
    testEqualsNear(actual: any, expected: any, epsilon?: number): boolean
    testEqualsDeep(actual: any, expected: any): boolean
  }

  export interface ITest {
    category: string
    name: string
    run(engine: ITestEngine, params: ITestParams, complete: (report: ITestReport) => void): void
  }

  export var SUCCESS = "SUCCESS";
  export var FAILURE = "FAILURE";
  export var ERROR = "ERROR";
  export var WARNING = "WARNING";

  export class Assertion implements IAssertion {

    static success(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(SUCCESS, testCase, message, position)
    }

    static failure(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(FAILURE, testCase, message, position)
    }

    static error(testCase: ITest, message: string, position?: ICallSite, stack: string = null) {
      return new Assertion(ERROR, testCase, message, position, stack)
    }

    static warning(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(WARNING, testCase, message, position)
    }

    constructor(
      public type: string,
      public test: ITest,
      public message: string,
      public position?: ICallSite,
      public stack?: string
    ) { }

    equals(o: any): boolean {
      return this === o || (
        o &&
        (o instanceof Assertion) &&
        this.type === o.type &&
        this.test === o.test &&
        this.message === o.message
      );
    }

    inspect() {
      return __format(this.type, this.message);
    }

    toJSON() {
      return {
        type: this.type,
        message: this.message
      };
    }

    toString() {
      return this.inspect()
    }
  }
  
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
              isSuccess = reflect.getPrototypeOf(actual) === reflect.getPrototypeOf(expected) &&
                actual.name === expected.name &&
                actual.message === expected.message
              message = this.__dump__(actual) + ' thrown be like ' + this.__dump__(expected)
              break
            default:
              if (expected instanceof Error) {
                isSuccess = reflect.getPrototypeOf(actual) === reflect.getPrototypeOf(expected) &&
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

    __assert__(isSuccess: boolean, message: string, position: ICallSite): boolean {
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

    __position__(): ICallSite {
      return this.__engine__.callstack(3)[0]
    }

    protected _strictEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
      message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' be ') + this.__dump__(o2))
      return this.__assert__(this.__engine__.testEqualsStrict(o1, o2) === !not, message, position)
    }

    protected _equal(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
      message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' equal ') + this.__dump__(o2))
      return this.__assert__(this.__engine__.testEquals(o1, o2) === !not, message, position)
    }

    protected _propEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
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

    protected _deepEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
      message = message || (this.__dump__(o1) + (' must equals ') + this.__dump__(o2))
      return this.__assert__(this.__engine__.testEqualsDeep(o1, o2) === !not, message, position)
    }
  }
  
  
  interface ITestBlock<IAssert> {
    block: (assert: IAssert, complete?: () => void) => void
    assertFactory: (ng: ITestEngine, tc: ITest, r: ITestReport) => IAssert
  }

  export class Test implements ITest {

    public category: string = ""
    public blocks: ITestBlock<any>[] = []

    constructor(
      public suite: TestSuite,
      public name: string
    ) { }

    protected _beforeRun() {
      var suite = this.suite
      if (suite.setUp) {
        suite.setUp(this)
      }
    }

    protected _afterRun() {
      var suite = this.suite
      if (suite.tearDown) {
        suite.tearDown(this)
      }
    }
    
    addBlock<IAssert>(
      block: (assert: IAssert, complete?: () => void) => void,
      assertFactory: (ng: ITestEngine, tc: ITest, r: ITestReport) => IAssert
    ) {
      this.blocks.push({
        block: block,
        assertFactory: assertFactory
      });
    }

    run(engine: ITestEngine, params: ITestParams, complete: (report: ITestReport) => void) {
      var blocks = this.blocks
      var blockc = blocks.length
      var assertions: IAssertion[] = []
      var report: ITestReport = {
        startDate: engine.currentDate(),
        elapsedMilliseconds: NaN,
        assertions: assertions
      }

      var startTime  = engine.currentTime()
      var timeoutMs = params.timeout || Infinity;//no timeout


      //finish test and send to callback
      var onBlockComplete = () => {
        if (--blockc === 0) {
          //finalize report
          report.elapsedMilliseconds = engine.currentTime() - startTime
          __freeze(report)
          __freeze(assertions)

          complete(report)
        }
      }

      var runBlock = (testBlock: ITestBlock<any>, complete: () => void) => {
        var block = testBlock.block;
        var assertFactory = testBlock.assertFactory;
        var assert = assertFactory(engine, this, report);
        var isAsync = block.length >= 2//asynchronous
        var isFinished = false
        var timerId = null

        var onTimeout = () => {
          timerId = null
          assertions.push(Assertion.error(this, "No test completion after " + timeoutMs + "ms", null, null))
          complete()
        }

        var onComplete = () => {
          if (!isFinished) {
            isFinished = true
            if (timerId) {
              clearTimeout(timerId)
              timerId = null
            }

            if (assertions.length === 0) {
              assertions.push(Assertion.warning(this, "No assertion found", null))
            }

            this._afterRun()
            complete()
          }
        }

        try {
          this._beforeRun()
          if (isAsync) {
            if (__isFinite(timeoutMs)) {
              timerId = setTimeout(onTimeout, timeoutMs)
            }
            block(assert, onComplete)
          } else {
            block(assert)
          }
        } catch (e) {
          var parsed = e ? stacktrace.get(e) : null;
          assertions.push(Assertion.error(this, e.message, parsed && parsed[0], e.stack || e.message || null))
        } finally {
          if (!isAsync) {
            onComplete()
          }
        }
      }

      for (var i = 0, l = blocks.length; i < l; ++i) {
        runBlock(blocks[i], onBlockComplete)
      }
    }

    inspect() {
      return __format('Test', "" + this)
    }

    toString() {
      var category = this.category
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
      var byNames = this._byNames
      var test = byNames[name]
      if (!test) {
        test = byNames[name] = new Test(this, name)
        this.tests.push(test)
        test.category = this.name
      }
      return test;
    }
  }


  export class TestEngine implements ITestEngine {

    //Services
    protected $equal: $Equal = $equalDefault;
    protected $inspect: $Inspector = $inspectDefault;
    protected $time: $Time = $timeDefault;
    protected $stacktrace: $Stacktrace = $stacktraceDefault;

    constructor(
      deps?: {
        $equal?: $Equal;
        $inspect?: $Inspector;
        $time?: $Time;
        $stacktrace?: $Stacktrace;
      }
    ) {
      if (deps) {
        if ("$equal" in deps) {
          this.$equal = deps.$equal;
        }
        if ("$inspect" in deps) {
          this.$inspect = deps.$inspect;
        }
        if ("$time" in deps) {
          this.$time = deps.$time;
        }
        if ("$stacktrace" in deps) {
          this.$stacktrace = deps.$stacktrace;
        }
      }
    }

    callstack(): ICallSite[] {
      return this.$stacktrace.create();
    }

    dump(o: any): string {
      return this.$inspect.stringify(o);
    }

    currentDate(): Date {
      return new Date(this.$time.now())
    }

    currentTime(): number {
      return this.$time.now()
    }

    testEqualsStrict(a: any, b: any): boolean {
      return this.$equal.is(a, b)
    }

    testEquals(a: any, b: any): boolean {
      return this.$equal.equals(a, b)
    }

    testEqualsNear(o1: any, o2: any, epsilon: number = FLOAT_EPSILON): boolean {
      return this.$equal.equalsNear(o1, o2, epsilon);
    }

    testEqualsDeep(o1: any, o2: any): boolean {
      return this.$equal.equalsDeep(o1, o2)
    }

    run(
      tests: ITest[], 
      params: ITestParams, 
      handlers: ITestHandlers
    ) {
      var remaining = tests.length
      var runTest = (testCase: ITest) => {
        handlers.onTestStart(tests, testCase)
        testCase.run(this, params, function (report: ITestReport) {
          handlers.onTestEnd(tests, testCase, report)
          if (--remaining === 0) {
            handlers.onEnd(tests/*, reports*/)
          }
        })
      }

      handlers.onStart(tests);
      for (var i = 0, l = tests.length; i < l; ++i) {
        runTest(tests[i])
      }
    }
  }

  
  var $engineDefault = new TestEngine();
  /**
   * Default suite
   */
  export var suiteDefault = new TestSuite("")
  var suiteCurrent = suiteDefault;
  

  export function suite(
    name: string,
    f: (
      self?: TestSuite, 
      test?: (
        name: string,
        f: (assert: Assert, done?: () => void) => void
      ) => void 
    ) => void
  ): ITest[]  {
    var suitePrevious = suiteCurrent;
    var suiteNew = new TestSuite(name);
    var testFactory = function (name, f) {
      return suiteNew.getTest(name).addBlock(f, (ng, tc, r) => { return new Assert(ng, tc, r); })
    }
    
    suiteCurrent = suiteNew;
    try {
      f(suiteNew, testFactory)
    } finally {
      suiteCurrent = suitePrevious
    }
    return suiteNew.tests
  }

  export function testc<IAssert>(
    AssertClass: { new(ng: ITestEngine, tc: ITest, r: ITestReport): IAssert }
  ) {
    return (name: string, f: (assert: IAssert, done?: () => void) => void) => {
      return suiteCurrent
        .getTest(name)
        .addBlock(f, (ng, tc, r) => {
          return new AssertClass(ng, tc, r);
        })
    }
  }

  export function test(
    name: string,
    f: (assert: Assert, done?: () => void) => void
  ) {
    testc(Assert)(name, f);
  }


  export class Runner {
    //Config
    protected _epsilon = FLOAT_EPSILON;
    protected _timeout = TEST_TIMEOUT;
    protected _includeDefault = true;
    
    //Service
    protected $engine: ITestEngine = $engineDefault;
    
    constructor(
      private _printers: IPrinter[] = [],
      deps?: {
        $engine: ITestEngine  
      }
    ) { 
      if (deps) {
        if ("$engine" in deps) {
          this.$engine = deps.$engine;  
        }  
      }
    }
    
    config(options: {
      epsilon?: number
      includeDefault?: boolean
      timeout?: number
    }) {
      if ("epsilon" in options) {
        this._epsilon = options.epsilon;  
      }
      if ("includeDefault" in options) {
        this._includeDefault = options.includeDefault;  
      }
      if ("timeout" in options) {
        this._timeout = options.timeout;  
      }
      return this;
    }

    /*
    printers(printers: IPrinter[]) {
      return new Runner(
        this._printers.concat(printers), {
          $engine: this.$engine  
        }
      );
    }
    */

    run(testCases: ITest[], onComplete?: (report: ITestReport[]) => void): void {
      if (this._includeDefault) {
        testCases = testCases.concat(suiteDefault.tests)
      }
      var config = {
        epsilon: this._epsilon,
        timeout: this._timeout
      };
      var handlers: ITestHandlers = {
        onStart: (tests) => { },
        onTestStart: (tests, test) => { },
        onTestEnd: (tests, test, report) => {
          reports.push(report);  
        },
        onEnd: (tests) => {
          if (onComplete) {
            onComplete(reports);  
          }
        },
      };
      var reports: ITestReport[] = [];
      this.$engine.run(testCases, config, handlers)
    }
  }

  export class Printer implements IPrinter {

    print(reports: ITestReport[]) {
      var startTime: number = null
      var endTime: number = null
      var statFailed = 0
      var statSuccess = 0
      var statError = 0
      var sections: {[key: string]: IAssertion[]} = {}
      var uncaughtErrors: IAssertion[] = []

      function push(sectionName: string, a: IAssertion) {
        var array = sections[sectionName]
        if (array == null) {
          array = []
          sections[sectionName] = array
        }
        array.push(a)
      }

      reports.forEach((report) => {
        startTime = startTime === null ? +report.startDate : Math.min(startTime, +report.startDate)

        endTime = endTime === null ?
          (+report.startDate + report.elapsedMilliseconds) :
          Math.max(endTime, +report.startDate + report.elapsedMilliseconds)


        report.assertions.forEach((assertion) =>  {

          var position = assertion.position
          var category = assertion.test.category + '' + assertion.test.name

          switch (assertion.type) {
            case SUCCESS:
              push(category, assertion)
              ++statSuccess
              break
            case FAILURE:
              push(category, assertion)
              ++statFailed
              break
            case ERROR:
              if (category) {
                push(category, assertion)
              } else {
                uncaughtErrors.push(assertion)
              }
              ++statError
              break
            case WARNING:
              push(category, assertion)
              break
            default:
              throw TypeError(JSON.stringify(assertion))
          }
        })
      })

      __keysSorted(sections).forEach((sectionName) => {
        var matrix = ""
        var messages = ""
        var section = sections[sectionName]

        section.forEach((assertion) => {
if (assertion.position && !assertion.position.getFileName) {
  console.warn(assertion);
}

          var message = assertion.message
          var position = assertion.position
          var positionMessage = position ? " (" + position.getFileName() + ":" + position.getLineNumber() + ")" : ""
          var typeName = __str(assertion.type)

          switch(assertion.type) {
            case SUCCESS:
              matrix += "."
              break
            case FAILURE:
              matrix += "F"
              messages += "\n  [" + typeName + "]  " + message + positionMessage
              break
            case WARNING:
              matrix += "W"
              messages += "\n  [" + typeName + "]  " + message + positionMessage
              break
            case ERROR:
              matrix += "E"
              messages += "\n  [" + typeName + "] " + (assertion.stack || message)
              break
            default:
              throw TypeError(JSON.stringify(assertion))
          }
        })

        this._print(sectionName + " : ")
        this._print(matrix)
        this._print(messages)
        this._print("\n")
      })

      if (uncaughtErrors.length > 0) {
        this._println("Uncaught errors : ")
        var uncaughtError: IAssertion
        for (var i = 0, l = uncaughtErrors.length; i < l; ++i) {
          uncaughtError = uncaughtErrors[i]
          this._println("  [Error]  " + (uncaughtError.stack || uncaughtError.message))
        }
      }

      this._println()
      this._println("Duration : " + (endTime - startTime) + " ms")
      this._println("Total : " + (statSuccess + statFailed))
      this._println("Success : " + statSuccess + " / Failed : " + statFailed + " / Errors : " + statError)
      this._println("" + (statError !== 0 || statFailed !== 0 ? "FAILED!" : "SUCCESS!"))
    }

    private _print(s: string) {
      var id = "ts:trace"
      var element = document.getElementById(id)
      if (!element) {
        element = document.createElement("div")
        element.id = id
        document.body.appendChild(element)
      }
      var html = s
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/ /g, "&nbsp;")
      element.innerHTML += html
    }

    private _println(v?: string) {
      this._print("\n")
      this._print(v || "")
    }
  }

}
export = unit
