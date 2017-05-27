import { ITestEngine, IReporter, ITest, ITestReport, IAssertion } from '../unit'
import { Engine, ITestEngineRunContext } from './engine'

// Constant
const $engineDefault = new Engine()

export class Runner {
  // Config
  // protected _timeout = 2000; // ms

  // Service
  protected $engine: ITestEngine = $engineDefault

  constructor (
    protected _timeout = 2000, // ms
    protected _reporters: IReporter[] = []
  ) {
  }

  config (options: {
    timeout?: number
  }) {
    return new Runner(
      this._timeout,
      this._reporters
    )
  }

  /*
  printers(printers: IPrinter[]) {
    return new Runner(
      this._timeout,
      this._printers.concat(printers)
    );
  }
  */

  run (tests: ITest[], onComplete?: (report: ITestReport[]) => void): void {
    const { $engine, _timeout } = this
    const reports: ITestReport[] = []

    function runTest (test: ITest, onTestComplete: (r: ITestReport) => void) {
      const report: ITestReport = {
        assertions: [],
        elapsedMilliseconds: NaN,
        startDate: null
      }
      const context: ITestEngineRunContext = {
        getTimeout () { return _timeout },
        getTest () { return test },
        onStart () {
          report.startDate = new Date($engine.now())
        },
        onAssertion (assertion: IAssertion) {
          report.assertions.push(assertion)
        },
        onError (e: any) {
          return undefined
        },
        onEnd () {
          if (onComplete) {
            onTestComplete(report)
          }
        }
      }
      $engine.run(context)
    }

    let testPending = tests.length
    function onTestComplete (r: ITestReport) {
      reports.push(r)
      testPending -= 1
      if (testPending === 0) {
        onComplete(reports)
      }
    }

    for (const test of tests) {
      runTest(test, onTestComplete)
    }
  }
}
