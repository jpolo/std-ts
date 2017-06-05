import * as assertion from './testing/assertion';
export { ITestRunContext, ITestEngine, ITest } from './testing/engine';
export { SUCCESS, FAILURE, ERROR, WARNING, IAssertion } from './testing/assertion';

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
