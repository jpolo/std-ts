import iterator = require("ts/iterator");
import IIterator = iterator.IIterator;
import IIteratorResult = iterator.IIteratorResult;

module gen {
  
  //Constant
  var LN2 = Math.log(2);
  
  var __max = Math.max;
  var __log = Math.log;
  var __floor = Math.floor;
  var __round = Math.round;
  var __log2 = function (n: number): number {
    return __log(n) / LN2;
  };
  var __rand = function (min: number, max: number, randFn: () => number): number {
    return __floor(randFn() * (max - min + 1) + min);
  };
  var __logSize = function (size: number): number {
    var r = __round(__log2(size + 1));
    return r >= 0 ? r : 0;
  }
  
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
      var index = __rand(0, l, params.random);
      return generators[index](params);
    };
  }
  
  function array<T>(generator: IGenerator<T>): IGenerator<T[]> {
    return function (params: Params) {
      var length = __rand(0, __logSize(params.size), params.random);
      var returnValue: T[] = new Array(length);
      for (var i = 0; i < length; i++) {
        returnValue[i] = generator(params);
      }
      return returnValue;
    };
  }
  
  function recursive<T>(g: IGenerator<T>): IGenerator<T> {
    /*
    function rec(n, params: Params) {
      if (n <= 0 || random(0, 3) === 0) {
        return genZ(sizep);
      } else {
        return genS(generatorBless(function (sizeq) {
          return rec(n - 1, sizeq);
        }))(sizep);
      }
    }

    return rec(logsize(size), params);*/
    
    return function (params: Params) {
      var size = __logSize(params.size);
      
    };
  }
  
  
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