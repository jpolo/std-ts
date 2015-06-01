import unit = require("ts/unit");
import IAssertion = unit.IAssertion;
import IPrinter = unit.IPrinter;


module html {
  
  //Util
  var __keys = Object.keys;
  var __keysSorted = function (o) { return __keys(o).sort(); };
  var __str = function (o) { return "" + o; }; 
  
  //Constant
  var SUCCESS = unit.SUCCESS;
  var FAILURE = unit.FAILURE;
  var ERROR = unit.ERROR;
  var WARNING = unit.WARNING;

  export class HTMLPrinter implements IPrinter {
    
    print(reports: unit.ITestReport[]) {
      var startTime: number = null
      var endTime: number = null
      var statFailed = 0
      var statSuccess = 0
      var statError = 0
      var sections: {[key: string]: IAssertion[]} = {}
      var uncaughtErrors: IAssertion[] = []

      function push(sectionName: string, a: IAssertion) {
        var array = sections[sectionName]
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

          var position = assertion.position
          var category = assertion.test.category + '' + assertion.test.name

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

      __keysSorted(sections).forEach((sectionName) => {
        var matrix = ""
        var messages = ""
        var section = sections[sectionName]

        section.forEach((assertion) => {
if (assertion.position && !assertion.position.getFileName) {
  console.warn(assertion);
}

          var message = assertion.message
          var position = assertion.position
          var positionMessage = position ? " (" + position.getFileName() + ":" + position.getLineNumber() + ")" : ""
          var typeName = __str(assertion.type)

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
        var uncaughtError: IAssertion
        for (var i = 0, l = uncaughtErrors.length; i < l; ++i) {
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
      var id = "ts:trace"
      var element = document.getElementById(id)
      if (!element) {
        element = document.createElement("div")
        element.id = id
        document.body.appendChild(element)
      }
      var html = s
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

  
}
export = html;