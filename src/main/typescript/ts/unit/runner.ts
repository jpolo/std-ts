import unit = require("../unit")
import engine = require("./engine")
import ITestEngine = unit.ITestEngine
import IPrinter = unit.IPrinter
import ITest = unit.ITest
import ITestReport = unit.ITestReport
import ITestHandlers = unit.ITestHandlers

module runner {
  
  //Constant
  var FLOAT_EPSILON = 1e-5;

  
  export class Runner {
    //Config
    protected _epsilon = FLOAT_EPSILON;
    protected _timeout = 2000;//ms
    protected _includeDefault = true;
    
    //Service
    protected $engine: ITestEngine = engine.instance;
    
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
        testCases = testCases.concat(unit.suiteDefault.tests)
      }
      var config = {
        epsilon: this._epsilon,
        timeout: this._timeout
      };
      var handlers: ITestHandlers = {
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
      var reports: ITestReport[] = [];
      this.$engine.run(testCases, config, handlers)
    }
  }
}
export = runner