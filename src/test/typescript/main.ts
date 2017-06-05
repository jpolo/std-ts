import { Runner } from '../../main/typescript/ts/testing/runner';
import { HTMLReporter } from '../../main/typescript/ts/testing/reporter/html';
import { JUnitReporter } from '../../main/typescript/ts/testing/reporter/junit';
import allSuite from '../../test/typescript/ts/_all.test';

const htmlPrinter = new HTMLReporter();
const junitPrinter = new JUnitReporter();
const testRunner = new Runner();
testRunner.run(allSuite, (report) => {
  htmlPrinter.print(report);
});
