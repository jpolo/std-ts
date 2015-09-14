import { ITestEngine, IPrinter, ITest, ITestReport, ITestHandler, IAssertion } from "../unit"
import { instance as $engineDefault } from "./engine"

//Constant
const FLOAT_EPSILON = 1e-5;

export class Runner {
  //Config
  protected _epsilon = FLOAT_EPSILON
  protected _timeout = 2000//ms
  protected _includeDefault = true

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
    epsilon?: number
    //includeDefault?: boolean
    timeout?: number
  }) {
    if (options.epsilon !== undefined) {
      this._epsilon = options.epsilon;
    }
    //if (options.includeDefault !== undefined) {
    //  this._includeDefault = options.includeDefault;
    //}
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
    let { $engine } = this
    let reports: ITestReport[] = []
    let config = {
      epsilon: this._epsilon,
      timeout: this._timeout
    }

    function runTest(test: ITest, onComplete: (r: ITestReport) => void) {
      let report: ITestReport = {
        startDate: null,
        elapsedMilliseconds: NaN,
        assertions: []
      }
      let handler: ITestHandler = {
        onTestStart(test: ITest) {
          report.startDate = new Date($engine.now())
        },
        onTestAssertion(test: ITest, assertion: IAssertion) {
          report.assertions.push(assertion)
          //reports.push(report);
        },
        onTestError(test: ITest, e: any) {

        },
        onTestEnd(test: ITest) {
          if (onComplete) {
            onComplete(report)
          }
        }
      }
      $engine.run(test, config, handler)
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
