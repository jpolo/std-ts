
//minimalist assert library

type AssertFn = (b: boolean, message?: string) => void

export function test(name: string, f: (assert: AssertFn) => void) {
  function assert(condition: boolean, message?: string) {
    var fullmessage = "[" + name + "] " + (message || " assertion failed");
    
    if (!condition) {
      if (typeof console !== "undefined") {
        console.error(fullmessage);
      } else {
        throw new Error(fullmessage);
      }
    }
  }
  
  function run() {
    f(assert)
  }
  return run;
}