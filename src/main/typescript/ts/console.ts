// Util
const Global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const GlobalConsole: Console = Global.console ? Global.console : <any>{};
function Void() {}
function Now() { return Date.now ? Date.now() : (new Date()).getTime(); }
function Each<T>(a: T[], f: (v: T, i?: number, a?: T[]) => void) {
  for (var i = 0, l = a.length; i < l; ++i) {
    f(a[i], i, a);
  }
};

// COMPAT
if (!Global.console) {

  if (!GlobalConsole.log) {
    GlobalConsole.log = Void;
  }

  // Implement other log levels to console.log if missing
  Each([ "debug", "info", "warn", "error", "dir", "dirxml" ], (v) => {
    if (!GlobalConsole[v]) {
      GlobalConsole[v] = GlobalConsole.log;
    }
  });

  // Implement console.assert if missing
  if (!GlobalConsole.assert) {
    GlobalConsole.assert = function assert(expr, ...args: any[]) {
      if (!expr) {
        GlobalConsole.error.apply(GlobalConsole, [ "Assertion failed:" ].concat(args));
      }
    };
  }

  // Implement console.time and console.timeEnd if one of them is missing
  if (!GlobalConsole.time || !GlobalConsole.timeEnd) {
    let timers = {};
    GlobalConsole.time = function time(id) {
      timers[id] = Now();
    };
    GlobalConsole.timeEnd = function timeEnd(id) {
      let start = timers[id];
      if (start) {
        GlobalConsole.log(id + ": " + (Now() - start) + "ms");
        delete timers[id];
      }
    };
  }

  // Dummy implementations of other console features to prevent error messages
  // in browsers not supporting it.
  Each(["clear", "trace", "group", "groupEnd", "profile", "profileEnd", "count"], (v, i) => {
    if (!GlobalConsole[v]) {
      GlobalConsole[v] = Void;
    }
  });
}
export default GlobalConsole;
