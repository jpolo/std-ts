import { Runner } from "../../main/typescript/ts/unit/runner"
import { HTMLReporter } from "../../main/typescript/ts/unit/reporter/html"
import { JUnitReporter } from "../../main/typescript/ts/unit/reporter/junit"
import allSuite from "../../test/typescript/ts/_all.test"

let htmlPrinter = new HTMLReporter();
let junitPrinter = new JUnitReporter();
let testRunner = new Runner();
testRunner.run(allSuite, (report) => {
  htmlPrinter.print(report);
});
