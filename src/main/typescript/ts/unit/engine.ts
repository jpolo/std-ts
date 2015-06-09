import unit = require("ts/unit")
import ITestEngine = unit.ITestEngine
import ITest = unit.ITest
import ITestReport = unit.ITestReport
import ITestParams = unit.ITestParams
import ITestHandlers = unit.ITestHandlers
import reflect = require("ts/reflect")
import inspect = require("ts/inspect")
import stacktrace = require("ts/stacktrace")
import assertion = require("ts/unit/assertion")
import IAssertion = assertion.IAssertion
import IAssertionCallSite = assertion.IAssertionCallSite

module engine {
  
  //Util
  var __isNaN = function (o: any) { return o !== o; };
  var __isFinite = isFinite;
  var __isNumber = function (o) { return typeof o === 'number'; };
  var __isObject = function (o) { return o != null && (typeof o == "object"); };
  var __keys = reflect.ownKeys;
  var __keysSorted = function (o: any) { return __keys(o).sort(); };
  var __stringTag = reflect.stringTag;
  
  //Service
  type $Equal = { 
    is(lhs: any, rhs: any): boolean
    equals(lhs: any, rhs: any): boolean
    equalsNear(lhs: any, rhs: any, epsilon: any): boolean
    equalsDeep(lhs: any, rhs: any): boolean
  }
  type $Inspector = inspect.IInspector
  type $Stacktrace = { create(): IAssertionCallSite[] }
  type $Time = { now(): number }
  
  var $equalDefault: $Equal = (function () {
    
    function is(a, b) { 
      return (
        a === 0 && b === 0 ? 1 / a === 1 / b :
        a === b ? true :
        __isNaN(a) && __isNaN(b) ? true :
        false
      )
    }
    
    function equals(a, b) {
      return (
        is(a, b) ||
        (
          (a != null) && a.equals ? a.equals(b) :
          (b != null) && b.equals ? b.equals(a) :
          a == b
        )
      )
    }
    
    function equalsStrict(a: any, b: any) { return a === b };
    
    function equalsNear(a: any, b: any, epsilon: number) {
      var isnum1 = __isNumber(a)
      var isnum2 = __isNumber(b)
      return (
        (isnum1 || isnum2) ? (isnum1 === isnum2) && (a == b || equalsFloat(a, b, epsilon)) :
        (a != null && a.equalsNear) ? a.equalsNear(b) :
        (b != null && b.equalsNear) ? b.equalsNear(a) :
        false
      )
    }
    
    function equalsArray(a: any[], b: any[], equalFn: (av: any, bv: any) => boolean) {
      var returnValue = true
      var al = a.length
      var bl = b.length
  
      if (al === bl) {
        for (var i = 0, l = al; i < l; ++i) {
          if (!equalFn(a[i], b[i])) {
            returnValue = false
            break
          }
        }
      }
      return returnValue
    }
    
    function equalsDeep(a, b) {

      function equals(o1, o2) {
        if (!is(o1, o2)) {
          switch (__stringTag(o1)) {
            case 'Undefined':
            case 'Null':
            case 'Boolean':
              return false
            case 'Number':
              return (__stringTag(o2) === 'Number') && (__isNaN(o1) && __isNaN(o2))
            case 'String':
              return (__stringTag(o2) === 'String') && (o1 == o2)
            case 'Array':
              return (o2 != null) && equalsArray(o1, o2, equals)
            case 'Object':
            case 'Function':
            default:
              var keys1 = __keysSorted(o1)
              var keys2 = __isObject(o2) ? __keysSorted(o2) : null
              var keyc = keys1.length
              if (keys2 && equalsArray(keys1, keys2, equalsStrict)) {
                for (var i = 0; i < keyc; ++i) {
                  var key = keys1[i]
                  if (!equals(o1[key], o2[key])) {
                    return false
                  }
                }
              }
              return true
          }
        }
        return true
      }
      return equals(a, b)
    }
    
    function equalsFloat(a: number, b: number, epsilon: number) {
      return (
        __isNaN(b) ? __isNaN(a) :
        __isNaN(a) ? false :
        !__isFinite(b) && !__isFinite(a) ? (b > 0) == (a > 0) :
        Math.abs(a - b) < epsilon
      )
    };
    
    return {
      is: is,
      equals: equals,
      equalsNear: equalsNear,
      equalsDeep: equalsDeep
    };
  }());

  var $inspectDefault: $Inspector = new inspect.Inspector({ maxString: 70 });
  var $timeDefault: $Time = { now: Date.now || function () { return (new Date()).getTime(); } };
  var $stacktraceDefault: $Stacktrace = stacktrace;
  
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

    currentTime(): number {
      return this.$time.now()
    }

    testEqualsStrict(a: any, b: any): boolean {
      return this.$equal.is(a, b)
    }

    testEquals(a: any, b: any): boolean {
      return this.$equal.equals(a, b)
    }

    testEqualsNear(o1: any, o2: any, epsilon: number): boolean {
      return this.$equal.equalsNear(o1, o2, epsilon);
    }

    testEqualsDeep(o1: any, o2: any): boolean {
      return this.$equal.equalsDeep(o1, o2)
    }

    run(
      tests: ITest[], 
      params: ITestParams, 
      handlers: ITestHandlers
    ) {
      var remaining = tests.length
      var runTest = (testCase: ITest) => {
        handlers.onTestStart(tests, testCase)
        testCase.run(this, params, function (report: ITestReport) {
          handlers.onTestEnd(tests, testCase, report)
          if (--remaining === 0) {
            handlers.onEnd(tests/*, reports*/)
          }
        })
      }

      handlers.onStart(tests);
      for (var i = 0, l = tests.length; i < l; ++i) {
        runTest(tests[i])
      }
    }
  }
  
  export var instance = new Engine();
  
}
export = engine