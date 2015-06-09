import inspect = require("ts/inspect")
import reflect = require("ts/reflect")
import stacktrace = require("ts/stacktrace")
import assertion = require("./unit/assertion")
import IAssertionCallSite = assertion.IAssertionCallSite
import Assertion = assertion.Assertion

module unit {
  var __freeze = reflect.freeze;

  export interface IAssertion extends assertion.IAssertion {}

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
    callstack(): IAssertionCallSite[]
    dump(o: any): string
    now(): number
    run(testCases: ITest[], params: ITestParams, handlers: ITestHandlers): void
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

  export var SUCCESS = assertion.SUCCESS;
  export var FAILURE = assertion.FAILURE;
  export var ERROR = assertion.ERROR;
  export var WARNING = assertion.WARNING;

  
  interface ITestBlock<IAssert> {
    block: (assert: IAssert, complete?: () => void) => void
    assertFactory: (ng: ITestEngine, tc: ITest, r: ITestReport) => IAssert
    disabled: boolean
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
      assertFactory: (ng: ITestEngine, tc: ITest, r: ITestReport) => IAssert,
      disabled: boolean = false
    ) {
      this.blocks.push({
        block: block,
        assertFactory: assertFactory,
        disabled: disabled
      });
    }

    run(engine: ITestEngine, params: ITestParams, complete: (report: ITestReport) => void) {
      var blocks = this.blocks
      var blockc = blocks.length
      var startTime  = engine.now()
      var assertions: IAssertion[] = []
      var report: ITestReport = {
        startDate: new Date(startTime),
        elapsedMilliseconds: NaN,
        assertions: assertions
      }

      var timeoutMs = params.timeout || Infinity;//no timeout


      //finish test and send to callback
      var onBlockComplete = () => {
        if (--blockc === 0) {
          //finalize report
          report.elapsedMilliseconds = engine.now() - startTime
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
            if (isFinite(timeoutMs)) {
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
      return "Test {" + this.toString() + " }"
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


  export var suiteDefault = new TestSuite("")

}
export = unit
