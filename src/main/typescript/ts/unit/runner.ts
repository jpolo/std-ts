import { ITestEngine, IPrinter, ITest, ITestReport, ITestContext, IAssertion } from "../unit"
import { Engine } from "./engine"

//Constant
const FLOAT_EPSILON = 1e-5;
const $engineDefault = new Engine()

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
    let { _epsilon, _timeout } = this

    function runTest(test: ITest, onComplete: (r: ITestReport) => void) {
      let report: ITestReport = {
        startDate: null,
        elapsedMilliseconds: NaN,
        assertions: []
      }
      let context = $engine.createContext(test, _timeout)
      context.onStart = () => {
        report.startDate = new Date($engine.now())
      },
      context.onAssertion = (assertion: IAssertion) => {
        report.assertions.push(assertion)
        //reports.push(report);
      },
      context.onError = (e: any) => {

      }
      context.onEnd = () => {
        if (onComplete) {
          onComplete(report)
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
