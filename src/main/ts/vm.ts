 module vm {

  

  export function $return(retExpr: string): string {
    return 'return (' + retExpr + ')'
  }

}

export = vm
