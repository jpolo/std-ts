module log {
  //default time
  var $timeDefault = { now: Date.now || function () { return (new Date()).getTime(); } };
  
  
  export interface IEngine {
    isEnabledFor(level: ILevel, group: string): boolean
    send(level: ILevel, group: string, message: string)
  }
  
  export interface ILevel {
    name: string
    value: number
  }
  
  export interface IMessage {
    level: ILevel
    group: string
    message: string
    timestamp: number
  }
  
  export interface IFilter {
    (message?: IMessage): boolean
  }
  
  export interface IReporter {
    receive(logMessage: IMessage) 
  }
  
  export class Level implements ILevel {
    
    static cast(o: any): Level {
      if (o instanceof Level) {
        return o
      } else if (__isNumber(o)) {
        return Level.fromNumber(o)
      } else if (__isString(o)) {
        return Level.fromString(o)
      }
    }
    
    static compare(a: ILevel, b: ILevel): number {
      return a.value - b.value;
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
      return this === o || (!!o && (o instanceof this.constructor) && o.value === this.value)
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
  
  export var DEBUG = Level.create('DEBUG', 0)
  export var INFO = Level.create('INFO', 10)
  export var WARN = Level.create('WARN', 20)
  export var ERROR = Level.create('ERROR', 30)
  export var FATAL = Level.create('FATAL', 40)
  
  export class Message implements IMessage {
  
    static compare(a: IMessage, b: IMessage): number {
      return (
        Level.compare(a.level, b.level) ||
        __strCmp(a.group, b.group) ||
        __strCmp(a.message, b.message)
      )
    }
    
    constructor(
      public level: ILevel, 
      public group: string,
      public message: string,
      public timestamp: number = NaN
    ) {
    }
    
    compare(o: IMessage): number {
      return Message.compare(this, o)
    }
    
    equals(o: any): boolean {
      return this === o || (
        !!o && 
        (o instanceof this.constructor) && 
        this.level.value === o.level.value &&
        this.group === o.group &&
        this.message === o.message
      )
    }
    
    inspect(): string {
      return __format('Message', 
        'level: ' + this.level.name + ', ' +
        'group: "' + this.group + '", ' +
        'message: "' + this.message + '"'
      )
    }
    
    toJSON() {
      return {
        level: this.level.value,
        group: this.group,
        message: this.message,
        timestamp: this.timestamp
      }
    }
    
    toString(): string {
      return '[' + this.level.name + '|' + this.group + '] ' + this.message
    }
  }
  
  export function logger(group: string) {
    return engine.get().logger(group)
  }
  
  export class Logger {
    //static SEPARATOR = '.'
    
    constructor(
      public name: string, 
      private _engine: IEngine
    ) { }
    
    inspect() {
      return __format('Logger', 'name: "' + this.name + '"')
    }
    
    log(level: ILevel, f: () => string): void
    log(level: ILevel, message: string): void
    log(level: ILevel, o: any): void {
      var name = this.name
      var ng = this._engine
      if (__isFunction(o)) {
        if (ng.isEnabledFor(level, name)) {
          ng.send(level, name, o())
        }
      } else {
        ng.send(level, name, o)
      }  
    }
    
    debug(f: () => string): void
    debug(message: string): void
    debug(o: any): void {
      return this.log(DEBUG, o)
    }
    
    info(f: () => string): void
    info(message: string): void
    info(o: any): void {
      return this.log(INFO, o)
    }
    
    warn(f: () => string): void
    warn(message: string): void
    warn(o: any): void {
      return this.log(WARN, o)
    }

    error(f: () => string): void
    error(message: string): void
    error(o: any): void {
      return this.log(ERROR, o)
    }
    
    fatal(f: () => string): void
    fatal(message: string): void
    fatal(o: any): void {
      return this.log(FATAL, o)
    }
    
    toString(): string {
      return this.inspect()
    }
  }

  export module engine {
    interface IEngineReporter { filter?: IFilter; reporter: IReporter; }
    
    /**
     * Default engine 
     */
    var _instance: Engine
    export function get(): Engine {
      return (_instance || (_instance = new Engine()))
    }
    
    export class Engine implements IEngine {  
      reporters: { [key: string]: { filter?: IFilter; reporter: IReporter; } } = {}
      
      private _loggers: { [name: string]: Logger } = {}
      
      //Services
      private $time: { now: () => number } = $timeDefault
      
      constructor(
        deps?: {
          $time?: { now: () => number }
        }
      ) {
        if (deps) {
          if (deps.$time) {
            this.$time = deps.$time;
          }
        }
      }
      
      logger(name: string): Logger {
        var loggers = this._loggers
        return loggers[name] || (loggers[name] = new Logger(name, this))
      }
      
      isEnabledFor(level: ILevel, group: string): boolean {
        var returnValue = false
        var reporters = this.reporters
        var logMessage = this.message(level, group, null)
        var names = __keys(reporters)
        for (var i = 0, l = names.length; i < l; ++i) {
          var target = reporters[names[i]]
          if (__filter(target, logMessage)) {
            returnValue = true
            break
          }
        } 
        return returnValue
      }
      
      message(level: ILevel, group: string, message: string): Message {
        return new Message(level, group, message, this.$time.now())
      }

      send(level: ILevel, group: string, message: string): void {
        var reporters = this.reporters
        var logMessage = this.message(level, group, message)
        var names = __keys(reporters)
        for (var i = 0, l = names.length; i < l; ++i) {
          var target = reporters[names[i]]
          if (__filter(target, logMessage)) {
            __send(target, logMessage)
          }
        }
      }

    }
    
    //util
    function __filter(f: IEngineReporter, m: IMessage): boolean {
      try {
        return f.filter ? f.filter(m) || false : true
      } catch (e) {
        __throwAsync(e);
      }
    }
    
    function __send(f: IEngineReporter, m: IMessage): boolean {
      try {
        return f.reporter.receive(m)
      } catch (e) {
        __throwAsync(e);
      }
    }
  }
  
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
  
    export class Array implements IReporter {
    
      constructor(public logs: IMessage[] = []) { }
      
      receive(logMessage: IMessage) {
        this.logs.push(logMessage)
      }
    
    }
    
    export class Console implements IReporter {

      constructor() {}
      
      receive(logMessage: IMessage) {
        if (__console) {
          var formatted = __str(logMessage)
          var levelValue = logMessage.level.value
            
          if (levelValue >= ERROR.value) {
            __console.error(formatted)
          } else if (levelValue >= WARN.value) {
            __console.warn(formatted)
          } else if (levelValue >= INFO.value) {
            __console.info(formatted)
          } else { //Debug
            __console.debug(formatted)
          }
        }
      }
      
    }
  
  }
  
  //util
  var __global: Window = (new Function("return this;")).call(null);
  var __console: Console = typeof console !== "undefined" ? __global.console : null;
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' };
  var __isNumber = function (o: any) { return typeof o == 'number'; };
  var __isString = function (o: any) { return typeof o == 'string'; };
  var __isFunction = function(o: any) { return typeof o == 'function'; };
  var __keys = Object.keys; 
  var __str = String;
  var __strCmp = function(a: string, b: string) { return a === b ? 0 : a > b ? 1 : -1 };
  var __throwAsync = function(e) { setTimeout(() => { throw e; }, 0); };
  
}
export = log