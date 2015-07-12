import { Runner } from "../../main/typescript/ts/unit/runner"
import { HTMLPrinter } from "../../main/typescript/ts/unit/printer/html"
import allSuite from "../../test/typescript/ts/_all.test"

let testPrinter = new HTMLPrinter();
let testRunner = new Runner();
testRunner.run(allSuite, (report) => { testPrinter.print(report); });
