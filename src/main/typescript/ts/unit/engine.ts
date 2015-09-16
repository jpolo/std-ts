import { ITestEngine, ITest, ITestReport, ITestParams, ITestHandler } from "../unit"
import { IInspector, Inspector } from "../inspect"
import * as equal from "./equal"
import { Now } from "./util"
import * as stacktrace from "../stacktrace"
import * as timer from "../timer"
import { IAssertion, IAssertionCallSite } from "./assertion"

//Util

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
type $Timer = {
  setTimeout(f: any, ms: number): number
  clearTimeout(id: number): void
}

const $equalDefault: $Equal = equal
const $inspectDefault: $Inspector = new Inspector({ maxString: 70 })
const $timeDefault: $Time = { now: Now }
const $stacktraceDefault: $Stacktrace = stacktrace
const $timerDefault: $Timer = timer

export class Engine implements ITestEngine {

  //Services
  protected $equal: $Equal = $equalDefault
  protected $inspect: $Inspector = $inspectDefault
  protected $time: $Time = $timeDefault
  protected $stacktrace: $Stacktrace = $stacktraceDefault
  protected $timer: $Timer = $timerDefault

  constructor(
    deps?: {
      $equal?: $Equal
      $inspect?: $Inspector
      $time?: $Time
      $stacktrace?: $Stacktrace
      $timer?: $Timer
    }
  ) {
    if (deps) {
      if (deps.$equal !== undefined) {
        this.$equal = deps.$equal
      }
      if (deps.$inspect !== undefined) {
        this.$inspect = deps.$inspect
      }
      if (deps.$stacktrace !== undefined) {
        this.$stacktrace = deps.$stacktrace
      }
      if (deps.$time !== undefined) {
        this.$time = deps.$time
      }
      if (deps.$timer !== undefined) {
        this.$timer = deps.$timer
      }
    }
  }

  callstack(): IAssertionCallSite[] {
    return this.$stacktrace.create()
  }

  dump(o: any): string {
    return this.$inspect.stringify(o)
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
    test: ITest,
    params: ITestParams,
    handler: ITestHandler
  ) {
    try {
      test.run(this, params, handler)
    } catch (e) {
      handler.onTestError(test, e)
      handler.onTestEnd(test)
    }
  }
}
