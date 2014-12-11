module promise {
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' }
  var __str = String

  export interface IPromise<T> {
    then<T2>(onResolved: (v: T) => IPromise<T2>, onRejected?: (e: any) => IPromise<T2>): IPromise<T2>;
    then<T2>(onResolved: (v: T) => IPromise<T2>, onRejected?: (e: any) => T2): IPromise<T2>;
    then<T2>(onResolved: (v: T) => T2, onRejected?: (e: any) => IPromise<T2>): IPromise<T2>;
    then<T2>(onResolved: (v: T) => T2, onRejected?: (e: any) => T2): IPromise<T2>;
    
    catch(onRejected: (e: any) => IPromise<T>): IPromise<T>;
    catch(onRejected: (e: any) => T): IPromise<T>;
    
    //finally(onFinished: (v?: T, e?: T) => any): IPromise<T>;
  }
  

  enum PromiseState { Pending, Resolved, Rejected }
  
  export class PromiseError implements Error {
    name: string = 'PromiseError';
    constructor(public message) { Error.call(this, message); }
    toString() { return Error.prototype.toString.call(this); }
  }
  
  export class CancelError extends PromiseError {
    name: string = 'CancelError';
  }
  
  export class CycleError extends PromiseError {
    name: string = 'CycleError';
  }
  
  export class TimeoutError extends PromiseError {
    name: string = 'TimeoutError';
  }
  
  export function all<T>(promises: IPromise<T>[]) {
    return Promise.all(promises);
  }
  
  export function apply<T>(f, thisp?: any, args?: any[]): Promise<T> {
    var p;
    try {
      p = $apply(f, thisp, args);
      p = Promise.cast(p);
    } catch (e) {
      p = reject(e);
    }
    return p;
  }

  export function call<T>(f, thisp?: any, ...args: any[]): Promise<T> {
    return apply<T>(f, thisp, args);
  }
  
  export function delay(milliseconds: number): Promise<any> {
    var timerId = null;
    
    return milliseconds === 0 ? resolve(null) : new Promise(function (resolve) {
      timerId = setTimeout(function () {
        timerId = null;
        resolve(null);
      }, milliseconds);
    }/*, function cancel() {
      if (timerId) {
        clearTimeout(timerId);
      }
    }*/
    );
  }
  

  function isPromise(o) {
    return o instanceof Promise;
  }
  
  function isIPromise(o) {
    return (o && 'then' in o);
  }

  export function race<T>(promises: IPromise<T>[]) {
    return Promise.race(promises);
  }
  
  export function resolve<T>(p: IPromise<T>): Promise<T>;
  export function resolve<T>(t: T): Promise<T>
  export function resolve<T>(o: any): Promise<T> {
    return Promise.resolve(o);
  }
  
  export function reject(e: any): Promise<any> {
    return Promise.reject(e);
  }
  
  export class Promise<T> implements IPromise<T> {
  
    static all<T>(promises: IPromise<T>[]): Promise<T[]> {
      return new Promise<T[]>(function(resolve, reject) {
        var results = [];
        var remaining = promises.length;
        var promise: IPromise<T>;
    
        if (remaining === 0) {
          resolve([]);
        }
    
        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }
    
        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }
    
        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];
    
          if (isIPromise(promise)) {
            promise.then(resolver(i), reject);
          } else {
            resolveAll(i, promise);
          }
        }
      });
    }
    
    static cast<T>(p: IPromise<T>): Promise<T>;
    static cast<T>(o: T): Promise<T>
    static cast<T>(o: any): Promise<T> {
      var returnValue;
      if (isPromise(o)) {
        returnValue = o;
      } else if (isIPromise(o)) {
        o.then(() => {}, () => {})//TODO
      } else {
        returnValue = new Promise();
        returnValue._setState(PromiseState.Resolved, o, null);
      }
      return returnValue;
    }
    
    static race<T>(promises: IPromise<T>[]): Promise<T> {
      return new Promise<T>(function(resolve, reject) {
        var results = [];
        var promise;
    
        for (var i = 0, l = promises.length; i < l; i++) {
          promise = promises[i];
    
          if (isIPromise(promise)) {
            promise.then(resolve, reject);
          } else {
            resolve(promise);
          }
        }
      });
    }
    
    static resolve<T>(p: IPromise<T>): Promise<T>
    static resolve<T>(t: T): Promise<T>
    static resolve<T>(o: any): Promise<T> {
      var returnValue: Promise<any> = new Promise();
      
      if (isPromise(o) || isIPromise(o)) {
        o.then(returnValue._getResolver(), returnValue._getRejecter());
      } else {
        returnValue._setState(PromiseState.Resolved, o, null);
      }
      return returnValue;
    }
    
    static reject<T>(e: any): Promise<T> {
      var returnValue: Promise<any> = new Promise();
      returnValue._setState(PromiseState.Rejected, null, e);
      return returnValue;
    }
    
    private _state: PromiseState = PromiseState.Pending;
    private _value: T;
    private _error: any;
    private _isCaught = false;
    private _isNotifying = false;
    private _handlers: any[];
    private _parent: Promise<any>;
    private _timerId: number;
    private _timeOut: number;
    
    private _resolver: (v: any) => void
    private _rejecter: (v: any) => void
    
    constructor(callback?: (resolve?: (f: T) => any, reject?: (e: any) => any) => void) {
      if (callback != null) {
        try {
          callback(
            this._getResolver(),
            this._getRejecter()
          );
        } catch (e) {
          this._setState(PromiseState.Rejected, null, e);
        }
      }
    }
    
    then<T2>(onResolved: (v: T) => IPromise<T2>, onRejected?: (e: any) => IPromise<T2>): IPromise<T2>;
    then<T2>(onResolved: (v: T) => IPromise<T2>, onRejected?: (e: any) => T2): IPromise<T2>;
    then<T2>(onResolved: (v: T) => T2, onRejected?: (e: any) => IPromise<T2>): IPromise<T2>;
    then<T2>(onResolved: (v: T) => T2, onRejected?: (e: any) => T2): IPromise<T2> {
      return this._addListener(onResolved, onRejected, false);
    }
    
    catch(onRejected: (e: any) => IPromise<T>): IPromise<T>;
    catch(onRejected: (e: any) => T): IPromise<T>;
    catch(onRejected: (e: any) => any): IPromise<T> {
      return this._addListener(null, onRejected, false);
    }
    
    finally(onFinished: (v?: T, e?: T) => any): IPromise<T> {
      return onFinished == null ? this : this._addListener(onFinished, onFinished, true);
    }
    
    timeout(milliseconds: number) {
      this._clearTimeout();
      if (
        this._state === PromiseState.Pending &&
        (milliseconds || milliseconds === 0)
      ) {

        this._setTimeout(() => {
          this._setState(
            PromiseState.Rejected,
            null,
            new TimeoutError(this + " has timed out")
          );
        }, milliseconds);
      }
      return this;
    }

    toString() {
      var s = ""
      switch (this._state) {
        case PromiseState.Pending:
          s += "?"
          break
        case PromiseState.Resolved:
          s += this._value
          break
        case PromiseState.Rejected:
          s += "!" + this._error
          break
      }
      return __format('Promise', s);
    }
    
    private _getResolver() {
      if (!this._resolver) {
        this._resolver = (result: T) => {
          this._setState(PromiseState.Resolved, result, null);
        };
      }
      return this._resolver;
    }
    
    private _getRejecter() {
      if (!this._rejecter) {
        this._rejecter = (e: any) => {
          this._setState(PromiseState.Rejected, null, e);
        };
      }
      return this._rejecter;
    }
    
    private _setState(state: PromiseState, value: T, error: any) {
      if (this._state === PromiseState.Pending) {
        this._state = state;
        this._value = value;
        //drop other handlers
        switch (state) {
          case PromiseState.Resolved:
            this._isCaught = true;
            break;
          case PromiseState.Rejected:
            break;
          default:
            throw new ReferenceError();
        }
        this._clearTimeout();
        this._notifyAll();
      }
    }
    
    private _createChild(): Promise<any> {
      var child = new Promise();
      child._parent = this;
      return child;
    }
    
    private _addListener(onResolved: any, onRejected: any, isFinally: boolean): IPromise<any> {
      var state = this._state; 
      var child = this;
      var isPending = state === PromiseState.Pending;
      var handlers;
  
      if (isPending || 
        (onResolved && state === PromiseState.Resolved) ||
        (onRejected && state === PromiseState.Rejected)
      ) {
        child = this._createChild();
  
        handlers = this._handlers || (this._handlers = []);
        handlers.push(child, onResolved, onRejected, isFinally);
        this._isCaught = true;
        //try to notify
        if (!isPending) {
          this._notifyAll();
        }
      }
  
      return child;
    }

    private _setTimeout(f, milliseconds: number) {
      this._clearTimeout();
      if (milliseconds !== Infinity) {
        this._timeOut = milliseconds;
        this._timerId = setTimeout(() => {
          this._timerId = null;
          this._timeOut = 0;
          f();
        }, milliseconds);
      }
    }
    
    private _clearTimeout() {
      if (this._timerId) {
        clearTimeout(this._timerId);
        this._timerId = null;
        this._timeOut = Infinity;
      }
    }
    
    private _handleCycleError(childp: IPromise<any>, originp?: IPromise<any>) {
      originp = originp || this;
      if (this === childp) {
        throw new CycleError(originp + ' has infinite recursion');
      } else if (this._parent) {
        this._parent._handleCycleError(childp, originp);
      }
    }

    private _notifyAll() {
      if (!this._isNotifying) {
        this._isNotifying = true;
        
        //lazy init task
        $asap(() => {
          var handlers = this._handlers; 
          var handlerc = handlers && handlers.length || 0;
          var state = this._state;
          var value = this._value;
          var error = this._error;
          var isReject = state === PromiseState.Rejected; 
          var child: Promise<any>;
          var i, callback, isFinally, pipeFn, result;
      
          this._isNotifying = false;
      
          if (handlerc > 0) {
            for (i = 0; i < handlerc; i += 4) {
              //fast shift
              child = $pick(handlers, i);
              callback = isReject ? $pick(handlers, i + 2) : $pick(handlers, i + 1);
              isFinally = $pick(handlers, i + 3);
              
              try {
                if (isFinally) {
                  result = callback(isReject ? error : value);
                  if (isIPromise(result)) {
                    this._handleCycleError(result);
                    pipeFn = () => { child._setState(state, value, error); };
                    result.then(pipeFn, pipeFn);
                  } else {
                    child._setState(state, value, error);
                  }
      
                } else {
                  if (callback) {
                    result = callback(isReject ? error : value);
                    if (isIPromise(result)) {
                      this._handleCycleError(result);
                      result.then(child._getResolver(), child._getRejecter());
                    } else {
                      child._setState(PromiseState.Resolved, result, null);
                    }
                  } else {
                    child._setState(state, value, error);
                  }
                }
              } catch (e) {
                child._setState(PromiseState.Rejected, null, e);
              }
            }
      
            //clear handlers
            handlers.length = 0;
          }
        });
      }
    }
  }
  
  
  function $pick<T>(a: T[], i: number): T {
    var v;
    if (i < a.length) {
      v = a[i];
      a[i] = undefined;
    }
    return v;
  }
  
  function $apply(f, thisp: any, args: any[]) {
    var returnValue;
    switch (args ? args.length : 0) {
      case 0: returnValue = thisp ? f.call(thisp) : f(); break;
      case 1: returnValue = thisp ? f.call(thisp, args[0]) : f(args[0]); break;
      case 2: returnValue = thisp ? f.call(thisp, args[0], args[1]) : f(args[0], args[1]); break;
      case 3: returnValue = thisp ? f.call(thisp, args[0], args[1], args[2]) : f(args[0], args[1], args[2]); break;
      case 4: returnValue = thisp ? f.call(thisp, args[0], args[1], args[2], args[3]) : f(args[0], args[1], args[2], args[3]); break;
      case 5: returnValue = thisp ? f.call(thisp, args[0], args[1], args[2], args[3], args[4]) : f(args[0], args[1], args[2], args[3], args[4]); break;
      default: returnValue = f.apply(thisp, args);
    }
    return returnValue;
  }
  
  function $asap(f: () => void) {
    if (window.setImmediate) {
      window.setImmediate(f)
    } else {
      window.setTimeout(f, 0)
    }
  }
  
}
export = promise