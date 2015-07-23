import { freeze } from "./reflect"
import * as stacktrace from "./stacktrace"
import * as assertion from "./unit/assertion"
import { IAssertionCallSite, Assertion } from "./unit/assertion"


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

export const SUCCESS = assertion.SUCCESS;
export const FAILURE = assertion.FAILURE;
export const ERROR = assertion.ERROR;
export const WARNING = assertion.WARNING;

interface IStreamController<T> {
  desiredSize: number
  enqueue(chunk: T): void
  close(): void
  error(e: any): void
}

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
        freeze(assertions)
      }
    };

    let timeoutMs = params.timeout || Infinity;//no timeout

    //finish test and send to callback
    let onBlockComplete = () => {
      if (--blockc === 0) {
        //finalize report
        assertionStream.close()
        freeze(report)
        complete(report)
      }
    }

    let runBlock = (testBlock: ITestBlock<any>, complete: () => void) => {
      let block = testBlock.block;
      let assertFactory = testBlock.assertFactory;
      let assert = assertFactory(engine, this, report);
      let isAsync = block.length >= 2//asynchronous
      let isFinished = false
      let timerId = null

      let onTimeout = () => {
        timerId = null
        assertionStream.enqueue(Assertion.error(this, "No test completion after " + timeoutMs + "ms", null, null))
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
            assertionStream.enqueue(Assertion.warning(this, "No assertion found", null))
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
        let parsed = e ? stacktrace.get(e) : null;
        assertionStream.enqueue(Assertion.error(this, e.message, parsed && parsed[0], e.stack || e.message || null))
      } finally {
        if (!isAsync) {
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


export let suiteDefault = new TestSuite("")
