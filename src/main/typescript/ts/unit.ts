import inspect = require("ts/inspect")
import vm = require("ts/vm")
import ICallStack = vm.ICallStack
import ICallSite = vm.ICallSite

module unit {
  var TEST_TIMEOUT = 2000;//ms
  var __freeze = Object.freeze || function (o) { return o; }
  var __stringTag = vm.stringTag
  var __now = Date.now || function () { return (new Date()).getTime(); }

  export enum AssertionType { Success, Failure, Error, Warning }

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

  export class Assertion implements IAssertion {

    static success(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(AssertionType.Success, testCase, message, position)
    }

    static failure(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(AssertionType.Failure, testCase,  message, position)
    }

    static error(testCase: ITest, message: string, position?: ICallSite, stack = null) {
      return new Assertion(AssertionType.Error, testCase, message, position, stack)
    }

    static warning(testCase: ITest, message: string, position?: ICallSite) {
      return new Assertion(AssertionType.Warning, testCase, message, position)
    }
    
    constructor(
      public type: AssertionType,
      public test: ITest,
      public message: string,
      public position?: ICallSite,
      public stack?: ICallStack
    ) { }

    equals(o: any): boolean {
      return (
        (o instanceof Assertion) &&
        this.type === o.type &&
        this.test === o.test &&
        this.message === o.message
      )
    }

    toString() {
      var s = ''
      switch (this.type) {
        case AssertionType.Success:
          s += 'Success'
          break
        case AssertionType.Failure:
          s += 'Failure'
          break
        case AssertionType.Error:
          s += 'Error'
          break
        case AssertionType.Warning:
          s += 'Warning'
          break
      }
      s += '(' + this.message + ')'
      return s
    }
  }

  export module engine {
    export var FLOAT_EPSILON = 1e-5;
    
    export class Engine implements IEngine {

      callstack(offset = 0): ICallStack {
        return vm.callstack(offset)
      }

      dump(o: any): string {
        return inspect.stringify(o)
      }

      currentDate() {
        return new Date()
      }

      currentTime() {
        return __now()
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
            o1 && o1.equals ? o1.equals(o2) :
            o2 && o2.equals ? o2.equals(o1) :
            o1 == o2
          )
        )
      }

      testEqualsNear(o1: any, o2: any, epsilon: number = FLOAT_EPSILON): boolean {
        var to1 = typeof o1
        var to2 = typeof o2

        return (
          (to1 === "number" || to2 === "number") ? this.testEqualsStrict(to1, to2) && (o1 == o2 || this._equalsFloat(o1, o2, epsilon)) :
          ("nearEquals" in o1) ? o1.nearEquals(o2) :
          false
        )
      }
      
      testEqualsDeep(o1: any, o2: any): boolean {
        function equals(o1, o2) {
          if (o1 === o2) {
            return true
          }
          switch (vm.stringTag(o1)) {
            case 'Undefined':
            case 'Null':
              return o1 === o2
            case 'Number':
              return +o1 === +o2
            case 'String':
              return String(o1) === String(o2)
            case 'Array':            
              if (
                o2 == null ||
                o1.length !== o2.length
              ) {
                return false
              }
              for (var i = 0, l = o1.length; i < l; ++i) {
                if (!equals(o1[i], o2[i])) {
                  return false
                }
              }
              return true
              break
            case 'Object':
            default:
              break
            
              
          }
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

      private _equalsFloat(actual: number, expected: number, epsilon: number) {
        var returnValue = false
        if (isNaN(expected)) {
          returnValue = isNaN(actual)
        } else if (isNaN(actual)) {
          returnValue = false
        } else if (!isFinite(expected) && !isFinite(actual)) {
          returnValue = (expected > 0) == (actual > 0)
        } else {
          returnValue = (Math.abs(actual - expected) < epsilon)
        }
        return returnValue
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

      toString() {
        var category = this.category
        return 'Test(' + (category ? category + this._separator : '' ) + this.name + ')'
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
        var engine = this.__engine__
        var position = this.__position__()
        var actual
        message = message || (engine.dump(block) + ' must throw an error')
        try {
          block()
        } catch (e) {
          actual = e
        }

        if (!actual) {
          isSuccess = false
        } else {
          if (!expected) {
            isSuccess = true
          } else {
            switch (typeof expected) {
              case 'string':
                isSuccess = String(actual) == expected
                break
              case 'function':
                isSuccess = actual instanceof expected
                message = engine.dump(actual) + ' thrown must be instance of ' + engine.dump(expected)
                break
              case 'object':
                if (expected instanceof RegExp) {
                  isSuccess = expected.test(String(actual))
                  message = engine.dump(actual) + ' thrown must match ' + engine.dump(expected)
                } else {
                  isSuccess = actual instanceof expected.constructor &&
                    actual.name === expected.name &&
                    actual.message === expected.message
                  message = engine.dump(actual) + ' thrown be like ' + engine.dump(expected)
                }
                break
              default:
                isSuccess = actual === expected
                message = engine.dump(actual) + ' thrown must be ' + engine.dump(expected)
            }
          }
        }
        return this.__assert__(isSuccess, message, position)
      }

      __assert__(isSuccess: boolean, message: string, position: ICallSite): boolean {
        var assertions = this._report.assertions
        if (!Object.isExtensible(assertions)) {
          throw new Error('Assertions were made after report creation in ' + String(this._testCase))
        }

        message = message || 'assertion should be true'

        assertions.push(
          new Assertion(isSuccess ? AssertionType.Success : AssertionType.Failure, this._testCase, message, position)
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
        var engine = this.__engine__
        message = message || (engine.dump(o1) + (' must' + (not ? ' not' : '') + ' be ') + engine.dump(o2))
        return this.__assert__(engine.testEqualsStrict(o1, o2) === !not, message, position)
      }

      private _equal(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        var engine = this.__engine__
        message = message || (engine.dump(o1) + (' must' + (not ? ' not' : '') + ' equal ') + engine.dump(o2))
        return this.__assert__(engine.testEquals(o1, o2) === !not, message, position)
      }

      private _propEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        var engine = this.__engine__
        message = message || (engine.dump(o1) + (' must have same properties as ') + engine.dump(o2))
        var keys1 = Object.keys(o1).sort()
        var keys2 = Object.keys(o2).sort()
        var isSuccess = true
        for (var i = 0, l = keys1.length; i < l; ++i) {
          var key1 = keys1[i]
          var key2 = keys2[i]
          if (key1 === key2) {

            if (!engine.testEqualsStrict(o1[key1], o2[key2])) {
              isSuccess = false
              break
            }
          }

        }
        return this.__assert__(isSuccess, message, position)
      }
      
      _deepEqual(o1: any, o2: any, not: boolean, message: string, position: ICallSite) {
        var engine = this.__engine__
        message = message || (engine.dump(o1) + (' must equals ') + engine.dump(o2))
        return this.__assert__(engine.testEqualsDeep(o1, o2) === !not, message, position)
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
      private _engine: IEngine = new engine.Engine(),
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

          switch (assertion.type) {
            case AssertionType.Success:
              push(category, assertion)
              ++statSuccess
              break
            case AssertionType.Failure:
              push(category, assertion)
              ++statFailed
              break
            case AssertionType.Error:
              if (category) {
                push(category, assertion)
              } else {
                uncaughtErrors.push(assertion)
              }
              ++statError
              break
            case AssertionType.Warning:
              push(category, assertion)
              break
            default:
              throw TypeError(JSON.stringify(assertion))
          }
        })
      })

      Object.keys(sections).forEach((sectionName) => {
        var matrix = ""
        var messages = ""
        var section = sections[sectionName]

        section.forEach((assertion) => {
          var message = assertion.message
          var position = assertion.position
          var positionMessage = position ? " (" + position.fileName + ":" + position.lineNumber + ")" : ""

          switch(assertion.type) {
            case AssertionType.Success:
              matrix += "."
              break
            case AssertionType.Failure:
              matrix += "F"
              messages += "\n  [Failure]  " + message + positionMessage
              break
            case AssertionType.Warning:
              matrix += "W"
              messages += "\n  [Warning]  " + message + positionMessage
              break
            case AssertionType.Error:
              matrix += "E"
              messages += "\n  [Error] " + (assertion.stack || message)
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
      var html = s.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")


      element.innerHTML += html
    }

    private _println(v?: string) {
      this._print("\n")
      this._print(v || "")
    }
  }

}
export = unit
