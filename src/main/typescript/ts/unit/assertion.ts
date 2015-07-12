import { ICallSite } from "../stacktrace"
import { ITest } from "../unit"

export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";
export const ERROR = "ERROR";
export const WARNING = "WARNING";

export interface IAssertion {
  type: string
  test: ITest
  message: string
  position: IAssertionCallSite
  stack: string
}

export interface IAssertionCallSite extends ICallSite {}

export class Assertion implements IAssertion {

  static success(test: ITest, message: string, position?: IAssertionCallSite) {
    return new Assertion(SUCCESS, test, message, position)
  }

  static failure(test: ITest, message: string, position?: IAssertionCallSite) {
    return new Assertion(FAILURE, test, message, position)
  }

  static error(test: ITest, message: string, position?: IAssertionCallSite, stack: string = null) {
    return new Assertion(ERROR, test, message, position, stack)
  }

  static warning(test: ITest, message: string, position?: IAssertionCallSite) {
    return new Assertion(WARNING, test, message, position)
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
