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
    let reports: ITestReport[] = [];



    let config = {
      epsilon: this._epsilon,
      timeout: this._timeout
    };


    function runTest(test: ITest) {
      let report: ITestReport = {
        startDate: NaN,
        elapsedMilliseconds: NaN,
        assertions: []
      }
      let handler: ITestHandler = {
        onTestStart: (test) => {
          report.startDate = new Date($engine.now())
        },
        onTestAssertion: (test, assertion) => {

          //reports.push(report);
        },
        onTestError(e) {

        },
        onTestEnd(test) {
          //if (onComplete) {
          //  onComplete(reports);
          //}
        }
      }
      $engine.run(test, config, handler)
    }

    for (let test of tests) {
      runTest(test)
    }


  }
}
