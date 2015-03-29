//Constant
var ES3_COMPAT = true;
var ES5_COMPAT = true;

//Util
var __void = function () {};
var __now = Date.now || function () { return new Date().getTime(); }
var __global: any = (new Function("return this;")).call(null);
var __console: Console = __global.console ? __global.console : null;
var __forEach = function <T>(a: T[], f: (v: T, i?: number, a?: T[]) => void) {
  for (var i = 0, l = a.length; i < l; ++i) {
    f(a[i], i, a);
  }
};

//COMPAT
if (ES3_COMPAT) {
  __console = __console || <any>{};
  
  if (!__console.log) __console.log = __void;

  // Implement other log levels to console.log if missing
  __forEach([
    "debug", 
    "info", 
    "warn", 
    "error",
    
    "dir",
    "dirxml"
  ], (v) => {
    if (!__console[v]) {
      __console[v] = __console.log;
    }
  });

  // Implement console.assert if missing
  if (!__console.assert) {
    __console.assert = function (expr, ...args: any[]) {
      if (!expr) {
        __console.error.apply(__console, [ "Assertion failed:" ].concat(args));
      }
    };
  }
  
  // Implement console.time and console.timeEnd if one of them is missing
  if (!__console.time || !__console.timeEnd) {
    var timers = {};
    __console.time = function(id) {
      timers[id] = __now();
    };
    __console.timeEnd = function(id) {
      var start = timers[id];
      if (start) {
        __console.log(id + ": " + (__now() - start) + "ms");
        delete timers[id];
      }
    };
  }
  
  // Dummy implementations of other console features to prevent error messages
  // in browsers not supporting it.
  __forEach([
    "clear", 
    "trace", 
    "group", 
    "groupEnd", 
    "profile",
    "profileEnd",
    "count"
  ], (v, i) => {
    if (!__console[v]) {
      __console[v] = __void;
    }
  });
}
export = __console;