module classList {
  
  var divElement = document.createElement("div");
  var hasClassList = "classList" in divElement;

  var TokenError: any = DOMException || TypeError;
  var __assertToken = function (token: string): string {
    if (token === '') {
      throw new TokenError('An invalid or illegal string was specified');
    } else if (/\s/.test(token)) {
      throw new TokenError('String contains an invalid character');
    }
    return token;
  };
  var __classListContains = hasClassList ?
    function (element: HTMLElement, className: string): boolean {
      return typeof className === "string" && element.classList.contains(className);
    } :
    function (element: HTMLElement, className: string): boolean {
      return typeof className === "string" && ((" " + element.className + " ").indexOf(" " + className + " ") !== -1);
    };
  
  var __classListAdd = function (element: HTMLElement, classNames: string[]) {
    if (classNames.length !== 0) {
      element.className = (element.className.length ? ' ' : '') + classNames.join(' ');
    }
  };

  var _remove = hasClassList ?
    function (element, opt_classStr) {
      if (opt_classStr === undefined) {
        element.className = "";
      } else {
        var classListNew = _strToArray(opt_classStr);
        var classList = element.classList;
        for (var i = 0, len = classListNew.length; i < len; ++i) {
          classList.remove(classListNew[i]);
        }
      }
    } :
    function (element, opt_classStr) {
      var className = element.className;
      var classNameNew = "";
      if (opt_classStr !== undefined) {
        var classListNew = _strToArray(opt_classStr);
        classNameNew = " " + className + " ";
        for (var i = 0, len = classListNew.length; i < len; ++i) {
          classNameNew = classNameNew.replace(" " + classListNew[i] + " ", " ");
        }
        classNameNew = classNameNew.trim();
      }
      if (className !== classNameNew) {
        element.className = classNameNew;
      }
    };

  var _toggle = hasClassList ?
    function (element, classStr, opt_condition) {
      if (opt_condition === undefined) {
        var classListNew = _strToArray(classStr);
        var classList = element.classList;
        for (var i = 0, len = classListNew.length; i < len; ++i) {
          classList.toggle(classListNew[i]);
        }
      } else {
        (opt_condition ? _add : _remove)(element, classStr);
      }
      return opt_condition;
    } :
    function (element, classStr, opt_condition) {
      if (opt_condition === undefined) {
        var classListNew = _strToArray(classStr);
        for (var i = 0, len = classListNew.length, classNew; i < len; ++i) {
          classNew = classListNew[i];
          (__classListContains(element, classNew) ? _remove : _add)(element, classNew);
        }
      } else {
        (opt_condition ? _add : _remove)(element, classStr);
      }
      return opt_condition;   // Boolean
    };
  
  var _reSpaces = /\s+/, a1 = [""];
  var _strToArray = function (s: string): string[] {
    if (s && !_reSpaces.test(s)) {
      a1[0] = s;
      return a1;
    }
    var a = s.split(_reSpaces);
    if (a.length && !a[0]) {
      a.shift();
    }
    if (a.length && !a[a.length - 1]) {
      a.pop();
    }
    return a;
  };

  
  export function contains(element: HTMLElement, className: string): boolean {
    return __classListContains(element, className);
  }
  
  export function add(element: HTMLElement, ...classNames: string[]): void {
    var l = classNames.length;
    if (element && l !== 0) {
      var classNamesNew: string[] = [];
      for (var i = 0; i < l; i++) {
        var className = __assertToken(classNames[i]);
        if (typeof className === "string" && !__classListContains(element, className)) {
          classNamesNew.push(className);
        }
      }
      __classListAdd(element, classNamesNew);
    }
      
    
    
    //return 
  }
  
  export function remove(element: HTMLElement, classStr: string): void {
    return _remove(element, classStr);
  }
  
  export function toggle(element: HTMLElement, classStr: string, condition?: boolean): boolean {
    return _toggle(element, classStr, condition);
  }
}
export = classList