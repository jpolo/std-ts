import * as assertion from './unit/assertion';
export { ITestRunContext, ITestEngine, ITest } from './unit/engine';
export { SUCCESS, FAILURE, ERROR, WARNING, IAssertion } from './unit/assertion';

export interface IStreamController<T> {
  desiredSize: number;
  enqueue(chunk: T): void;
  close(): void;
  error(e: any): void;
}

export interface ITestReport {
  assertions: assertion.IAssertion[];
  startDate: Date;
  elapsedMilliseconds: number;
}

export interface IReporter {
  print(reports: ITestReport[]): void;
}
