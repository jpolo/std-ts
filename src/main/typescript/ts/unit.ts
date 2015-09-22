import * as assertion from "./unit/assertion"
import * as engine from "./unit/engine"
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

export interface ITestEngine extends engine.ITestEngine {}

export interface ITestHandler {
  onTestStart(t: ITest): void
  onTestAssertion(t: ITest, a: IAssertion): void
  onTestError(t: ITest, e: any): void
  onTestEnd(t: ITest): void
}

export interface ITest extends engine.ITest {}

export const SUCCESS = assertion.SUCCESS
export const FAILURE = assertion.FAILURE
export const ERROR = assertion.ERROR
export const WARNING = assertion.WARNING
