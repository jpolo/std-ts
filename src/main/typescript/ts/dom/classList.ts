//Util
const divElement = document.createElement("div");
const hasClassList = "classList" in divElement;

const TokenError: any = /*DOMException || */TypeError;
const __keys = Object.keys;
const __indexed = function (a: string[]|DOMTokenList) {
  var returnValue: {[k: string]: boolean} = {};
  for (var i = 0, l = a.length; i < l; ++i) {
    returnValue[a[i]] = true;
  }
  return returnValue;
};
const __assertToken = function (token: string): string {
  if (token === '') {
    throw new TokenError('An invalid or illegal string was specified');
  } else if (/\s/.test(token)) {
    throw new TokenError('String contains an invalid character');
  }
  return token;
};
var __classListGet = function (element: HTMLElement): string[] {
  return element.className.split(/\s+/);
};
var __classListSet = function (element: HTMLElement, classNames: string[]) {
  element.className = classNames.join(" ");
};
var __classListContains = function (element: HTMLElement, className: string): boolean {
  return typeof className === "string" && element.classList.contains(className);
};
var __classListAdd = function (element: HTMLElement, className: string) {
  element.classList.add(className);
};
var __classListRemove = function (element: HTMLElement, className: string) {
  element.classList.remove(className);
};

//Compat
if (!hasClassList) {
  __classListGet = function (element: HTMLElement): string[] {
    return element.className.split(/\s+/);
  };
  __classListContains = function (element: HTMLElement, className: string): boolean {
    return typeof className === "string" && ((" " + element.className + " ").indexOf(" " + className + " ") !== -1);
  };
  __classListAdd = function (element: HTMLElement, className: string) {
    var elementClassName = element.className;
    if (
      typeof className === "string" &&
      ((" " + elementClassName + " ").indexOf(" " + className + " ") === -1)
    ) {
      element.className += (elementClassName.length ? ' ' : '') + className;
    }
  };
   __classListRemove = function (element: HTMLElement, className: string) {
    var classList = __classListGet(element);
    var i = classList.indexOf(classList[0]);
    if (i !== -1) {
      classList.splice(i, 1);
      __classListSet(element, classList);
    }
  };
}

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
    if (classNames.length !== 0) {
      element.className += (element.className.length ? ' ' : '') + classNamesNew.join(' ');
    }
  }

  //return
}

export function remove(element: HTMLElement, ...classNames: string[]): void {
  var l = classNames.length;
  var className: string;
  if (l === 0) {
    //Do nothing
  } else if (l === 1) {
    __classListRemove(element, classNames[0]);
  } else {
    var classIndex = __indexed(__classListGet(element));
    var changed = false;
    for (var i = 0; i < l; ++i) {
      className = __assertToken(classNames[i]);
      if (classIndex.hasOwnProperty(className)) {
        delete classIndex[className];
        changed = true;
      }
    }
    if (changed) {
      __classListSet(element, __keys(classIndex));
    }
  }
}

export function toggle(element: HTMLElement, className: string, condition?: boolean): boolean {
  __assertToken(className);
  if (condition === undefined) {
    condition = !__classListContains(element, className);
  }
  (condition ? __classListAdd : __classListRemove)(element, className);
  return condition;
}
