import vm = require("ts/vm")
import IContext = vm.IContext

module macro {
  var ARGS = ['$0', '$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9']

  export function compile(f: () => string, ctx?: IContext): () => any
  export function compile(f: ($0: string) => string, ctx?: IContext): (_0: any) => any
  export function compile(f: ($0: string, $1: string) => string, ctx?: IContext): (_0: any, _1: any) => any
  export function compile(f: ($0: string, $1: string, $2: string) => string, ctx?: IContext): (_0: any, _1: any, _2: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string) => string, ctx?: IContext): (_0: any, _1: any, _2: any, _3: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string, $4: string) => string, ctx?: IContext): (_0: any, _1: any, _2: any, _3: any, _4: any) => any
  export function compile(f: ($0: string, $1: string, $2: string, $3: string, $4: string, $5: string, ctx?: IContext) => string): (_0: any, _1: any, _2: any, _3: any, _4: any, _5: any) => any
  export function compile(f: any, ctx?: any): any {
    var argc = +f.length
    var args = ARGS.slice(0, argc)
    var contextExpr = $name("ctx")
    var jscode: string = 
      '\n"use strict";' + 
      //head
      (ctx ? Object.keys(ctx).map(function (key) {
        return $var(key, $attr(contextExpr, '"' + key + '"'))
      }).join("") : "") +
      //body
      $return($function(args, f.apply(null, args))) 
      
console.warn(jscode)
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
  
  export function $fori(each: (i: string, l: string) => string, lenExpr: string): string {
    var l = $name('l')
    var i = $name('i')
    return (
      '\nfor (var ' + $op(i, '=', '0') + ', ' +  $op(l, '=', lenExpr) + '; ' + $op(i, '<', l) + '; ++' + i + ') {' +
        $indent(each(i, l)) +
      '\n}'
    )
  }
  
  export function $if(condExpr: string, thenExpr: string): string {
    return '\nif (' + condExpr + ') {' + $indent(thenExpr) + '}'
  }
  
  export function $elif(condExpr: string, thenExpr: string): string {
    return '\nelse if (' + condExpr + ') {' + $indent(thenExpr) + '}'
  }
  
  export function $else(thenExpr: string): string {
    return '\nelse {' + $indent(thenExpr) + '}'
  }
  
  export function $function(args: string[], block: string, name: string = ''): string {
    return '\nfunction ' + name + '(' + args.join(', ') + ') {' +  $indent(block) + '\n}'
  }
  
  export function $indent(s: string, chars = '  ') {
    return chars + s.replace(/\n/g, '\n' + chars)
  }
  
  var __names__ = {}
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
  
  export function $var(varName: string, valExpr?: string) {
    return $assign(varName, valExpr, true)
  }
  

}
export = macro