module log {
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' }
  var __isString = function (o) { return typeof o == 'string'; }
  var __isFunction = function (o) { return typeof o == 'function'; }
  var __now = Date.now || function () { return (new Date()).getTime(); }
  var __str = String
  
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
      } else if (__isString(o)) {
        return Level.fromString(o)
      }
    }
    
    static compare(a: ILevel, b: ILevel): number {
      return a.value - b.value
    }
    
    static fromString(s: string): Level {
      return Level._instances[s.toUpperCase()]
    }
    
    static create(name: string, level: number): Level {
      name = name.toUpperCase()
      var levels = Level._instances
      var levelObj = levels[name]
      if (levelObj) {
        throw new Error(levelObj + ' is already defined')
      }
      levelObj = levels[name] = new Level(name, level >>> 0)
      return levelObj
    }
    
    private static _instances: {[key: string]: Level} = {}
    
    constructor(
      public name: string, 
      public value: number
    ) { }
    
    equals(o: any): boolean {
      return this === o || (o && (o instanceof this.constructor) && o.value === this.value)
    }
    
    compare(l: ILevel): number {
      return Level.compare(this, l)
    }
    
    valueOf() {
      return this.value
    }
    
    inspect(): string {
      return __format('Level', 'name: "' + this.name + '", value: ' + this.value)
    }
    
    toJSON() {
      return this.name
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
  
    constructor(
      public level: ILevel, 
      public group: string = "",
      public message: string = "",
      public timestamp: number = __now()
    ) {
    }
    
    equals(o: any): boolean {
      return this === o || (
        o && 
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
    
    /**
     * Default engine 
     */
    var _instance: Engine
    export function get(): Engine {
      return (_instance || (_instance = new Engine()))
    }
    
    export class Engine implements IEngine {  
      reporters: { [key: string]: { filter: IFilter; reporter: IReporter; } } = {}
      
      private _loggers: { [name: string]: Logger } = {}
      
      logger(name: string): Logger {
        var loggers = this._loggers
        return loggers[name] || (loggers[name] = new Logger(name, this))
      }
      
      isEnabledFor(level: ILevel, group: string): boolean {
        var returnValue = false
        var reporters = this.reporters
        var logMessage = new Message(level, group, null)
        var names = Object.keys(reporters)
        for (var i = 0, l = names.length; i < l; ++i) {
          var target = reporters[names[i]]
          var filter = target.filter
          if (filter(logMessage)) {
            returnValue = true
            break
          }
        } 
        return returnValue
      }

      send(level: ILevel, group: string, message: string): void {
        var reporters = this.reporters
        var logMessage = new Message(level, group, message)
          
        var names = Object.keys(reporters)
        for (var i = 0, l = names.length; i < l; ++i) {
          var target = reporters[names[i]]
          var filter = target.filter
          var reporter = target.reporter
          if (filter(logMessage)) {
            reporter.receive(logMessage)
          }
        }
      }
    }
    
  }
  
  /*filter.and(
    filter.level("DEBUG", '>'),
    filter.name('test')
  )
  
  export module filter {
  
    
    export function level(l: ILevel, op?: string): IFilter
    export function level(l: string, op?: string): IFilter
    export function level(l: any, op = '='): IFilter {
      var lValue = l.value
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
    
    export function name(s: string): IFilter
    export function name(s: RegExp): IFilter
    export function name(s: any): IFilter {
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
      return { filter: f }
    }
    
    function _call(f: IFilter, m: IMessage) {
      return f.filter(m)
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
  
    export class Simple implements IReporter {
    
      logs: string[] = []
    
      receive(logMessage: IMessage) {
        this.logs.push(__str(logMessage))
      }
    
    }
    
    export class Console implements IReporter {
    
      private _console: any
      
      constructor(options?: {
        console?: { 
          debug: (s: string) => void; 
          info: (s: string) => void; 
          warn: (s: string) => void;
          error: (s: string) => void;
        }
      }) {
        this._console = options.console || window.console
      }
      
      receive(logMessage: IMessage) {
        var console = this._console
        var formatted = __str(logMessage)
        var levelValue = logMessage.level.value
          
        if (levelValue >= ERROR.value) {
          console.error(formatted)
        } else if (levelValue >= WARN.value) {
          console.warn(formatted)
        } else if (levelValue >= INFO.value) {
          console.info(formatted)
        } else { //Debug
          console.debug(formatted)
        }
      }
      
    }
  
  }
  
}
export = log