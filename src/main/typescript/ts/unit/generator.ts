import iterator = require("ts/iterator");
import IIterator = iterator.IIterator;
import IIteratorResult = iterator.IIteratorResult;

module generator {
  
  //Constant
  var LN2 = Math.log(2);
  
  var __max = Math.max;
  var __log = Math.log;
  var __floor = Math.floor;
  var __round = Math.round;
  var __log2 = function (n: number): number {
    return __log(n) / LN2;
  };
  var __paramRand = function (params: Params, min: number, max: number): number {
    return __floor(params.random() * (max - min + 1) + min);
  };
  var __paramLogSize = function (params: Params) {
    var r = __round(__log2(params.size + 1));
    return r >= 0 ? r : 0;
  };
  
  //helper
  type Params = {
    size: number
    random: () => number
  }
  
  interface IGenerator<Result> {
    (params: Params): Result 
  }
  
  function constant<T>(k: T): IGenerator<T> {
    return function () {
      return k;
    };
  }
  
  function oneOf<T>(generators: IGenerator<T>[]): IGenerator<T> {
    var l = generators.length;
    return function (params: Params) {
      var index = __paramRand(params, 0, l);
      return generators[index](params);
    };
  }
  
  function array<T>(generator: IGenerator<T>): IGenerator<T[]> {
    return function (params: Params) {
      var length = __paramRand(params, 0, __paramLogSize(params));
      var returnValue: T[] = new Array(length);
      for (var i = 0; i < length; i++) {
        returnValue[i] = generator(params);
      }
      return returnValue;
    };
  }
  
  function recursive<T>(g: IGenerator<T>, loop: (g: IGenerator<T>) => IGenerator<T>): IGenerator<T> {
    function rec(n: number, params: Params) {
      return (
        //Trivial case
        n <= 0 || __paramRand(params, 0, 3) === 0 ? g(params) :
        
        //Recursion
        loop(function (paramsq: Params) {
          return rec(n - 1, paramsq);
        })(params)
      );
    }
    
    return function (params: Params) {
      return rec(__paramLogSize(params), params);
    };
  }
  
  function tuple<A, B, C, D, E>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>] ): IGenerator<[A, B, C, D, E]>
  function tuple<A, B, C, D>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>] ): IGenerator<[A, B, C, D]>
  function tuple<A, B, C>(generators: [IGenerator<A>, IGenerator<B>, IGenerator<C>] ): IGenerator<[A, B, C]>
  function tuple<A, B>(generators: [IGenerator<A>, IGenerator<B>] ): IGenerator<[A, B]>
  function tuple(generators: any): IGenerator<any> {
    var length = generators.length;
    
    return function (params: Params) {
      var returnValue: any[] = new Array(length);
      for (var i = 0; i < length; i++) {
        returnValue[i] = generators[i](params);
      }
      return returnValue;
    };
  }

}
export = generator;