import { ICallSite } from '../stacktrace'
import { ITest } from '../unit'

export const SUCCESS = 'AssertionSuccess'
export const FAILURE = 'AssertionFailure'
export const ERROR = 'AssertionError'
export const WARNING = 'AssertionWarning'

export interface IAssertion extends Error {
  name: string
  message: string
  test: ITest
  position?: IAssertionCallSite
  stack?: string
}

export interface IAssertionCallSite extends ICallSite {}

export class Assertion implements IAssertion {

  static success (test: ITest, message: string, position?: IAssertionCallSite) {
    return new Assertion(SUCCESS, test, message, position)
  }

  static failure (test: ITest, message: string, position?: IAssertionCallSite) {
    return new Assertion(FAILURE, test, message, position)
  }

  static error (test: ITest, message: string, position?: IAssertionCallSite, stack: string = null) {
    return new Assertion(ERROR, test, message, position, stack)
  }

  static warning (test: ITest, message: string, position?: IAssertionCallSite) {
    return new Assertion(WARNING, test, message, position)
  }

  constructor (
    public name: string,
    public test: ITest,
    public message: string,
    public position?: IAssertionCallSite,
    public stack?: string
  ) { }

  equals (o: any): boolean {
    return this === o || (
      o &&
      (o instanceof Assertion) &&
      this.name === o.name &&
      this.test === o.test &&
      this.message === o.message
    )
  }

  inspect () {
    return `${this.name} { ${this.message} }`
  }

  toString () {
    return this.inspect()
  }
}
