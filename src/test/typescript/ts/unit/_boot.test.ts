module boot {
  //minimalist assert library
  
  type AssertFn = (b: boolean, message?: string) => void
  
  export function test(name: string, f: (assert: AssertFn) => void) {
    function assert(condition: boolean, message?: string) {
      if (message === undefined) {
        message = name + ": Assertion Failed"
      }
      
      if (!condition) {
        if (typeof console !== "undefined") {
          console.error(message);
        } else {
          throw new Error(message);
        }
      }
    }
    
    function run() {
      f(assert)
    }
    return run;
  }
  
}
export = boot