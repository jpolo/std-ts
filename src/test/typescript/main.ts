import { Runner } from "../../main/typescript/ts/unit/runner"
import { HTMLPrinter } from "../../main/typescript/ts/unit/printer/html"
import { JUnitPrinter } from "../../main/typescript/ts/unit/printer/junit"
import allSuite from "../../test/typescript/ts/_all.test"

let htmlPrinter = new HTMLPrinter();
let junitPrinter = new JUnitPrinter();
let testRunner = new Runner();
testRunner.run(allSuite, (report) => {
  htmlPrinter.print(report);
});
