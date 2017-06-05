// Util
const Global: Window = typeof window !== 'undefined' ? window : (function() { return this; }());
const GlobalConsole: Console = Global.console ? Global.console : {} as any;
const Timer = (function() {
  const timers = {};
  return {
    time(timerName: string) {
      timers[timerName] = Now();
    },
    timeEnd(timerName: string) {
      const start = timers[timerName];
      if (start) {
        Log('log', timerName + ': ' + (Now() - start) + 'ms');
        delete timers[timerName];
      }
    }
  };
}());
function Void(...args: any[]): void { return undefined; }
function Now() { return Date.now ? Date.now() : (new Date()).getTime(); }

function FunctionApply(f: Function, thisp: any, args: any) {
  const argc = args && args.length || 0;
  switch (argc) {
    case 0: return f.call(thisp);
    case 1: return f.call(thisp, args[0]);
    default: return f.apply(thisp, args);
  }
}

function Log(level: string, args: any) {
  const console = Global.console;
  if (console) {
    if (console[level]) {
      FunctionApply(console[level], console, args);
    } else if (console.log) {
      FunctionApply(console.log, console, args);
    }
  }
}

export interface IConsoleModule {
  assert(test?: boolean, message?: string, ...args: any[]): void;
  clear(): void;
  count(countTitle?: string): void;
  dir(object: any): void;
  dirxml(object: any): void;
  log(message?: any, ...args: any[]): void;
  debug(message?: any, ...args: any[]): void;
  warn(message?: any, ...args: any[]): void;
  info(message?: any, ...args: any[]): void;
  error(message?: any, ...args: any[]): void;
  group(groupTitle?: string): void;
  groupEnd(): void;
  profile(reportName?: string): void;
  profileEnd(): void;
  time(timerName: string): void;
  timeEnd(timerName: string): void;
}

export function assert(test?: boolean, message?: string, ...args: any[]): void {
  if (GlobalConsole.assert) {
    FunctionApply(GlobalConsole.assert, GlobalConsole, [message].concat(args));
  } else {
    if (!test) {
      Log('error', [ 'Assertion failed:', message ].concat(args));
    }
  }
}

export function clear(): void {
  (GlobalConsole.clear || Void)();
}

export function count(countTitle?: string): void {
  (GlobalConsole.count || Void)(countTitle);
}

export function dir(object: any): void {
  if (GlobalConsole.dir) {
    GlobalConsole.dir(object);
  } else {
    Log('log', [object]);
  }
}

export function dirxml(object: any): void {
  if (GlobalConsole.dirxml) {
    GlobalConsole.dirxml(object);
  } else {
    Log('log', [object]);
  }
}

export function log(message?: any, ...args: any[]): void;
export function log(...args: any[]): void {
  Log('log', args);
}

export function debug(message?: any, ...args: any[]): void;
export function debug(...args: any[]): void {
  Log('debug', args);
}

export function info(message?: any, ...args: any[]): void;
export function info(...args: any[]): void {
  Log('info', args);
}

export function warn(message?: any, ...args: any[]): void;
export function warn(...args: any[]): void {
  Log('warn', args);
}

export function error(message?: any, ...args: any[]): void;
export function error(...args: any[]): void {
  Log('error', args);
}

export function groupCollapsed(groupTitle?: string): void {
  (GlobalConsole.groupCollapsed || Void)(groupTitle);
}

export function group(groupTitle?: string): void {
  (GlobalConsole.group || Void)(groupTitle);
}

export function groupEnd(): void {
  (GlobalConsole.groupEnd || Void)();
}

export function profile(reportName?: string): void {
  (GlobalConsole.profile || Void)(reportName);
}

export function profileEnd(): void {
  (GlobalConsole.profileEnd || Void)();
}

export function time(timerName: string): void {
  (GlobalConsole.time || Timer.time)(timerName);
}

export function timeEnd(timerName: string): void {
  (GlobalConsole.timeEnd || Timer.timeEnd)(timerName);
}

export function trace(): void {
  (GlobalConsole.trace || Void)();
}
