import { ITestEngine, IPrinter, ITest, ITestReport, ITestRunContext, IAssertion } from "../unit"
import { Engine, ITestEngineRunContext } from "./engine"

//Constant
const FLOAT_EPSILON = 1e-5;
const $engineDefault = new Engine()

export class Runner {
  //Config
  protected _timeout = 2000//ms

  //Service
  protected $engine: ITestEngine = $engineDefault;

  constructor(
    private _printers: IPrinter[] = [],
    deps?: {
      $engine: ITestEngine
    }
  ) {
    if (deps) {
      if (deps.$engine !== undefined) {
        this.$engine = deps.$engine;
      }
    }
  }

  config(options: {
    timeout?: number
  }) {
    if (options.timeout !== undefined) {
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

  run(tests: ITest[], onComplete?: (report: ITestReport[]) => void): void {
    //if (this._includeDefault) {
    //  testCases = testCases.concat(suiteDefault.tests)
    //}
    let { $engine, _timeout } = this
    let reports: ITestReport[] = []

    function runTest(test: ITest, onComplete: (r: ITestReport) => void) {
      let report: ITestReport = {
        startDate: null,
        elapsedMilliseconds: NaN,
        assertions: []
      }
      let context: ITestEngineRunContext = {
        getTimeout() { return _timeout },
        getTest() { return test },
        onStart() {
          report.startDate = new Date($engine.now())
        },
        onAssertion(assertion: IAssertion) {
          report.assertions.push(assertion)
        },
        onError(e: any) {

        },
        onEnd() {
          if (onComplete) {
            onComplete(report)
          }
        }
      }
      $engine.run(context)
    }

    let testPending = tests.length
    function onTestComplete(r: ITestReport) {
      reports.push(r)
      testPending -= 1
      if (testPending === 0) {
        onComplete(reports)
      }
    }

    for (let test of tests) {
      runTest(test, onTestComplete)
    }
  }
}
