import { ITestEngine, ITest, ITestReport, ITestParams, ITestHandler } from "../unit"
import { IInspector, Inspector } from "../inspect"
import * as equal from "./equal"
import { Now } from "./util"
import * as stacktrace from "../stacktrace"
import * as timer from "../timer"
import { IAssertion, IAssertionCallSite } from "./assertion"

//Util

//Service
interface ITestEngineEqual {
  is(lhs: any, rhs: any): boolean
  equals(lhs: any, rhs: any): boolean
  equalsNear(lhs: any, rhs: any, epsilon: any): boolean
  equalsProperties(lhs: any, rhs: any): boolean
  equalsDeep(lhs: any, rhs: any): boolean
}
interface ITestEngineInspector extends IInspector {}
interface ITestEngineStacktrace {
  callstack(): IAssertionCallSite[]
}
interface ITestEngineTime {
  now(): number
}
interface ITestEngineTimer {
  setTimeout(f: any, ms: number): number
  clearTimeout(id: number): void
  setInterval(f: any, ms: number): number
  clearInterval(id: number): void
  setImmediate(f: any): number
  clearImmediate(id: number): void
}

const $equalDefault: ITestEngineEqual = equal
const $inspectDefault: ITestEngineInspector = new Inspector({ maxString: 70 })
const $timeDefault: ITestEngineTime = {
  now: Now
}
const $stacktraceDefault: ITestEngineStacktrace = {
  callstack() { return stacktrace.create() }
}
const $timerDefault: ITestEngineTimer = timer

export class Engine implements ITestEngine {

  //Services
  protected $equal: ITestEngineEqual = $equalDefault
  protected $inspect: ITestEngineInspector = $inspectDefault
  protected $time: ITestEngineTime = $timeDefault
  protected $stacktrace: ITestEngineStacktrace = $stacktraceDefault
  protected $timer: ITestEngineTimer = $timerDefault

  constructor(
    deps?: {
      $equal?: ITestEngineEqual
      $inspect?: ITestEngineInspector
      $time?: ITestEngineTime
      $stacktrace?: ITestEngineStacktrace
      $timer?: ITestEngineTimer
    }
  ) {
    if (deps) {
      let { $equal, $inspect, $stacktrace, $time, $timer } = deps

      if ($equal !== undefined) {
        this.$equal = $equal
      }
      if ($inspect !== undefined) {
        this.$inspect = $inspect
      }
      if ($stacktrace !== undefined) {
        this.$stacktrace = $stacktrace
      }
      if ($time !== undefined) {
        this.$time = $time
      }
      if ($timer !== undefined) {
        this.$timer = $timer
      }
    }
  }

  callstack(): IAssertionCallSite[] {
    return this.$stacktrace.callstack()
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
