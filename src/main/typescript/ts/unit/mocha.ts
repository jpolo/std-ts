import { SUCCESS, FAILURE, IAssertionCallSite, Assertion } from "./assertion"
import { ITestEngine, ITest, ITestReport, TestSuite, suiteDefault } from "../unit"


export function describe(description: string, f: () => void) {


}

export function it(description: string, f?: (done?: () => void) => void) {

}

export function before(f: () => void) {

}

export function after(f: () => void) {

}

export function beforeEach(f: () => void) {

}

export function afterEach(f: () => void) {

}
