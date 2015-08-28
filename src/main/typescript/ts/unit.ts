import { freeze } from "./reflect"
import * as stacktrace from "./stacktrace"
import * as assertion from "./unit/assertion"
import { IAssertionCallSite, Assertion } from "./unit/assertion"

export interface IAssertion extends assertion.IAssertion {}

export interface ITestReport {
  assertions: IAssertion[]
  startDate: Date
  elapsedMilliseconds: number
}

export interface IPrinter {
  print(reports: ITestReport[]): void
}

export interface ITestParams {
  epsilon: number
  timeout: number
}

export interface ITestHandlers {
  onStart: (tests: ITest[]) => void
  onTestStart: (tests: ITest[], t: ITest) => void
  onTestEnd: (tests: ITest[], t: ITest, r: ITestReport) => void
  onEnd: (tests: ITest[]) => void
}

export interface ITestEngine {
  callstack(): IAssertionCallSite[]
  dump(o: any): string
  now(): number
  run(testCases: ITest[], params: ITestParams, handlers: ITestHandlers): void
  testEquals(actual: any, expected: any): boolean
  testEqualsStrict(actual: any, expected: any): boolean
  testEqualsNear(actual: any, expected: any, epsilon?: number): boolean
  testEqualsDeep(actual: any, expected: any): boolean
}

export interface ITest {
  category: string
  name: string
  run(engine: ITestEngine, params: ITestParams, complete: (report: ITestReport) => void): void
}

export const SUCCESS = assertion.SUCCESS;
export const FAILURE = assertion.FAILURE;
export const ERROR = assertion.ERROR;
export const WARNING = assertion.WARNING;
