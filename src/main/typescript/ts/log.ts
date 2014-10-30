module log {
  var __now = Date.now || function () { return (new Date()).getTime(); }
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' }
  
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
  
  export interface IReporter {
    receive(logMessage: IMessage) 
  }
  
  export class Level implements ILevel {

    static create(name: string, level: number): Level {
      name = name.toUpperCase()
      var levels = Level._instances
      var logger = levels[name]
      if (logger) {
        throw new Error(logger + ' is already defined')
      }
      logger = levels[name] = new Level(name, level >>> 0)
      return logger
    }
    
    private static _instances: {[key: string]: Level} = {}
    
    constructor(
      public name: string, 
      public value: number
    ) { }
    
    equals(o: any) {
      return (
        o && 
        (o instanceof Level) && 
        o.value === this.value
      )
    }
    
    valueOf() {
      return this.value
    }
    
    toString() {
      return __format('Level', this.name)
    }
  }
  
  export var DEBUG = Level.create('DEBUG', 0)
  export var INFO = Level.create('INFO', 1)
  export var WARN = Level.create('WARN', 2)
  export var ERROR = Level.create('ERROR', 3)
  export var FATAL = Level.create('FATAL', 4)
  
  export class Message implements IMessage {
  
    constructor(
      public level: Level, 
      public group: string = "",
      public message: string = "",
      public timestamp?: number
    ) { 
      this.timestamp = this.timestamp || __now()
    }
    
    equals(o: any) {
      return (
        o && 
        (o instanceof Message) && 
        this.level.equals(o.level) &&
        this.group === o.group &&
        this.message === o.message
      )
    }
    
    toString() {
      return __format('Message', 
        'level: ' + this.level.name + ', ' +
        'group: ' + this.group + ', ' +
        'message: ' + this.message
      )
    }
    
  }
  
  export function logger(group: string) {
    return engine.get().root.child(group)
  }
  
  export class Logger {
    static SEPARATOR = '.'
    
    static path(...args: string[]): string {
      var s = ''
      var sep = Logger.SEPARATOR
      var arg: string
      for (var i = 0, l = args.length; i < l; ++i) {
        arg = args[i]
        if (arg) {
          if (s.length) s+= sep
          s += arg
        }
      }
      return s
    }
    
    children: {[key: string]: Logger} = {}   
    
    constructor(
      public name: string, 
      private _engine: engine.Engine
    ) { }
    
    child(subpath: string): Logger {
      return this._child(subpath.split(Logger.SEPARATOR), this._engine)
    }
    
    log(level: Level, group: string, message: string) {
      var reporters = this._reporters()
      for (var i = 0, l = reporters.length; i < l; ++i) {
        var target = reporters[i]
        var config = target.config
        var reporter = target.reporter
        var logMessage = new Message(level, group, message)

        if (
          (config.level.indexOf('*') !== -1 || config.level.indexOf(level) !== -1) &&
          (config.group.indexOf('*') !== -1 || config.group.indexOf(group) !== -1)
        ) {
          reporter.receive(logMessage)
        }
      }  
    }
    
    debug(message: string) {
      return this.log(DEBUG, this.name, message)
    }
    
    info(message: string) {
      return this.log(INFO, this.name, message)
    }
    
    warn(message: string) {
      return this.log(WARN, this.name, message)
    }

    error(message: string) {
      return this.log(ERROR, this.name, message)
    }
    
    fatal(message: string) {
      return this.log(FATAL, this.name, message)
    }
    
    toString() {
      return __format('Logger', this.name)
    }
    
    private _child(path: string[], ng: engine.Engine): Logger {
      var returnValue = this
      if (path.length > 0) {
        var head = path[0]
        if (head.length !== 0) {
          var children = this.children
          returnValue = children[head]  
          if (!returnValue) {
            returnValue = children[head] = new Logger(Logger.path(this.name, head), ng)
          }
          returnValue = returnValue._child(path.slice(1), ng)
        }
      }  
      return returnValue
    }
    
    private _reporters(): { config: any; reporter: IReporter; }[] {
      return []
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
    
    export class Engine {
      root = new Logger("", this)      
      
      
    }
    
  }
  
  export module reporter {
  
    export class Simple implements IReporter {
    
      logs: string[] = []
    
      receive(logMessage: IMessage) {
        var formatted = '[' + logMessage.level + '|' + logMessage.group + '] ' + logMessage.message
        this.logs.push(formatted)
      }
    
    }
    
    export class Console implements IReporter {
    
      private _console: any
      
      constructor(options?: {
        console?: { 
          info: (s: string) => void; 
          warn: (s: string) => void;
          error: (s: string) => void;
        }
      }) {
        this._console = options.console || window.console
      }
      
      receive(logMessage: IMessage) {
        var console = this._console
        var formatted = '[' + logMessage.level.name + '|' + logMessage.group + '] ' + logMessage.message
        switch(logMessage.level) {
          case INFO:
            console.info(formatted)
            break
          case WARN:
            console.warn(formatted)
            break
          case ERROR:
          case FATAL:
            console.error(formatted)
          default:
            throw new Error()
        }
      }
      
    }
  
  }
  
}
export = log