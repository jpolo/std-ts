import stacktrace = require("ts/stacktrace")
import unit = require("ts/unit")
import ITest = unit.ITest

module assertion {
  
  export var SUCCESS = "SUCCESS";
  export var FAILURE = "FAILURE";
  export var ERROR = "ERROR";
  export var WARNING = "WARNING";
  
  export interface IAssertion {
    type: string
    test: ITest
    message: string
    position: IAssertionCallSite
    stack: string
  }
  
  export interface IAssertionCallSite extends stacktrace.ICallSite {}
  
  export class Assertion implements IAssertion {

    static success(testCase: ITest, message: string, position?: IAssertionCallSite) {
      return new Assertion(SUCCESS, testCase, message, position)
    }

    static failure(testCase: ITest, message: string, position?: IAssertionCallSite) {
      return new Assertion(FAILURE, testCase, message, position)
    }

    static error(testCase: ITest, message: string, position?: IAssertionCallSite, stack: string = null) {
      return new Assertion(ERROR, testCase, message, position, stack)
    }

    static warning(testCase: ITest, message: string, position?: IAssertionCallSite) {
      return new Assertion(WARNING, testCase, message, position)
    }

    constructor(
      public type: string,
      public test: ITest,
      public message: string,
      public position?: IAssertionCallSite,
      public stack?: string
    ) { }

    equals(o: any): boolean {
      return this === o || (
        o &&
        (o instanceof Assertion) &&
        this.type === o.type &&
        this.test === o.test &&
        this.message === o.message
      );
    }

    inspect() {
      return this.type + " { " + this.message + " }";
    }

    toString() {
      return this.inspect()
    }
  }
  
}
export = assertion