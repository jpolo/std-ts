// minimalist assert library

type AssertFn = (b: boolean, message?: string) => void;

const hasConsole = typeof console !== "undefined";

export function test(name: string, f: (assert: AssertFn) => void) {
  const prefix = "[" + name + "] ";
  let assertionCount = 0;
  let errorCount = 0;

  function assert(condition: boolean, message?: string) {
    assertionCount += 1;
    if (!condition) {
      errorCount += 1;
      if (hasConsole) {
        console.error(prefix + (message || " assertion failed"));
      } else {
        // TODO throw error
      }
    }
  }

  function run() {
    f(assert);
    if (assertionCount === 0) {
      if (hasConsole) {
        console.warn(prefix + "no assertion");
      }
    } else if (errorCount === 0) {
      if (hasConsole) {
        console.debug(prefix + "OK!");
      }
    } else {

    }
  }
  return run;
}
