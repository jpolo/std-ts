import { IInspector, Inspector } from "../inspect"
import * as equal from "./equal"
import { Now } from "./util"
import * as stacktrace from "../stacktrace"
import * as timer from "../timer"
import { IAssertion, IAssertionCallSite } from "./assertion"

//Util

//Service
interface ITestEngineEqual {
  equalsSame(lhs: any, rhs: any): boolean
  equalsSimple(lhs: any, rhs: any): boolean
  equalsStrict(lhs: any, rhs: any): boolean
  equalsNear(lhs: any, rhs: any, epsilon: any): boolean
  equalsProperties(lhs: any, rhs: any): boolean
  equalsDeep(lhs: any, rhs: any): boolean
}
interface ITestEngineDump {
  dump(o: any): string
}
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
interface ITestEngineRun {
  run(context: ITestEngineRunContext)
}

export interface ITestEngineRunContext {
  getTimeout(): number
  getTest(): ITest
  onStart(): void
  onAssertion(a: IAssertion): void
  onError(e: any): void
  onEnd(): void
}
export interface ITestEngine extends
  ITestEngineEqual,
  ITestEngineDump,
  ITestEngineRun,
  ITestEngineStacktrace,
  ITestEngineTime,
  ITestEngineTimer {
}

export interface ITest {
  category: string
  name: string
  run(context: ITestRunContext): void
}

export interface ITestRunContext extends ITestEngineRunContext {
  getEngine(): ITestEngine
}

const $equalDefault: ITestEngineEqual = equal
const $dumpDefault: ITestEngineDump = (function () {
  let inspector = new Inspector({ maxString: 70 })
  return {
    dump(o: any) {
      return inspector.stringify(o)
    }
  }
}())
const $timeDefault: ITestEngineTime = {
  now: Now
}
const $stacktraceDefault: ITestEngineStacktrace = {
  callstack() { return stacktrace.create() }
}
const $timerDefault: ITestEngineTimer = timer

export class Engine implements ITestEngine {

  //Services
  protected $dump: ITestEngineDump = $dumpDefault
  protected $equal: ITestEngineEqual = $equalDefault
  protected $stacktrace: ITestEngineStacktrace = $stacktraceDefault
  protected $time: ITestEngineTime = $timeDefault
  protected $timer: ITestEngineTimer = $timerDefault

  constructor(
    deps?: {
      $equal?: ITestEngineEqual
      $dump?: ITestEngineDump
      $time?: ITestEngineTime
      $stacktrace?: ITestEngineStacktrace
      $timer?: ITestEngineTimer
    }
  ) {
    if (deps) {
      let { $equal, $dump, $stacktrace, $time, $timer } = deps

      if ($equal !== undefined) {
        this.$equal = $equal
      }
      if ($dump !== undefined) {
        this.$dump = $dump
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
    return this.$dump.dump(o)
  }

  now(): number {
    return this.$time.now()
  }

  equalsDeep(o1: any, o2: any): boolean {
    return this.$equal.equalsDeep(o1, o2)
  }

  equalsNear(o1: any, o2: any, epsilon: number): boolean {
    return this.$equal.equalsNear(o1, o2, epsilon)
  }

  equalsProperties(a: any, b: any): boolean {
    return this.$equal.equalsProperties(a, b)
  }

  equalsSame(a: any, b: any): boolean {
    return this.$equal.equalsSame(a, b)
  }

  equalsSimple(a: any, b: any): boolean {
    return this.$equal.equalsSimple(a, b)
  }

  equalsStrict(a: any, b: any): boolean {
    return this.$equal.equalsStrict(a, b)
  }

  setTimeout(f: any, ms: number) {
    return this.$timer.setTimeout(f, ms)
  }

  clearTimeout(id: number) {
    return this.$timer.clearTimeout(id)
  }

  setInterval(f: any, ms: number) {
    return this.$timer.setInterval(f, ms)
  }

  clearInterval(id: number) {
    return this.$timer.clearInterval(id)
  }

  setImmediate(f: any) {
    return this.$timer.setImmediate(f)
  }

  clearImmediate(id: number) {
    return this.$timer.clearImmediate(id)
  }

  run(context: ITestEngineRunContext) {
    let engine = this
    let test = context.getTest()
    try {
      test.run({
        getTest() { return test },
        getTimeout() { return context.getTimeout() },
        getEngine() { return engine },
        onStart() { context.onStart() },
        onAssertion(a: IAssertion) { context.onAssertion(a) },
        onError(e: any) { context.onError(e) },
        onEnd() { context.onEnd() }
      })
    } catch (e) {
      context.onError(e)
      context.onEnd()
    }
  }
}
