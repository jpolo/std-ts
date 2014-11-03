module log {
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' }
  var __now = Date.now || function () { return (new Date()).getTime(); }
  var __str = String
  
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

    static fromString(s: string): Level {
      return Level._instances[s]
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
    
    equals(o: any) {
      return this === o || (o && (o instanceof this.constructor) && o.value === this.value)
    }
    
    valueOf() {
      return this.value
    }
    
    inspect() {
      return __format('Level', 'name: "' + this.name + '", value: ' + this.value)
    }
    
    toJSON() {
      return this.name
    }
    
    toString() {
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
      public level: Level, 
      public group: string = "",
      public message: string = "",
      public timestamp: number = __now()
    ) {
    }
    
    equals(o: any) {
      return this === o || (
        o && 
        (o instanceof Message) && 
        +this.level === +o.level &&
        this.group === o.group &&
        this.message === o.message
      )
    }
    
    inspect() {
      return __format('Message', 
        'level: ' + __str(this.level) + ', ' +
        'group: "' + this.group + '", ' +
        'message: "' + this.message + '"'
      )
    }
    
    toString() {
      return '[' + __str(this.level) + '|' + this.group + '] ' + this.message
    }
    
  }
  
  export function logger(group: string) {
    return engine.get().logger(group)
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
    
    constructor(
      public name: string, 
      private _engine: engine.Engine
    ) { }
    
    child(subpath: string): Logger {
      return this._engine.logger(Logger.path(this.name, subpath))
    }
    
    log(level: Level, message: string, group?: string) {
      group = group || this.name
      this._engine.send(level, group, message)
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
      reporters: { config: any; reporter: IReporter; }[] = []
      
      private _loggers: { [name: string]: Logger } = {}
      
      logger(name: string): Logger {
        var loggers = this._loggers
        return loggers[name] || (loggers[name] = new Logger(name, this))
      }

      send(level: Level, group: string, message: string) {
        var reporters = this.reporters
        var logMessage = new Message(level, group, message)
        for (var i = 0, l = reporters.length; i < l; ++i) {
          var target = reporters[i]
          var config = target.config
          var reporter = target.reporter
          if (
            (config.level.indexOf('*') !== -1 || config.level.indexOf(level) !== -1) &&
            (config.group.indexOf('*') !== -1 || config.group.indexOf(group) !== -1)
          ) {
            reporter.receive(logMessage)
          }
        }  

      }
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
        var formatted = '[' + logMessage.level.name + '|' + logMessage.group + '] ' + logMessage.message
        var level = +logMessage.level
          
        if (level >= +ERROR) {
          console.error(formatted)
        } else if (level >= +WARN) {
          console.warn(formatted)
        } else if (level >= +INFO) {
          console.info(formatted)
        } else { //Debug
          console.debug(formatted)
        }
      }
      
    }
  
  }
  
}
export = log