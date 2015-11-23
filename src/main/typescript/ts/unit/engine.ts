import { IInspector, Inspector } from "../inspect";
import * as equal from "./equal";
import * as stacktrace from "../stacktrace";
import * as time from "../time";
import * as timer from "../timer";
import { IAssertion, IAssertionCallSite } from "./assertion";
import { IsFinite, ObjectAssign } from "./util";


// Service
interface ITestEngineEqual {
  equalsSame(lhs: any, rhs: any): boolean;
  equalsSimple(lhs: any, rhs: any): boolean;
  equalsStrict(lhs: any, rhs: any): boolean;
  equalsNear(lhs: any, rhs: any, epsilon: any): boolean;
  equalsProperties(lhs: any, rhs: any, equalsFn: (a: any, b: any) => boolean): boolean;
  equalsDeep(lhs: any, rhs: any): boolean;
}
interface ITestEngineDump {
  dump(o: any): string;
}
interface ITestEngineStacktrace {
  callstack(): IAssertionCallSite[];
}
interface ITestEngineTime extends time.ITimeModule {}
interface ITestEngineTimer extends timer.ITimerModule {}
interface ITestEngineRun {
  run(context: ITestEngineRunContext);
}

export interface ITestEngineRunContext {
  getTimeout(): number;
  getTest(): ITest;
  onStart(): void;
  onAssertion(a: IAssertion): void;
  onError(e: any): void;
  onEnd(): void;
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
  category: string;
  name: string;
  run(context: ITestRunContext): void;
}

export interface ITestRunContext extends ITestEngineRunContext {
  getEngine(): ITestEngine;
}

const $equalDefault: ITestEngineEqual = equal;
const $dumpDefault: ITestEngineDump = (function () {
  let inspector = new Inspector({ maxString: 70 });
  return {
    dump(o: any) {
      return inspector.stringify(o);
    }
  };
}());
const $timeDefault: ITestEngineTime = time;
const $stacktraceDefault: ITestEngineStacktrace = {
  callstack() { return stacktrace.create(); }
};
const $timerDefault: ITestEngineTimer = timer;


class Context<T> {

  static unit = new Context();

  static empty() {
    return new Context();
  }

  static create<T>(o: T): Context<T> & T {
    let returnValue: any = new Context();
    ObjectAssign(returnValue, o);
    return returnValue;
  }

  createChild<U>(ext: U): Context<T & U> & T & U {
    let returnValue: any = new Context();
    ObjectAssign(ObjectAssign(returnValue, this), ext);
    return returnValue;
  }
}

export class Engine implements ITestEngine {

  // Services
  protected $dump: ITestEngineDump = $dumpDefault;
  protected $equal: ITestEngineEqual = $equalDefault;
  protected $stacktrace: ITestEngineStacktrace = $stacktraceDefault;
  protected $time: ITestEngineTime = $timeDefault;
  protected $timer: ITestEngineTimer = $timerDefault;

  constructor(
    deps?: {
      $dump?: ITestEngineDump
      $equal?: ITestEngineEqual
      $stacktrace?: ITestEngineStacktrace
      $time?: ITestEngineTime
      $timer?: ITestEngineTimer
    }
  ) {
    if (deps) {
      let { $equal, $dump, $stacktrace, $time, $timer } = deps;

      if ($equal !== undefined) {
        this.$equal = $equal;
      }
      if ($dump !== undefined) {
        this.$dump = $dump;
      }
      if ($stacktrace !== undefined) {
        this.$stacktrace = $stacktrace;
      }
      if ($time !== undefined) {
        this.$time = $time;
      }
      if ($timer !== undefined) {
        this.$timer = $timer;
      }
    }
  }

  callstack(): IAssertionCallSite[] {
    return this.$stacktrace.callstack();
  }

  dump(o: any): string {
    return this.$dump.dump(o);
  }

  now(): number {
    return this.$time.now();
  }

  equalsDeep(o1: any, o2: any): boolean {
    return this.$equal.equalsDeep(o1, o2);
  }

  equalsNear(o1: any, o2: any, epsilon: number): boolean {
    return this.$equal.equalsNear(o1, o2, epsilon);
  }

  equalsProperties(a: any, b: any, equalsFn: (a: any, b: any) => boolean): boolean {
    return this.$equal.equalsProperties(a, b, equalsFn);
  }

  equalsSame(a: any, b: any): boolean {
    return this.$equal.equalsSame(a, b);
  }

  equalsSimple(a: any, b: any): boolean {
    return this.$equal.equalsSimple(a, b);
  }

  equalsStrict(a: any, b: any): boolean {
    return this.$equal.equalsStrict(a, b);
  }

  setTimeout(f: any, ms?: number) {
    return this.$timer.setTimeout(f, ms);
  }

  clearTimeout(id: number) {
    return this.$timer.clearTimeout(id);
  }

  setInterval(f: any, ms?: number) {
    return this.$timer.setInterval(f, ms);
  }

  clearInterval(id: number) {
    return this.$timer.clearInterval(id);
  }

  setImmediate(f: any) {
    return this.$timer.setImmediate(f);
  }

  clearImmediate(id: number) {
    return this.$timer.clearImmediate(id);
  }

  run(context: ITestEngineRunContext) {
    let engine = this;
    let test = context.getTest();
    let timeoutMs = context.getTimeout();
    let opened = true;
    let timerId: number = null;
    let stream: ITestRunContext = {
      getTest() { return test; },
      getTimeout() { return timeoutMs; },
      getEngine() { return engine; },
      onStart() {
        context.onStart();
      },
      onAssertion(a: IAssertion) {
        if (opened) {
          context.onAssertion(a);
        }
      },
      onError(e: any) {
        if (opened) {
          context.onError(e);
        }
      },
      onEnd() {
        if (opened) {
          opened = false;
          if (timerId) {
            engine.clearTimeout(timerId);
            timerId = null;
          }
          context.onEnd();
        }
      }
    };

    // timeout
    if (IsFinite(timeoutMs)) {
      timerId = engine.setTimeout(() => {
        timerId = null;
        stream.onError(new Error("No test completion after " + timeoutMs + "ms"));
        stream.onEnd();
      }, timeoutMs);
    }

    try {
      test.run(stream);
    } catch (e) {
      context.onError(e);
      context.onEnd();
    }
  }
}
