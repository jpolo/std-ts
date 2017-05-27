class Suite {
  protected _suites: { [k: string]: Suite } = {}
  protected _tests: { [k: string]: Test } = {}

  constructor (protected _name: string, protected _parent: Suite = null) {}

  getName (): string {
    return this._name
  }

  getFullName (): string {
    return this._parent ? this._parent.getFullName() + this._name : this._name
  }

  getSuite (name: string): Suite {
    return this._suites[name] || (this._suites[name] = new Suite(name, this))
  }

  getTest (name: string): Test {
    return this._tests[name] || (this._tests[name] = new Test(name, this))
  }
}

class Test {
  constructor (protected _name: string, protected _suite: Suite) {}

  getName () {
    return this._name
  }

  getFullName () {
    return this._suite ? this._suite.getFullName() + this._name : this._name
  }
}

const rootSuite: Suite = new Suite('')

let currentDisabled = false
let currentSuite: Suite = rootSuite
let currentTest: Test = null

export function describe (description: string, f?: () => void): void {
  const previousSuite = currentSuite
  currentSuite = currentSuite.getSuite(description)
  if (f) {
    f()
    currentSuite = previousSuite
  }
}

export function xdescribe (description: string, f?: () => void): void {
  const previousDisabled = currentDisabled
  const previousSuite = currentSuite
  currentSuite = currentSuite.getSuite(description)
  if (f) {
    currentDisabled = true
    f()
    currentSuite = previousSuite
    currentDisabled = previousDisabled
  }
}

export function it (description: string, f?: () => void): void {
  if (currentSuite === null) {
    throw SyntaxError('it() must be called inside describe() block')
  }
  const previousTest = currentTest
  currentTest = currentSuite.getTest(description)
  if (f) {
    f()
    currentTest = previousTest
  }
}

export function xit (description: string, f?: () => void): void {
  return undefined
}

export function before (f: () => void): void {
  return undefined
}

export function after (f: () => void): void {
  return undefined
}

export function beforeEach (f: () => void): void {
  return undefined
}

export function afterEach (f: () => void): void {
  return undefined
}
