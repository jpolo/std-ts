import { ITestEngine, ITest, ITestReport, ITestParams, ITestHandlers } from "../unit"
import { IInspector, Inspector } from "../inspect"
import * as equal from "./equal"
import * as stacktrace from "../stacktrace"
import { IAssertion, IAssertionCallSite } from "./assertion"

//Util
//const IsNaN = function (o: any) { return o !== o; }
//const IsFinite = isFinite
//const IsNumber = function (o: any) { return typeof o === 'number'; }
//const IsObject = function (o) { return o !== null && (typeof o == "object"); }
//const ObjectKeys = ownKeys
//const ObjectKeysSorted = function (o: any) { return ObjectKeys(o).sort(); }
//const ToStringTag = stringTag

//Service
type $Equal = {
  is(lhs: any, rhs: any): boolean
  equals(lhs: any, rhs: any): boolean
  equalsNear(lhs: any, rhs: any, epsilon: any): boolean
  equalsDeep(lhs: any, rhs: any): boolean
}
type $Inspector = IInspector
type $Stacktrace = { create(): IAssertionCallSite[] }
type $Time = { now(): number }

const $equalDefault: $Equal = equal
const $inspectDefault: $Inspector = new Inspector({ maxString: 70 });
const $timeDefault: $Time = { now: Date.now || function () { return (new Date()).getTime(); } };
const $stacktraceDefault: $Stacktrace = stacktrace;

export class Engine implements ITestEngine {

  //Services
  protected $equal: $Equal = $equalDefault;
  protected $inspect: $Inspector = $inspectDefault;
  protected $time: $Time = $timeDefault;
  protected $stacktrace: $Stacktrace = $stacktraceDefault;

  constructor(
    deps?: {
      $equal?: $Equal;
      $inspect?: $Inspector;
      $time?: $Time;
      $stacktrace?: $Stacktrace;
    }
  ) {
    if (deps) {
      if (deps.$equal !== undefined) {
        this.$equal = deps.$equal;
      }
      if (deps.$inspect !== undefined) {
        this.$inspect = deps.$inspect;
      }
      if (deps.$time !== undefined) {
        this.$time = deps.$time;
      }
      if (deps.$stacktrace !== undefined) {
        this.$stacktrace = deps.$stacktrace;
      }
    }
  }

  callstack(): IAssertionCallSite[] {
    return this.$stacktrace.create();
  }

  dump(o: any): string {
    return this.$inspect.stringify(o);
  }

  now(): number {
    return this.$time.now()
  }

  testEqualsStrict(a: any, b: any): boolean {
    return this.$equal.is(a, b)
  }

  testEquals(a: any, b: any): boolean {
    return this.$equal.equals(a, b)
  }

  testEqualsNear(o1: any, o2: any, epsilon: number): boolean {
    return this.$equal.equalsNear(o1, o2, epsilon)
  }

  testEqualsDeep(o1: any, o2: any): boolean {
    return this.$equal.equalsDeep(o1, o2)
  }

  run(
    tests: ITest[],
    params: ITestParams,
    handlers: ITestHandlers
  ) {
    let remaining = tests.length
    let runTest = (testCase: ITest) => {
      handlers.onTestStart(tests, testCase)
      testCase.run(this, params, function (report: ITestReport) {
        handlers.onTestEnd(tests, testCase, report)
        if (--remaining === 0) {
          handlers.onEnd(tests/*, reports*/)
        }
      })
    }

    handlers.onStart(tests);
    for (let test of tests) {
      runTest(test)
    }
  }
}

export const instance = new Engine();
