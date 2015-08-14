import {
  SUCCESS, FAILURE, ERROR, WARNING,
  IAssertion, IPrinter, ITestReport
} from "../../unit"
import * as reflect from "../../reflect"

//ECMA like
const OwnKeys = reflect.ownKeys;
const OwnKeysSorted = function (o) { return OwnKeys(o).sort(); };
const ToString = function (o) { return "" + o; };

export class HTMLPrinter implements IPrinter {

  print(reports: ITestReport[]) {
    let startTime: number = null
    let endTime: number = null
    let statFailed = 0
    let statSuccess = 0
    let statError = 0
    let sections: {[key: string]: IAssertion[]} = {}
    let uncaughtErrors: IAssertion[] = []

    function push(sectionName: string, a: IAssertion) {
      let array = sections[sectionName]
      if (array == null) {
        array = []
        sections[sectionName] = array
      }
      array.push(a)
    }

    reports.forEach((report) => {
      startTime = startTime === null ? +report.startDate : Math.min(startTime, +report.startDate)

      endTime = endTime === null ?
        (+report.startDate + report.elapsedMilliseconds) :
        Math.max(endTime, +report.startDate + report.elapsedMilliseconds)


      report.assertions.forEach((assertion) =>  {

        let position = assertion.position
        let category = assertion.test.category + '' + assertion.test.name

        switch (assertion.type) {
          case SUCCESS:
            push(category, assertion)
            ++statSuccess
            break
          case FAILURE:
            push(category, assertion)
            ++statFailed
            break
          case ERROR:
            if (category) {
              push(category, assertion)
            } else {
              uncaughtErrors.push(assertion)
            }
            ++statError
            break
          case WARNING:
            push(category, assertion)
            break
          default:
            throw TypeError(JSON.stringify(assertion))
        }
      })
    })

    OwnKeysSorted(sections).forEach((sectionName) => {
      let matrix = ""
      let messages = ""
      let section = sections[sectionName]

      section.forEach((assertion) => {
        let message = assertion.message
        let position = assertion.position
        let positionMessage = position ? " (" + position.getFileName() + ":" + position.getLineNumber() + ")" : ""
        let typeName = ToString(assertion.type)

        switch(assertion.type) {
          case SUCCESS:
            matrix += "."
            break
          case FAILURE:
            matrix += "F"
            messages += "\n  [" + typeName + "]  " + message + positionMessage
            break
          case WARNING:
            matrix += "W"
            messages += "\n  [" + typeName + "]  " + message + positionMessage
            break
          case ERROR:
            matrix += "E"
            messages += "\n  [" + typeName + "] " + (assertion.stack || message)
            break
          default:
            throw TypeError(JSON.stringify(assertion))
        }
      })

      this._print(sectionName + " : ")
      this._print(matrix)
      this._print(messages)
      this._print("\n")
    })

    if (uncaughtErrors.length > 0) {
      this._println("Uncaught errors : ")
      let uncaughtError: IAssertion
      for (let i = 0, l = uncaughtErrors.length; i < l; ++i) {
        uncaughtError = uncaughtErrors[i]
        this._println("  [Error]  " + (uncaughtError.stack || uncaughtError.message))
      }
    }

    this._println()
    this._println("Duration : " + (endTime - startTime) + " ms")
    this._println("Total : " + (statSuccess + statFailed))
    this._println("Success : " + statSuccess + " / Failed : " + statFailed + " / Errors : " + statError)
    this._println("" + (statError !== 0 || statFailed !== 0 ? "FAILED!" : "SUCCESS!"))
  }

  private _print(s: string) {
    let id = "ts:trace"
    let element = document.getElementById(id)
    if (!element) {
      element = document.createElement("div")
      element.id = id
      document.body.appendChild(element)
    }
    let html = s
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;")
    element.innerHTML += html
  }

  private _println(v?: string) {
    this._print("\n")
    this._print(v || "")
  }

}
