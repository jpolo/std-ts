import { ITestEngine, IPrinter, ITest, ITestReport, ITestHandlers, suiteDefault } from "../unit"
import { instance as $engineDefault } from "./engine"

//Constant
const FLOAT_EPSILON = 1e-5;

export class Runner {
  //Config
  protected _epsilon = FLOAT_EPSILON;
  protected _timeout = 2000;//ms
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
      if (deps.$engine !== undefined) {
        this.$engine = deps.$engine;  
      }  
    }
  }
  
  config(options: {
    epsilon?: number
    includeDefault?: boolean
    timeout?: number
  }) {
    if (options.epsilon !== undefined) {
      this._epsilon = options.epsilon;  
    }
    if (options.includeDefault !== undefined) {
      this._includeDefault = options.includeDefault;  
    }
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

  run(testCases: ITest[], onComplete?: (report: ITestReport[]) => void): void {
    if (this._includeDefault) {
      testCases = testCases.concat(suiteDefault.tests)
    }
    let reports: ITestReport[] = [];
    let config = {
      epsilon: this._epsilon,
      timeout: this._timeout
    };
    let handlers: ITestHandlers = {
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
    
    this.$engine.run(testCases, config, handlers)
  }
}