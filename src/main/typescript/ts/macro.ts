import vm = require("ts/vm")
import IContext = vm.IContext

module macro {
  export var USE_STRICT = '\n"use strict";'
  var ARGS = ['$0', '$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9']
  var __names__ = {}

  export function compile(f: () => string, ctx?: IContext): () => any
  export function compile(f: ($0: string) => string, ctx?: IContext): (_0: any) => any
  export function compile(f: ($0: string, $1: string) => string, ctx?: IContext): (_0: any, _1: any) => any
  export function compile(f: ($0: string, $1: string, $2: string) => string, ctx?: IContext): (_0: any, _1: any, _2: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string) => string, ctx?: IContext): (_0: any, _1: any, _2: any, _3: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string, $4: string) => string, ctx?: IContext): (_0: any, _1: any, _2: any, _3: any, _4: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string, $4: string, $5: string, ctx?: IContext) => string): (_0: any, _1: any, _2: any, _3: any, _4: any, _5: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string, $4: string, $5: string, $6: string, ctx?: IContext) => string): (_0: any, _1: any, _2: any, _3: any, _4: any, _5: any, _6: any) => any
  export function compile(f: any, ctx?: any): any {
    var argc = +f.length
    var args = ARGS.slice(0, argc)
    var contextExpr = $name("ctx")
    var jscode: string = 
      USE_STRICT + 
      
      //head
      (ctx ? Object.keys(ctx).map(function (key) {
        return $var(key, $attr(contextExpr, '"' + key + '"'))
      }).join("") : "") +
      
      //body
      $return($function(args, f.apply(null, args))) 
      
    return (new Function(contextExpr, jscode))(ctx)
  }

  export function $assign(objectExpr: string, valExpr: string, newVar = false): string {
    return (
      !objectExpr && !valExpr ? '' :
      '\n' + (newVar ? 'var ' : '') + objectExpr + (valExpr ? ' = ' + valExpr : '') + ';'
    )
  }
  
  export function $attr(objectExpr: string, attrExpr: string) {
    return objectExpr + '[' + attrExpr + ']'
  }
  
  export function $case(caseExpr: string, execExpr: string, nobreak = false): string {
    return '\ncase ' + caseExpr + ':' + $indent(execExpr + (nobreak ? '' : '\nbreak;'))
  }
  
  export function $do(body: string, whileExpr: string): string {
    return '\ndo {' + $indent(body) + '\n} while (' + whileExpr + ');'
  }
  
  export function $for(init: string, cond: string, incr: string, body: string): string {
    return (
      '\nfor (' + init + '; ' + cond + '; ' + incr + ') {' +
        $indent(body) +
      '\n}'
    )
  }
  
  export function $foreach(o: string, each: (key: string) => string): string {
    var keys = $name('keys')
    var keyc = $name('keyc')
    var key = $name('key')
    return (
      $var(keys, 'Object.keys(' + o + ')') +
      $var(keyc, keys + '.length') +
      $var(key) +
      $fori("0", keyc, "1", (i) => {
        return (
          $assign(key, $attr(o, i)) +
          each(key)
        )
      })
    )
  }
  
  export function $fori(min: string, max: string, step: string, each: (i: string) => string): string {
    var i = $name('i')
    return $for(
      'var ' + $op(i, '=', min),
      $op(i, '<', max),
      $op(i, '+=', step),
      each(i)
    )
  }
  
  export function $fora(arrayExpr: string, each: (i: string) => string): string {
    var i = $name('i')
    var l = $name('l')
    var iterations = $name('iter')
    var leftover = $name('rest')
    var bufferc = 8

    return (
      $var(l, arrayExpr + '.length') +
      $var(leftover, $op(l, '%', String(bufferc))) +
      $var(iterations, $op('(' + $op(l, '-', leftover) + ')', '/', String(bufferc))) +
      $if($op(leftover, '>', '0'), 
        $switch(leftover, (function () {
          var cases = []
          for (var imax = 1; imax < bufferc; imax++) {
            var caseBody = ''
            for (var casei = 0; casei < imax; casei++) {
              caseBody += each(String(casei))
            }
            cases.push($case(String(imax), caseBody))
          }
          return cases
        }()))
      ) +
      $if($op(iterations, '>', '0'), 
        $var(i, leftover) +
        $do((function () {
          var body = ''
          for (var ui = 0; ui < bufferc; ++ui) {
            body += each(i)
            body += '\n++' + i + ';' 
          }
          return body
        }()), '--' + iterations + ' > 0')     
      )
    )
  }
    
  
  export function $if(condExpr: string, thenExpr: string): string {
    return '\nif (' + condExpr + ') {' + $indent(thenExpr) + '\n}'
  }
  
  export function $elif(condExpr: string, thenExpr: string): string {
    return '\nelse if (' + condExpr + ') {' + $indent(thenExpr) + '\n}'
  }
  
  export function $else(thenExpr: string): string {
    return '\nelse {' + $indent(thenExpr) + '\n}'
  }
  
  export function $function(args: string[], block: string, name: string = ''): string {
    return '\nfunction ' + name + '(' + args.join(', ') + ') {' +  $indent(block) + '\n}'
  }
  
  export function $indent(s: string, chars = '  ') {
    return chars + s.replace(/\n/g, '\n' + chars)
  }
  
  export function $name(prefix = '$$tmp') {
    var cur = __names__[prefix] || (__names__[prefix] = 0)
    ++__names__[prefix]
    return prefix + cur
  }
  
  export function $op(l: string, op: string, r: string = ''): string {
    return l + ' ' + op + ' ' + r
  }
  
  export function $return(returnExpr: string) {
    return '\nreturn (' + returnExpr + ');'
  }
  
  export function $switch(switchExpr: string, casesExpr: string[], defaultExpr?: string) {
    var s = ''
    s += '\nswitch (' + switchExpr + ') {'
    s += casesExpr.join('')
    if (defaultExpr) {
      s += '\ndefault:' + $indent(defaultExpr)
    }
    s += '\n}'
    return s
  }
  
  export function $throw(throwExpr) {
    return '\nthrow ' + throwExpr + ';'
  }
  
  export function $var(varName: string, valExpr?: string) {
    return $assign(varName, valExpr, true)
  }
  
  export function $while(whileExpr: string, bodyExpr: string): string {
    return '\nwhile (' + whileExpr + ') {' + $indent(bodyExpr) + '\n}'
  }
  

}
export = macro