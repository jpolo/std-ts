import iterator = require("ts/iterator");
import IIterator = iterator.IIterator;
import IIteratorResult = iterator.IIteratorResult;

module generator {
  
  //Constant
  var SIZE = 10;
  var LN2 = Math.log(2);
  
  var __max = Math.max;
  var __log = Math.log;
  var __floor = Math.floor;
  var __round = Math.round;
  var __log2 = function (n: number): number {
    return __log(n) / LN2;
  };
  var __paramRand = function (params: Params, min: number, max: number): number {
    return __floor(params.random() * (max - min)) + min;
  };
  var __paramLogSize = function (params: Params) {
    var r = __round(__log2(params.size + 1));
    return r >= 0 ? r : 0;
  };
  var __paramsDefault = function (p: Params) {
    var returnValue = { size: SIZE, random: Math.random };
    var random = p.random;
    var size = p.size;
    if (size !== undefined) {
      returnValue.size = size;
    }
    if (random !== undefined) {
      returnValue.random = random;
    }
    return returnValue;
  };
  
  //helper
  type Params = {
    size?: number
    random?: () => number
  }
  
  interface IGenerator<Result> {
    (params: Params): Result 
  }
  
  export function constant<T>(k: T): IGenerator<T> {
    return function () {
      return k;
    };
  }
  
  export function oneOf<T>(generators: IGenerator<T>[]): IGenerator<T> {
    var l = generators.length;
    return function (p: Params) {
      var params = __paramsDefault(p);
      var index = __paramRand(params, 0, l);
      return generators[index](params);
    };
  }
  
  export function array<T>(generator: IGenerator<T>): IGenerator<T[]> {
    return function (p: Params) {
      var params = __paramsDefault(p);
      var size =  __paramRand(params, 0, __paramLogSize(params));
      var length = __paramRand(params, 0, size);
      var returnValue: T[] = new Array(length);
      for (var i = 0; i < length; i++) {
        returnValue[i] = generator(params);
      }
      return returnValue;
    };
  }
  
  export function bind<A, B, C, R>(f: (a: A, b: B, c: C) => R, args: [IGenerator<A>, IGenerator<B>, IGenerator<C>]): IGenerator<R>
  export function bind<A, B, R>(f: (a: A, b: B) => R, args: [IGenerator<A>, IGenerator<B>]): IGenerator<R>
  export function bind<A, R>(f: (a: A) => R, args: [IGenerator<A>]): IGenerator<R>
  export function bind<R>(f: () => R, args?: any): IGenerator<R>
  export function bind(f: Function, args: any): any {
    var gentuple = tuple(args);
    return function (p: Params) {
      var params = __paramsDefault(p);
      var t = gentuple(params);
      return f.apply(this, t);
    };
  }
  
  function recursive<T>(g: IGenerator<T>, loop: (g: IGenerator<T>) => IGenerator<T>): IGenerator<T> {
    function rec(n: number, p: Params) {
      return (
        //Trivial case
        n <= 0 || __paramRand(p, 0, 3) === 0 ? g(p) :
        
        //Recursion
        loop(function (paramsq: Params) {
          return rec(n - 1, paramsq);
        })(p)
      );
    }
    
    return function (p: Params) {
      var params = __paramsDefault(p);
      var size = __paramLogSize(params);
      return rec(size, params);
    };
  }
  
  function tuple<A, B, C, D, E, F, G>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>] ): IGenerator<[A, B, C, D, E, F, G]>
  function tuple<A, B, C, D, E, F>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>] ): IGenerator<[A, B, C, D, E, F]>
  function tuple<A, B, C, D, E>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>] ): IGenerator<[A, B, C, D, E]>
  function tuple<A, B, C, D>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>] ): IGenerator<[A, B, C, D]>
  function tuple<A, B, C>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>] ): IGenerator<[A, B, C]>
  function tuple<A, B>(generators: [IGenerator<A>, IGenerator<B>] ): IGenerator<[A, B]>
  function tuple(generators: any[]): IGenerator<any> {
    var length = generators.length;
    
    return function (p: Params) {
      var params = __paramsDefault(p);
      var returnValue: any[] = new Array(length);
      for (var i = 0; i < length; i++) {
        returnValue[i] = generators[i](params);
      }
      return returnValue;
    };
  }
  
  function object<V>(k: IGenerator<number>, v: IGenerator<V>): IGenerator<{[key: number]: V}>;
  function object<V>(k: IGenerator<string>, v: IGenerator<V>): IGenerator<{[key: string]: V}>;
  function object<V>(k: IGenerator<any>, v: IGenerator<V>): IGenerator<any> {
    return function (p: Params) {
      var params = __paramsDefault(p);
      var size = __paramLogSize(params);
      var returnValue = {};
      for (var i = 0; i < size; i++) {
        var key = k(params);
        var value = v(params);
        returnValue[key] = value;
      }
      return returnValue;
    };
  }

}
export = generator;