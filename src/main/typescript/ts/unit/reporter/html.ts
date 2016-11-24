import {
  SUCCESS, FAILURE, ERROR, WARNING,
  IAssertion, IReporter, ITestReport
} from "../../unit";
import {
  OwnKeysSorted,
  ToString
} from "../util";

export class HTMLReporter implements IReporter {

  print(reports: ITestReport[]) {
    let startTime: number = null;
    let endTime: number = null;
    let statFailed = 0;
    let statSuccess = 0;
    let statError = 0;
    let sections: {[key: string]: IAssertion[]} = {};
    let uncaughtErrors: IAssertion[] = [];

    function push(sectionName: string, a: IAssertion) {
      let array = sections[sectionName];
      if (array === undefined || array === null) {
        array = [];
        sections[sectionName] = array;
      }
      array.push(a);
    }

    reports.forEach((report) => {
      startTime = startTime === null ? +report.startDate : Math.min(startTime, +report.startDate);

      endTime = endTime === null ?
        (+report.startDate + report.elapsedMilliseconds) :
        Math.max(endTime, +report.startDate + report.elapsedMilliseconds);

      report.assertions.forEach((assertion) =>  {
        let category = assertion.test.category + "" + assertion.test.name;

        switch (assertion.name) {
          case SUCCESS:
            push(category, assertion);
            ++statSuccess;
            break;
          case FAILURE:
            push(category, assertion);
            ++statFailed;
            break;
          case ERROR:
            if (category) {
              push(category, assertion);
            } else {
              uncaughtErrors.push(assertion);
            }
            ++statError;
            break;
          case WARNING:
            push(category, assertion);
            break;
          default:
            throw TypeError(JSON.stringify(assertion));
        }
      });
    });

    OwnKeysSorted(sections).forEach((sectionName) => {
      let matrix = "";
      let messages = "";
      const section = sections[sectionName];

      section.forEach((assertion) => {
        const { message, name, position } = assertion;
        const positionMessage = position ? " (" + position.getFileName() + ":" + position.getLineNumber() + ")" : "";
        const typeName = ToString(name);

        switch (assertion.name) {
          case SUCCESS:
            matrix += ".";
            break;
          case FAILURE:
            matrix += "F";
            messages += "\n  [" + typeName + "]  " + message + positionMessage;
            break;
          case WARNING:
            matrix += "W";
            messages += "\n  [" + typeName + "]  " + message + positionMessage;
            break;
          case ERROR:
            matrix += "E";
            messages += "\n  [" + typeName + "] " + (assertion.stack || message);
            break;
          default:
            throw TypeError(JSON.stringify(assertion));
        }
      });

      this._print(sectionName + " : ");
      this._print(matrix);
      this._print(messages);
      this._print("\n");
    });

    if (uncaughtErrors.length > 0) {
      this._println("Uncaught errors : ");
      let uncaughtError: IAssertion;
      for (let i = 0, l = uncaughtErrors.length; i < l; ++i) {
        uncaughtError = uncaughtErrors[i];
        this._println("  [Error]  " + (uncaughtError.stack || uncaughtError.message));
      }
    }

    this._println();
    this._println("Duration : " + (endTime - startTime) + " ms");
    this._println("Total : " + (statSuccess + statFailed));
    this._println("Success : " + statSuccess + " / Failed : " + statFailed + " / Errors : " + statError);
    this._println("" + (statError !== 0 || statFailed !== 0 ? "FAILED!" : "SUCCESS!"));
  }

  private _print(s: string) {
    const id = "ts:trace";
    let element = document.getElementById(id);
    if (!element) {
      element = document.createElement("div");
      element.id = id;
      document.body.appendChild(element);
    }
    const html = s
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;");
    element.innerHTML += html;
  }

  private _println(v?: string) {
    this._print("\n");
    this._print(v || "");
  }

}
