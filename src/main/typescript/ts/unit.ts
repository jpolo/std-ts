import * as stacktrace from "./stacktrace"
import * as assertion from "./unit/assertion"
import { IAssertionCallSite, Assertion } from "./unit/assertion"

export interface IStreamController<T> {
  desiredSize: number
  enqueue(chunk: T): void
  close(): void
  error(e: any): void
}

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

export interface ITestEngine {
  callstack(): IAssertionCallSite[]
  dump(o: any): string
  now(): number
  run(test: ITest, params: ITestParams, handler: ITestHandler): void
  testEquals(actual: any, expected: any): boolean
  testEqualsStrict(actual: any, expected: any): boolean
  testEqualsNear(actual: any, expected: any, epsilon?: number): boolean
  testEqualsDeep(actual: any, expected: any): boolean
}

export interface ITestHandler {
  onTestStart(t: ITest): void
  onTestAssertion(t: ITest, a: IAssertion): void
  onTestError(t: ITest, e: any): void
  onTestEnd(t: ITest): void
}

export interface ITest {
  category: string
  name: string
  run(engine: ITestEngine, params: ITestParams, handler: ITestHandler): void
}

export const SUCCESS = assertion.SUCCESS
export const FAILURE = assertion.FAILURE
export const ERROR = assertion.ERROR
export const WARNING = assertion.WARNING
