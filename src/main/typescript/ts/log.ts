import console from "./console"

//Constant
const ES_COMPAT = 3;

//Util
const __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const __void = function () {};
const __format = function (n: string, s: string) { return n + ' { ' + s + ' }' };
const __keys = Object.keys || function (o) { var ks = []; for (var k in o) { if (o.hasOwnProperty(k)) { ks.push(k); } } return ks; };;
const __cmp = function(a: any, b: any) { return a === b ? 0 : a > b ? 1 : -1 };
const __str = function (o) { return "" + o; };
const __strCmp = function(a: string, b: string) { return a === b ? 0 : a > b ? 1 : -1 };
const __throwAsync = function(e) { setTimeout(() => { throw e; }, 0); };
const __arrayCmp = function <T>(a: T[], b: T[], cmpFn: (a: T, b: T) => number): number {
  var returnValue = 0
  var al = a.length
  var bl = b.length
  if (al === bl) {
    for (var i = 0, l = al; i < l; ++i) {
      var r = cmpFn(a[i], b[i]);
      if (r !== 0) {
        returnValue = r
        break
      }
    }
  }
  return returnValue
};


//Services
type $Console = {
  debug(...a: any[]);
  info(...a: any[]);
  warn(...a: any[]);
  error(...a: any[]);
};
type $Time = { now: () => number };

const $consoleDefault: $Console = console;
const $timeDefault: $Time = { now: Date.now || function () { return (new Date()).getTime(); } };

export interface IDispatcher {
  isEnabledFor(level: ILevel, group: string): boolean
  send(level: ILevel, group: string, data: any[])
}

export interface ILevel {
  name: string
  value: number
}

export interface IMessage {
  level: ILevel
  group: string
  //message: string
  data: any[]
  timestamp: number
}

export interface IFilter {
  (message?: IMessage): boolean
}

export interface IReporter {
  receive(message: IMessage)
}

export class Level implements ILevel {

  static cast(o: any): Level {
    if (o instanceof Level) {
      return o
    } else if (typeof o === "number") {
      return Level.fromNumber(o)
    } else if (typeof o === "string") {
      return Level.fromString(o)
    }
  }

  static compare(lhs: ILevel, rhs: ILevel): number {
    var returnValue = NaN;
    if (lhs != null && rhs != null) {
      var lv = lhs.value;
      var rv = rhs.value;
      returnValue = lv === rv ? 0 : lv < rv ? -1 : 1;
    }
    return returnValue;
  }

  static create(name: string, level: number): Level {
    name = name.toUpperCase()
    level = level >>> 0
    var byName = Level._byValue
    var byValue = Level._byValue
    if (byName[name]) {
      throw new Error(byName[name] + ' is already defined')
    }
    if (byValue[level]) {
      throw new Error(byValue[level] + ' is already defined')
    }
    var levelObj = byName[name] = byValue[level] = new Level(name, level, Level._constructorKey);
    return levelObj
  }

  static fromNumber(val: number): Level {
    return Level._byValue[val >>> 0];
  }

  static fromString(s: string): Level {
    return Level._instances[s.toUpperCase()];
  }

  private static _instances: {[key: string]: Level} = {}
  private static _byValue: {[key: number]: Level} = {}
  private static _constructorKey = {};

  constructor(
    public name: string,
    public value: number,
    constructorKey: any
  ) {
    if (constructorKey !== Level._constructorKey) {
      throw new Error('new Level() cannot be called directly');
    }
  }

  compare(l: ILevel): number {
    return Level.compare(this, l)
  }

  equals(o: any): boolean {
    return this === o || (!!o && (o instanceof Level) && Level.compare(this, o) === 0)
  }

  valueOf() {
    return this.value
  }

  inspect(): string {
    return __format('Level', 'name: "' + this.name + '", value: ' + this.value)
  }

  toJSON() {
    return this.value
  }

  toString(): string {
    return this.name
  }
}

export const DEBUG = Level.create('DEBUG', 0)
export const INFO = Level.create('INFO', 10)
export const WARN = Level.create('WARN', 20)
export const ERROR = Level.create('ERROR', 30)
export const FATAL = Level.create('FATAL', 40)

export class Message implements IMessage {

  static compare(a: IMessage, b: IMessage): number {
    return (
      Level.compare(a.level, b.level) ||
      __strCmp(a.group, b.group) ||
      __arrayCmp(a.data, b.data, __cmp)
    )
  }

  constructor(
    public level: ILevel,
    public group: string,
    public data: any[],
    public timestamp: number = NaN
  ) {
  }

  compare(o: IMessage): number {
    return Message.compare(this, o)
  }

  equals(o: any): boolean {
    return this === o || (
      !!o &&
      (o instanceof Message) &&
      Message.compare(this, o) === 0
    )
  }

  inspect(): string {
    return __format('Message',
      'level: ' + this.level.name + ', ' +
      'group: "' + this.group + '", ' +
      'data: "' + this.data + '"'
    )
  }

  toJSON() {
    return {
      level: this.level.value,
      group: this.group,
      data: this.data,
      timestamp: this.timestamp
    }
  }

  toString(): string {
    return '[' + this.level.name + '|' + this.group + '] ' + this.data.join(" ")
  }
}

export function logger(group: string): Logger {
  return $dispatcher.getLogger(group)
}

/*
function loggerFor(o: any): Logger {
  switch (typeof o) {
    case "object": return logger(o.constructor.name);
    case "function": return logger(o.name);
  }
}
*/

export class Logger {
  //static SEPARATOR = '.'

  protected $dispatcher: IDispatcher

  constructor(
    public name: string,
    $dispatcher: IDispatcher
  ) {
    this.$dispatcher = $dispatcher
  }

  inspect() {
    return __format('Logger', 'name: "' + this.name + '"')
  }

  log(level: ILevel, ...args: any[]): void {
    this._dispatch(level, args);
  }

  debug(...args: any[]): void {
    this._dispatch(DEBUG, args);
  }

  info(...args: any[]): void {
    this._dispatch(INFO, args);
  }

  warn(...args: any[]): void {
    this._dispatch(WARN, args);
  }

  error(...args: any[]): void {
    this._dispatch(ERROR, args);
  }

  fatal(...args: any[]): void {
    this._dispatch(FATAL, args);
  }

  toString(): string {
    return this.inspect()
  }

  protected _dispatch(level: ILevel, args: any[]): void  {
    var name = this.name
    var dispatcher = this.$dispatcher
    if (!dispatcher) {
      throw new Error("dispatcher is required");
    }

    //if (dispatcher.isEnabledFor(level, name)) {
    dispatcher.send(level, name, args);
    //}
  }
}

export class Dispatcher implements IDispatcher {
  reporters: { [key: string]: { filter?: IFilter; reporter: IReporter; } } = {}

  protected _loggers: { [name: string]: Logger } = {}

  //Services
  protected $time: $Time = $timeDefault

  constructor(
    deps?: {
      $time?: $Time
    }
  ) {
    if (deps) {
      if (deps.$time !== undefined) {
        this.$time = deps.$time;
      }
    }
  }

  getLogger(name: string): Logger {
    var loggers = this._loggers
    return loggers[name] || (loggers[name] = new Logger(name, this))
  }

  isEnabledFor(level: ILevel, group: string): boolean {
    var returnValue = false
    var reporters = this.reporters
    var logMessage = new Message(level, group, null)
    var names = __keys(reporters)
    for (let name of names) {
      var target = reporters[name]
      if (__filter(target, logMessage)) {
        returnValue = true
        break
      }
    }
    return returnValue
  }

  send(level: ILevel, group: string, data: any[]): void {
    var reporters = this.reporters;
    var logMessage = new Message(level, group, data, this.$time.now());
    var names = __keys(reporters)
    for (let name of names) {
      var target = reporters[name]
      if (__filter(target, logMessage)) {
        __send(target, logMessage)
      }
    }
  }

}

//util
function __filter(f: { filter?: IFilter; reporter: IReporter; }, m: IMessage): boolean {
  try {
    return f.filter ? f.filter(m) || false : true
  } catch (e) {
    __throwAsync(e);
  }
}

function __send(f: { filter?: IFilter; reporter: IReporter; }, m: IMessage): boolean {
  try {
    return f.reporter.receive(m)
  } catch (e) {
    __throwAsync(e);
  }
}


/**
 * Default engine
 */
var $dispatcher: Dispatcher = new Dispatcher();

/*filter.and(
  filter.level("DEBUG", '>'),
  filter.name('test')
)

export module filter {

  export function always(b: boolean) {
    return _create((m: IMessage) => b)
  }

  export function level(l: ILevel, op?: string): IFilter
  export function level(l: string, op?: string): IFilter
  export function level(l: any, op = '='): IFilter {
    var level = Level.cast(l) || __throw('')
    var lValue = level.value
    var returnValue: IFilter
    switch (op) {
      case '=':
        returnValue = _create((m: IMessage) => m.level.value === lValue)
        break
      default:
        throw new Error(op)
    }
    return returnValue
  }

  export function group(s: string): IFilter
  export function group(s: RegExp): IFilter
  export function group(s: any): IFilter {
    var fn = _matcher(s)
    return _create((m: IMessage) => fn(m.group))
  }

  export function not(f: IFilter): IFilter {
    return _create((m: IMessage) => !_call(f, m))
  }

  export function and(...filters: IFilter[]): IFilter {
    return _create((m: IMessage) => filters.every((f) => _call(f, m)))
  }

  export function or(...filters: IFilter[]): IFilter {
    return _create((m: IMessage) => filters.some((f) => _call(f, m)))
  }

  function _create(f: (m: IMessage) => boolean): IFilter {
    return f
  }

  function _call(f: IFilter, m: IMessage) {
    return f(m)
  }

  function _matcher(s: any): (o: any) => boolean {
    if (s instanceof RegExp) {
      return function (o: any) {
        return s.test(o)
      }
    } else {
      return function (o: any) {
        return o === s
      }
    }
  }
}*/

export module reporter {
  type $ConsoleFormatter = (logMessage: IMessage) => any[];
  var $consoleFormatterDefault: $ConsoleFormatter = function (logMessage: IMessage) {
    return ['[' + logMessage.group + ']'].concat(logMessage.data);
  };

  export class Array implements IReporter {

    constructor(public logs: IMessage[] = []) { }

    receive(logMessage: IMessage) {
      this.logs.push(logMessage)
    }

  }


  export class Console implements IReporter {
    //Services
    protected $formatter: $ConsoleFormatter = $consoleFormatterDefault;
    protected $console: $Console = $consoleDefault;

    constructor(deps: {
      $formatter?: $ConsoleFormatter;
      $console?: $Console
    }) {
      if (deps) {
        if (deps.$formatter !== undefined) {
          this.$formatter = deps.$formatter;
        }
        if (deps.$console !== undefined) {
          this.$console = deps.$console;
        }
      }
    }

    receive(logMessage: IMessage) {
      var console = this.$console;
      if (console) {
        var args = this.$formatter(logMessage)
        var levelValue = logMessage.level.value

        if (levelValue >= ERROR.value) {
          console.error.apply(console, args)
        } else if (levelValue >= WARN.value) {
          console.warn.apply(console, args)
        } else if (levelValue >= INFO.value) {
          console.info.apply(console, args)
        } else { //Debug
          console.debug.apply(console, args)
        }
      }
    }
  }
}
