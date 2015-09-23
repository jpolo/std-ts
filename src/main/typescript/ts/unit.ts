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

export interface ITestContext extends engine.ITestContext {}

export interface ITestEngine extends engine.ITestEngine {}

export interface ITest extends engine.ITest {}

export const SUCCESS = assertion.SUCCESS
export const FAILURE = assertion.FAILURE
export const ERROR = assertion.ERROR
export const WARNING = assertion.WARNING
