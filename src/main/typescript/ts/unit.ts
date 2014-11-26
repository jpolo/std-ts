import inspect = require("ts/inspect")
import reflect = require("ts/reflect")
import stacktrace = require("ts/stacktrace")
import ICallStack = stacktrace.ICallStack
import ICallSite = stacktrace.ICallSite

module unit {
  var TEST_TIMEOUT = 2000;//ms
  var __equals = function (a: any, b: any) { return a === b }
  var __equalsFloat = function (a: number, b: number, epsilon: number) {
    return (
      __isNaN(b) ? __isNaN(a) :
      __isNaN(a) ? false :
      !__isFinite(b) && !__isFinite(a) ? (b > 0) == (a > 0) :
      Math.abs(a - b) < epsilon
    )
  }
  var __equalsArray = function (a: any[], b: any[], equalFn: (av: any, bv: any) => boolean) {
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
  var __fnSource = function (f: Function) { return __str(f).slice(13, -1).trim() }
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' }
  var __freeze = reflect.freeze
  var __isFinite = isFinite
  var __isNaN = isNaN
  var __isNumber = function (o) { return typeof o === 'number' }
  var __isObject = function (o) { return o != null && (typeof o == "object") }
  var __keys = reflect.ownKeys
  var __str = String  
  var __stringTag = reflect.stringTag
  var __now = Date.now || function () { return (new Date()).getTime(); }
  


  export interface IAssertion {
    type: AssertionType
    test: ITest
    message: string
    position: ICallSite
    stack: ICallStack
  }

  export interface ITestReport {
    assertions: IAssertion[]
    startDate: Date
    elapsedMilliseconds: number
  }

  export interface IPrinter {
    print(reports: ITestReport[]): void
  }

  export interface IEngine {
    callstack(offset?: number): ICallStack
    dump(o: any): string
    currentDate(): Date
    currentTime(): number
    run(testCases: ITest[], onComplete: (reports: ITestReport[]) => void): void
    testEquals(actual: any, expected: any): boolean
    testEqualsStrict(actual: any, expected: any): boolean
    testEqualsNear(actual: any, expected: any, epsilon?: number): boolean
    testEqualsDeep(actual: any, expected: any): boolean
  }

  export interface ITest {
    category: string
    name: string
    run(engine: IEngine, onComplete: (report: ITestReport) => void): void
  }
  
  export class AssertionType {
  
    static create(name: string): AssertionType {
      name = name.toUpperCase()
      var assertionTypes = AssertionType._instances
      var assertionType = assertionTypes[name]
      if (assertionType) {
        throw new Error(assertionType + ' is already defined')
      }
      assertionType = assertionTypes[name] = new AssertionType(name, AssertionType._nextValue++)
      return assertionType
    }
    
    private static _instances: { [key: string]: AssertionType } = {}
    private static _nextValue = 0

    constructor(
      public name: string, 
      public value: number
    ) {}
    
    equals(o: any): boolean { 
      return this === o || (o && (o instanceof this.constructor) && this.value === o.value) 
    }
    
    valueOf() { 
      return this.value 
    }
    
    inspect() { 
      return __format('AssertionType', this.name) 
    }
    
    toJSON() {
      return __str(this)
    }
    
    toString() { 
      return this.name 
    }
  }
  export var SUCCESS = AssertionType.create("SUCCESS")
  export var FAILURE = AssertionType.create("FAILURE")
  export var ERROR = AssertionType.create("ERROR")
  export var WARNING = AssertionType.create("WARNING")
  
  export class Assertion implements IAssertion {
    
    static success(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(SUCCESS, testCase, message, position)
    }

    static failure(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(FAILURE, testCase, message, position)
    }

    static error(testCase: ITest, message: string, position?: ICallSite, stack = null) {
      return new Assertion(ERROR, testCase, message, position, stack)
    }

    static warning(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(WARNING, testCase, message, position)
    }
    
    constructor(
      public type: AssertionType,
      public test: ITest,
      public message: string,
      public position?: ICallSite,
      public stack?: ICallStack
    ) { }

    equals(o: any): boolean {
      return this === o || (
        o && 
        (o instanceof this.constructor) &&
        +this.type === +o.type &&
        this.test === o.test &&
        this.message === o.message
      )
    }
    
    inspect() {
      return __format(__str(this.type), this.message)
    }

    toString() {
      return this.inspect()
    }
  }

  export module engine {
    export var FLOAT_EPSILON = 1e-5;
    
    /**
     * Default engine 
     */
    var _instance: Engine
    export function get(): Engine {
      return (_instance || (_instance = new Engine()))
    }
    
    export class Engine implements IEngine {
      
      //Services
      private $inspect: inspect.IEngine = inspect.engine.get()
      private $time: { now: () => number } = { now: __now }
      
      constructor(
        deps?: {
          $inspect?: inspect.IEngine
          $time?: { now: () => number }
        }
      ) {
        if (deps) {
          this.$inspect = deps.$inspect || this.$inspect
          this.$time = deps.$time || this.$time
        }
      }
      
      callstack(offset = 0): ICallStack {
        return stacktrace.create(null, offset)
      }

      dump(o: any): string {
        return this.$inspect.stringify(o)
      }

      currentDate(): Date {
        return new Date(this.$time.now())
      }

      currentTime(): number {
        return this.$time.now()
      }

      testEqualsStrict(a: any, b: any): boolean {
        return (
          a === 0 && b === 0 ? 1 / a === 1 / b :
          a === b ? true :
          a !== a && b !== b ? true :
          false
        )
      }

      testEquals(o1: any, o2: any): boolean {
        return (
          this.testEqualsStrict(o1, o2) ||
          (
            (o1 != null) && o1.equals ? o1.equals(o2) :
            (o2 != null) && o2.equals ? o2.equals(o1) :
            o1 == o2
          )
        )
      }

      testEqualsNear(o1: any, o2: any, epsilon: number = FLOAT_EPSILON): boolean {
        var isnum1 = __isNumber(o1)
        var isnum2 = __isNumber(o2) 
        return (
          (isnum1 || isnum2) ? (isnum1 === isnum2) && (o1 == o2 || __equalsFloat(o1, o2, epsilon)) :
          (o1 != null && o1.nearEquals) ? o1.nearEquals(o2) :
          (o2 != null && o2.nearEquals) ? o2.nearEquals(o1) :
          false
        )
      }
      
      testEqualsDeep(o1: any, o2: any): boolean {
        var self = this
        function equals(o1, o2) {
          if (!self.testEqualsStrict(o1, o2)) {
            switch (__stringTag(o1)) {
              case 'Undefined':
              case 'Null':
              case 'Boolean':
                return false
              case 'Number':
                return (__stringTag(o2) === 'Number') && (isNaN(o1) && isNaN(o2))
              case 'String':
                return (__stringTag(o2) === 'String') && (o1 == o2)
              case 'Array':   
                return (o2 != null) && __equalsArray(o1, o2, equals)         
              case 'Object':
              case 'Function':
              default:
                var keys1 = __keys(o1)
                var keys2 = __isObject(o2) ? __keys(o2) : null
                var keyc = keys1.length
                if (keys2 && __equalsArray(keys1, keys2, __equals)) {
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
        return equals(o1, o2)
      }

      run(testCases: ITest[], onComplete?: (reports: ITestReport[]) => void) {
        var remaining = testCases.length
        var reports: ITestReport[] = []
        var onrun = (testCaseReport: ITestReport) => {
          reports.push(testCaseReport)
          if (--remaining === 0 && onComplete) {
            onComplete(reports)
          }
        }

        for (var i = 0, l = testCases.length; i < l; ++i) {
          testCases[i].run(this, onrun)
        }
      }
    }

    export class TestSuite {

      public setUp: (test?: Test<any>) => void
      public tearDown: (test?: Test<any>) => void
      public tests: Test<any>[] = []
      private _byNames: {[name: string]: Test<any>} = {}

      constructor(
        public name: string
      ) { }

      test<IAssert>(
        name: string,
        f: (assert: IAssert, complete?: () => void) => void,
        AssertClass: { new(ng: IEngine, tc: Test<IAssert>, r: ITestReport): IAssert }
      ) {
        var byNames = this._byNames
        var test = byNames[name]
        if (!test) {
          test = byNames[name] = new Test(this, name, AssertClass)
          this.tests.push(test)
          test.category = this.name
        }

        //add block of code to be executed
        test.blocks.push(f)
      }
    }

    export class Test<IAssert> implements ITest {

      private _separator = '::'

      public category: string = ""
      public blocks: Array<(assert: IAssert, complete?: () => void) => void> = []

      constructor(
        public suite: TestSuite,
        public name: string,
        private AssertClass: { new(ng: IEngine, tc: Test<IAssert>, r: ITestReport): IAssert }
      ) { }

      private _beforeRun() {
        var suite = this.suite
        if (suite.setUp) {
          suite.setUp(this)
        }
      }

      private _afterRun() {
        var suite = this.suite
        if (suite.tearDown) {
          suite.tearDown(this)
        }
      }

      run(engine: IEngine, onComplete: (report: ITestReport) => void) {
        var blocks = this.blocks
        var blockc = blocks.length
        var assertions: IAssertion[] = []
        var report: ITestReport = {
          startDate: engine.currentDate(),
          elapsedMilliseconds: NaN,
          assertions: assertions
        }

        var assert = new this.AssertClass(engine, this, report)
        var startTime  = engine.currentTime()
        var timeoutMs = TEST_TIMEOUT


        //finish test and send to callback
        var blockComplete = () => {
          if (--blockc === 0) {
            //finalize report
            report.elapsedMilliseconds = engine.currentTime() - startTime
            __freeze(report)
            __freeze(assertions)

            onComplete(report)
          }
        }

        var runBlock = (block: (assert: IAssert, complete?: () => void) => void, onComplete: () => void) => {
          var isAsync = block.length >= 2//asynchronous
          var isFinished = false
          var timerId = null

          var onTimeout = () => {
            timerId = null
            assertions.push(Assertion.error(this, "No test completion after " + timeoutMs + "ms", null, null))
            complete()
          }

          var complete = () => {
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
              onComplete()
            }
          }

          try {
            this._beforeRun()
            if (isAsync) {
              timerId = setTimeout(onTimeout, timeoutMs)
              block(assert, complete)
            } else {
              block(assert)
            }
          } catch (e) {
            assertions.push(Assertion.error(this, e.message, e.stack[0], e.stack))
          } finally {
            if (!isAsync) {
              complete()
            }
          }
        }

        for (var i = 0, l = blocks.length; i < l; ++i) {
          runBlock(blocks[i], blockComplete)
        }
      }

      inspect() {
        return __format('Test', __str(this))
      }
      
      toString() {
        var category = this.category
        return (category ? category + this._separator : '' ) + this.name
      }
    }

    export class Assert {
      constructor(
        public __engine__: IEngine,
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
                isSuccess = actual instanceof expected.constructor &&
                  actual.name === expected.name &&
                  actual.message === expected.message
                message = this.__dump__(actual) + ' thrown be like ' + this.__dump__(expected)
                break
              default:
                isSuccess = actual === this.__engine__.testEqualsStrict(actual, expected)
                message = this.__dump__(actual) + ' thrown must be ' + this.__dump__(expected)
            }
          }
        }
        return this.__assert__(isSuccess, message, position)
      }

      __assert__(isSuccess: boolean, message: string, position: ICallSite): boolean {
        var assertions = this._report.assertions
        if (!reflect.isExtensible(assertions)) {
          throw new Error('Assertions were made after report creation in ' + __str(this._testCase))
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

      private _strictEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' be ') + this.__dump__(o2))
        return this.__assert__(this.__engine__.testEqualsStrict(o1, o2) === !not, message, position)
      }

      private _equal(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        message = message || (this.__dump__(o1) + (' must' + (not ? ' not' : '') + ' equal ') + this.__dump__(o2))
        return this.__assert__(this.__engine__.testEquals(o1, o2) === !not, message, position)
      }

      private _propEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        var engine = this.__engine__
        message = message || (this.__dump__(o1) + (' must have same properties as ') + this.__dump__(o2))
        var keys1 = __keys(o1)
        var keys2 = __keys(o2)
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
      
      private _deepEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        message = message || (this.__dump__(o1) + (' must equals ') + this.__dump__(o2))
        return this.__assert__(this.__engine__.testEqualsDeep(o1, o2) === !not, message, position)
      }

    }
    

    /**
     * Default suite 
     */
    export var suiteDefault = new TestSuite("")
      
    
  }
   
  var suiteCurrent = engine.suiteDefault
      
  export function suite(
    name: string,
    f: (self?: engine.TestSuite) => void
  ): ITest[]  {
    var suitePrevious = suiteCurrent
    var suiteNew = new engine.TestSuite(name)
    suiteCurrent = suiteNew
    try {
      f(suiteNew)
    } finally {
      suiteCurrent = suitePrevious
    }
    return suiteNew.tests
  }

  export function testc<IAssert>(
    AssertClass: { new(ng: IEngine, tc: engine.Test<IAssert>, r: ITestReport): IAssert }
  ) {
    return (name: string, f: (assert: IAssert, done?: () => void) => void) => {
      return suiteCurrent.test(name, f, AssertClass)
    }
  }

  export function test(
    name: string,
    f: (assert: engine.Assert, done?: () => void) => void
  ) {
    suiteCurrent.test(name, f, engine.Assert)
  }
    

  export class Runner {
    constructor(
      private _engine: IEngine = engine.get(),
      private _printers: IPrinter[] = []
    ) { }

    printers(printers: IPrinter[]) {
      return new Runner(
        this._engine,
        this._printers.concat(printers)
      );
    }

    run(testCases: ITest[], onComplete?: (report: ITestReport[]) => void, noDefault = false): void {
      if (!noDefault) {
        testCases = testCases.concat(engine.suiteDefault.tests)
      }
      this._engine.run(testCases, onComplete)
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
          var category = assertion.test.category + '::' + assertion.test.name

          switch (+assertion.type) {
            case +SUCCESS:
              push(category, assertion)
              ++statSuccess
              break
            case +FAILURE:
              push(category, assertion)
              ++statFailed
              break
            case +ERROR:
              if (category) {
                push(category, assertion)
              } else {
                uncaughtErrors.push(assertion)
              }
              ++statError
              break
            case +WARNING:
              push(category, assertion)
              break
            default:
              throw TypeError(JSON.stringify(assertion))
          }
        })
      })

      __keys(sections).forEach((sectionName) => {
        var matrix = ""
        var messages = ""
        var section = sections[sectionName]

        section.forEach((assertion) => {
          var message = assertion.message
          var position = assertion.position
          var positionMessage = position ? " (" + position.fileName + ":" + position.lineNumber + ")" : ""
          var typeName = __str(assertion.type)
          
          switch(+assertion.type) {
            case +SUCCESS:
              matrix += "."
              break
            case +FAILURE:
              matrix += "F"
              messages += "\n  [" + typeName + "]  " + message + positionMessage
              break
            case +WARNING:
              matrix += "W"
              messages += "\n  [" + typeName + "]  " + message + positionMessage
              break
            case +ERROR:
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
